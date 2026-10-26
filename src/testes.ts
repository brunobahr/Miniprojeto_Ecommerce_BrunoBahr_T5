import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { Carrinho, Cliente, Produto, TipoCliente } from "./types";
import { atualizarProduto, buscarProdutoCategoria, buscarProdutoId, buscarProdutoNome, cadastrarProduto, listarProdutos, removerProduto } from "./produtos";
import { buscarClienteId, cadastrarCliente, listarClientes } from "./clientes";
import { adicionarAoCarrinho, alterarQuantidade, calcularSubtotalItem, calcularTotalCarrinho, criarCarrinho, listarItensCarrinho, removerDoCarrinho } from "./carrinho";
import { buscarPedidoId, finalizarPedido, listarPedidos, listarPedidosPorCliente } from "./pedidos";
import { aplicarCupom, CUPOM_MORANGUINHO, ID_MORANGUINHO } from "./cupons";
import { gerarRelatorioVendas } from "./relatorios";
import { emCentavos } from "./validacoes";
import { simularCupomV1 } from "./experimentos/cupomV1";

let proximoProduto = 1_000;
let proximoCliente = 1_000;

function novoProduto(preco = 5_000_000, estoque = 10): Produto {
  const id = proximoProduto++;
  return cadastrarProduto({ id, nome: `Produto de teste ${id}`, categoria: `Categoria ${id}`, preco, estoque, tipo: "produto" });
}

function novoCliente(tipo: TipoCliente = "B2C"): Cliente {
  const id = proximoCliente++;
  return cadastrarCliente({ id, nome: `Cliente de teste ${id}`, email: `cliente${id}@example.com`, tipo });
}

function carrinhoCom(produto: Produto, quantidade = 1): Carrinho {
  const carrinho = criarCarrinho();
  adicionarAoCarrinho(carrinho, produto.id, quantidade);
  return carrinho;
}

cadastrarCliente({ id: ID_MORANGUINHO, nome: "Moranguinho do Nordeste", email: "moranguinho@example.com", tipo: "B2C" });

test("produto: cadastro válido aceita estoque zero e normaliza espaços", () => {
  const id = proximoProduto++;
  const produto = cadastrarProduto({ id, nome: " Livro ", categoria: " Livros ", preco: 5_000_000, estoque: 0, tipo: "produto" });
  assert.equal(produto.nome, "Livro");
  assert.equal(produto.categoria, "Livros");
  assert.equal(buscarProdutoId(id)?.estoque, 0);
});

test("produto: ID duplicado é bloqueado sem inserir outro registro", () => {
  const produto = novoProduto();
  const antes = listarProdutos().length;
  assert.throws(() => cadastrarProduto(produto), /Já existe um produto com esse ID/);
  assert.equal(listarProdutos().length, antes);
});

test("produto: nome vazio, preço inválido e estoque inválido são rejeitados", () => {
  const base = { id: proximoProduto++, nome: "Teste", categoria: "Teste", preco: 5_000_000, estoque: 1, tipo: "produto" as const };
  const antes = listarProdutos().length;
  assert.throws(() => cadastrarProduto({ ...base, nome: "  " }), /nome do produto/);
  assert.throws(() => cadastrarProduto({ ...base, categoria: "  " }), /categoria/);
  [0, -1, NaN, Infinity].forEach(preco => assert.throws(() => cadastrarProduto({ ...base, preco }), /preço/));
  [-1, 1.5, NaN, Infinity].forEach(estoque => assert.throws(() => cadastrarProduto({ ...base, estoque }), /estoque/));
  assert.equal(listarProdutos().length, antes);
});

test("produto: buscas por ID, nome parcial e categoria respeitam o resultado esperado", () => {
  const produto = novoProduto();
  atualizarProduto(produto.id, { nome: `Livro de Sindarin ${produto.id}` });
  assert.equal(buscarProdutoId(produto.id)?.id, produto.id);
  assert.equal(buscarProdutoId(-100), undefined);
  assert.deepEqual(buscarProdutoNome(`SINDARIN ${produto.id}`).map(item => item.id), [produto.id]);
  assert.deepEqual(buscarProdutoCategoria(produto.categoria.toUpperCase()).map(item => item.id), [produto.id]);
  assert.deepEqual(buscarProdutoCategoria("categoria inexistente"), []);
});

test("produto: atualização válida conserva ID e aceita estoque zero", () => {
  const produto = novoProduto();
  const atualizado = atualizarProduto(produto.id, { nome: "Nome atualizado", preco: 8_000_000, estoque: 0, tipo: "servico" });
  assert.equal(atualizado.id, produto.id);
  assert.equal(atualizado.preco, 8_000_000);
  assert.equal(atualizado.estoque, 0);
  assert.equal(atualizado.tipo, "servico");
});

test("produto: atualização inválida preserva o registro anterior", () => {
  const produto = novoProduto();
  assert.throws(() => atualizarProduto(produto.id, { preco: 0 }), /preço/);
  assert.throws(() => atualizarProduto(produto.id, { nome: "" }), /nome/);
  assert.throws(() => atualizarProduto(produto.id, { estoque: -1 }), /estoque/);
  assert.deepEqual(buscarProdutoId(produto.id), produto);
});

test("produto: remoção e tentativa de remover ID inexistente", () => {
  const produto = novoProduto();
  assert.equal(removerProduto(produto.id).id, produto.id);
  assert.equal(buscarProdutoId(produto.id), undefined);
  assert.throws(() => removerProduto(produto.id), /Produto não encontrado/);
});

test("produto: alterar uma cópia de consulta não modifica o catálogo", () => {
  const produto = novoProduto();
  const copia = buscarProdutoId(produto.id);
  assert.ok(copia);
  copia.estoque = -99;
  assert.equal(buscarProdutoId(produto.id)?.estoque, produto.estoque);
});

test("cliente: cadastro B2B, consulta e normalização de e-mail", () => {
  const id = proximoCliente++;
  const cliente = cadastrarCliente({ id, nome: " Empresa ", email: " EMPRESA@EXAMPLE.COM ", tipo: "B2B" });
  assert.equal(cliente.email, "empresa@example.com");
  assert.equal(cliente.nome, "Empresa");
  assert.deepEqual(buscarClienteId(id), cliente);
  assert.ok(listarClientes().find(item => item.id === id));
});

test("cliente: ID e e-mail repetidos são bloqueados, inclusive com caixa diferente", () => {
  const cliente = novoCliente();
  const antes = listarClientes().length;
  assert.throws(() => cadastrarCliente(cliente), /esse ID/);
  assert.throws(() => cadastrarCliente({ ...cliente, id: proximoCliente++, email: ` ${cliente.email.toUpperCase()} ` }), /esse e-mail/);
  assert.equal(listarClientes().length, antes);
});

test("cliente: nome e e-mail vazios são rejeitados", () => {
  const base = { id: proximoCliente++, nome: "Cliente", email: "teste@example.com", tipo: "B2C" as const };
  assert.throws(() => cadastrarCliente({ ...base, nome: " " }), /nome do cliente/);
  assert.throws(() => cadastrarCliente({ ...base, email: " " }), /e-mail/);
});

test("carrinho: repetir produto soma quantidade e não reserva estoque", () => {
  const produto = novoProduto(5_000_000, 5);
  const carrinho = carrinhoCom(produto, 2);
  adicionarAoCarrinho(carrinho, produto.id, 3);
  assert.equal(carrinho.length, 1);
  assert.equal(carrinho[0].quantidade, 5);
  assert.equal(buscarProdutoId(produto.id)?.estoque, 5);
});

test("carrinho: quantidades zero, negativas, fracionadas e não finitas são bloqueadas", () => {
  const produto = novoProduto();
  const carrinho = criarCarrinho();
  [0, -1, 0.5, NaN, Infinity].forEach(quantidade => assert.throws(() => adicionarAoCarrinho(carrinho, produto.id, quantidade), /quantidade/));
  assert.equal(carrinho.length, 0);
});

test("carrinho: estoque considera a quantidade já adicionada e preserva item em falha", () => {
  const produto = novoProduto(5_000_000, 3);
  const carrinho = carrinhoCom(produto, 2);
  assert.throws(() => adicionarAoCarrinho(carrinho, produto.id, 2), /Estoque insuficiente/);
  assert.equal(carrinho[0].quantidade, 2);
  assert.throws(() => adicionarAoCarrinho(carrinho, -100, 1), /Produto não encontrado/);
});

test("carrinho: alterar quantidade recalcula subtotal e total", () => {
  const produto = novoProduto(5_000_000, 5);
  const carrinho = carrinhoCom(produto, 1);
  alterarQuantidade(carrinho, produto.id, 3);
  assert.equal(calcularSubtotalItem(carrinho, produto.id), 15_000_000);
  assert.equal(calcularTotalCarrinho(carrinho), 15_000_000);
  assert.throws(() => alterarQuantidade(carrinho, produto.id, 6), /Estoque insuficiente/);
  assert.equal(carrinho[0].quantidade, 3);
});

test("carrinho: remoção, item inexistente e total de carrinho vazio", () => {
  const produto = novoProduto();
  const carrinho = carrinhoCom(produto);
  removerDoCarrinho(carrinho, produto.id);
  assert.equal(calcularTotalCarrinho(carrinho), 0);
  assert.throws(() => removerDoCarrinho(carrinho, produto.id), /Item não encontrado/);
  assert.throws(() => alterarQuantidade(carrinho, produto.id, 1), /Item não encontrado/);
});

test("cálculo monetário: 0,10 + 0,20 resulta em 0,30", () => {
  const primeiro = novoProduto(0.1);
  const segundo = novoProduto(0.2);
  const carrinho = carrinhoCom(primeiro);
  adicionarAoCarrinho(carrinho, segundo.id, 1);
  assert.equal(calcularTotalCarrinho(carrinho), 0.3);
});

test("pedido: cliente inexistente e carrinho vazio preservam estoque e histórico", () => {
  const produto = novoProduto();
  const carrinho = carrinhoCom(produto);
  const cliente = novoCliente();
  const antes = listarPedidos().length;
  assert.throws(() => finalizarPedido(carrinho, -100), /Cliente não encontrado/);
  assert.throws(() => finalizarPedido(criarCarrinho(), cliente.id), /carrinho está vazio/);
  assert.equal(listarPedidos().length, antes);
  assert.equal(buscarProdutoId(produto.id)?.estoque, produto.estoque);
  assert.equal(carrinho.length, 1);
});

test("pedido: compra válida registra itens, data e total, baixa estoque e limpa carrinho", () => {
  const produto = novoProduto(5_000_000, 5);
  const cliente = novoCliente("B2B");
  const carrinho = carrinhoCom(produto, 2);
  const pedido = finalizarPedido(carrinho, cliente.id);
  assert.equal(pedido.total, 10_000_000);
  assert.equal(pedido.tipoCliente, "B2B");
  assert.equal(pedido.itens[0].quantidade, 2);
  assert.ok(pedido.data instanceof Date);
  assert.equal(buscarProdutoId(produto.id)?.estoque, 3);
  assert.equal(carrinho.length, 0);
});

test("pedido: outro carrinho esgota o último item; nenhuma baixa parcial ocorre", () => {
  const primeiro = novoProduto(5_000_000, 5);
  const ultimo = novoProduto(2_000_000, 1);
  const cliente = novoCliente();
  const carrinho = carrinhoCom(primeiro, 2);
  adicionarAoCarrinho(carrinho, ultimo.id, 1);
  finalizarPedido(carrinhoCom(ultimo), cliente.id);
  const antes = listarPedidos().length;
  assert.throws(() => finalizarPedido(carrinho, cliente.id), /Estoque insuficiente/);
  assert.equal(buscarProdutoId(primeiro.id)?.estoque, 5);
  assert.equal(buscarProdutoId(ultimo.id)?.estoque, 0);
  assert.equal(listarPedidos().length, antes);
  assert.equal(carrinho.length, 2);
});

test("pedido: item duplicado inserido manualmente é rejeitado sem estoque negativo", () => {
  const produto = novoProduto(5_000_000, 1);
  const cliente = novoCliente();
  const carrinho: Carrinho = [{ produtoId: produto.id, quantidade: 1 }, { produtoId: produto.id, quantidade: 1 }];
  const antes = listarPedidos().length;
  assert.throws(() => finalizarPedido(carrinho, cliente.id), /Produto repetido/);
  assert.equal(buscarProdutoId(produto.id)?.estoque, 1);
  assert.equal(listarPedidos().length, antes);
});

test("pedido: produto removido depois da montagem impede toda a compra", () => {
  const primeiro = novoProduto();
  const removido = novoProduto();
  const carrinho = carrinhoCom(primeiro);
  adicionarAoCarrinho(carrinho, removido.id, 1);
  removerProduto(removido.id);
  const antes = listarPedidos().length;
  assert.throws(() => finalizarPedido(carrinho, novoCliente().id), /Produto não encontrado/);
  assert.equal(buscarProdutoId(primeiro.id)?.estoque, primeiro.estoque);
  assert.equal(listarPedidos().length, antes);
});

test("pedido: preço é definido na finalização e permanece após alteração e remoção", () => {
  const produto = novoProduto(5_000_000);
  const cliente = novoCliente();
  const carrinho = carrinhoCom(produto, 2);
  atualizarProduto(produto.id, { preco: 8_000_000 });
  const pedido = finalizarPedido(carrinho, cliente.id);
  atualizarProduto(produto.id, { preco: 30_000_000, nome: "Nome novo" });
  removerProduto(produto.id);
  const historico = buscarPedidoId(pedido.id);
  assert.equal(historico?.itens[0].precoUnitario, 8_000_000);
  assert.equal(historico?.total, 16_000_000);
  assert.equal(historico?.itens[0].nomeProduto, produto.nome);
});

test("pedido: IDs gerados são únicos e consulta por cliente filtra corretamente", () => {
  const produto = novoProduto();
  const primeiroCliente = novoCliente();
  const segundoCliente = novoCliente();
  const primeiro = finalizarPedido(carrinhoCom(produto), primeiroCliente.id);
  const segundo = finalizarPedido(carrinhoCom(produto), segundoCliente.id);
  assert.notEqual(primeiro.id, segundo.id);
  assert.deepEqual(listarPedidosPorCliente(primeiroCliente.id).map(item => item.id), [primeiro.id]);
  assert.equal(buscarPedidoId(-100), undefined);
});

test("pedido: mudar o objeto devolvido não altera os preços históricos armazenados", () => {
  const produto = novoProduto();
  const pedido = finalizarPedido(carrinhoCom(produto), novoCliente().id);
  const dataOriginal = pedido.data.getTime();
  pedido.itens[0].precoUnitario = 0;
  pedido.data.setFullYear(1900);
  assert.equal(buscarPedidoId(pedido.id)?.itens[0].precoUnitario, produto.preco);
  assert.equal(buscarPedidoId(pedido.id)?.data.getTime(), dataOriginal);
});

test("cupom V1: Thay's Wife oferece 100% e resulta em total zero", () => {
  const carrinho = carrinhoCom(novoProduto());
  const resultado = simularCupomV1(carrinho, ID_MORANGUINHO, "Thay's Wife");
  assert.equal(resultado.subtotal, 5_000_000);
  assert.equal(resultado.desconto, 5_000_000);
  assert.equal(resultado.total, 0);
  assert.throws(() => simularCupomV1(carrinho, novoCliente().id, "Thay's Wife"), /exclusivo/);
});

test("cupom atual: 98% em cinco milhões deixa cem mil a pagar", () => {
  const resultado = aplicarCupom(ID_MORANGUINHO, 5_000_000, " moranguinho98 ");
  assert.equal(resultado.desconto, 4_900_000);
  assert.equal(resultado.total, 100_000);
  assert.equal(resultado.cupom, CUPOM_MORANGUINHO);
});

test("cupom: outro cliente é bloqueado mesmo que tenha o mesmo nome", () => {
  const id = proximoCliente++;
  cadastrarCliente({ id, nome: "Moranguinho do Nordeste", email: "outramoranguinho@example.com", tipo: "B2C" });
  assert.throws(() => aplicarCupom(id, 5_000_000, CUPOM_MORANGUINHO), /exclusivo/);
});

test("cupom: nome antigo, código desconhecido, cliente inexistente e subtotal inválido", () => {
  assert.throws(() => aplicarCupom(ID_MORANGUINHO, 5_000_000, "Thay's Wife"), /Cupom inválido/);
  assert.throws(() => aplicarCupom(ID_MORANGUINHO, 5_000_000, "DESCONTO999"), /Cupom inválido/);
  assert.throws(() => aplicarCupom(-100, 5_000_000, CUPOM_MORANGUINHO), /Cliente não encontrado/);
  [-1, NaN, Infinity].forEach(subtotal => assert.throws(() => aplicarCupom(ID_MORANGUINHO, subtotal, CUPOM_MORANGUINHO), /Subtotal inválido/));
});

test("cupom: ausência de código mantém subtotal, e arredondamento usa centavos", () => {
  assert.deepEqual(aplicarCupom(ID_MORANGUINHO, 5_000_000), { subtotal: 5_000_000, desconto: 0, total: 5_000_000 });
  const resultado = aplicarCupom(ID_MORANGUINHO, 1.99, CUPOM_MORANGUINHO);
  assert.equal(resultado.desconto, 1.95);
  assert.equal(resultado.total, 0.04);
});

test("cupom: falha de permissão preserva pedido, estoque, carrinho e sequência de IDs", () => {
  const produto = novoProduto();
  const cliente = novoCliente();
  const carrinho = carrinhoCom(produto);
  const pedidosAntes = listarPedidos();
  assert.throws(() => finalizarPedido(carrinho, cliente.id, CUPOM_MORANGUINHO), /exclusivo/);
  assert.equal(listarPedidos().length, pedidosAntes.length);
  assert.equal(buscarProdutoId(produto.id)?.estoque, produto.estoque);
  assert.equal(carrinho.length, 1);
  const pedido = finalizarPedido(carrinho, cliente.id);
  const ultimoId = pedidosAntes[pedidosAntes.length - 1]?.id ?? 0;
  assert.equal(pedido.id, ultimoId + 1);
});

test("relatório: preços históricos, descontos, quantidades e receitas B2B/B2C", () => {
  const antes = gerarRelatorioVendas();
  const produto = novoProduto(5_000_000, 5);
  const empresa = novoCliente("B2B");
  finalizarPedido(carrinhoCom(produto, 2), empresa.id);
  const pedidoComCupom = finalizarPedido(carrinhoCom(produto), ID_MORANGUINHO, CUPOM_MORANGUINHO);
  assert.equal(pedidoComCupom.total, 100_000);
  atualizarProduto(produto.id, { preco: 30_000_000 });
  const depois = gerarRelatorioVendas();
  assert.equal(depois.quantidadePedidos - antes.quantidadePedidos, 2);
  assert.equal(emCentavos(depois.receitaBruta) - emCentavos(antes.receitaBruta), 1_500_000_000);
  assert.equal(emCentavos(depois.descontosConcedidos) - emCentavos(antes.descontosConcedidos), 490_000_000);
  assert.equal(emCentavos(depois.receitaLiquida) - emCentavos(antes.receitaLiquida), 1_010_000_000);
  assert.equal(emCentavos(depois.receitaPorTipo.B2B) - emCentavos(antes.receitaPorTipo.B2B), 1_000_000_000);
  assert.equal(emCentavos(depois.receitaPorTipo.B2C) - emCentavos(antes.receitaPorTipo.B2C), 10_000_000);
  const venda = depois.vendasPorProduto.find(item => item.produtoId === produto.id);
  assert.equal(venda?.quantidadeVendida, 3);
  assert.equal(venda?.receitaBruta, 15_000_000);
});

test("serviço: estoque representa quantidade de pacotes ou sessões disponíveis", () => {
  const produto = novoProduto(12_000_000, 1);
  atualizarProduto(produto.id, { tipo: "servico" });
  finalizarPedido(carrinhoCom(produto), novoCliente().id);
  assert.equal(buscarProdutoId(produto.id)?.estoque, 0);
  assert.throws(() => adicionarAoCarrinho(criarCarrinho(), produto.id, 1), /Estoque insuficiente/);
});
