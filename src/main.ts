import { carregarDadosIniciais } from "./dadosIniciais";
import { atualizarProduto, buscarProdutoCategoria, buscarProdutoId, buscarProdutoNome, cadastrarProduto, listarProdutos, removerProduto } from "./produtos";
import { buscarClienteId, cadastrarCliente, listarClientes } from "./clientes";
import { adicionarAoCarrinho, alterarQuantidade, calcularSubtotalItem, calcularTotalCarrinho, criarCarrinho, listarItensCarrinho, removerDoCarrinho } from "./carrinho";
import { buscarPedidoId, finalizarPedido, listarPedidos, listarPedidosPorCliente } from "./pedidos";
import { CUPOM_MORANGUINHO, ID_MORANGUINHO } from "./cupons";
import { gerarRelatorioVendas } from "./relatorios";

function dinheiro(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function testarBloqueio(
  descricao: string,
  mensagemEsperada: string,
  acao: () => unknown,
  mensagemNaTela?: string
): void {
  try {
    acao();
    console.error(`Opa, falhou em ${descricao}: passou, mas era pra dar erro aqui.`);
    process.exitCode = 1;
  } catch (erro) {
    if (!(erro instanceof Error) || !erro.message.includes(mensagemEsperada)) {
      throw erro;
    }

    console.log(mensagemNaTela ?? `Aqui barrou ${descricao}: ${erro.message}`);
  }
}

console.log("Bruno's Worlds");
console.log("Trabalhos, interesses e a minha morena");
console.log("Tudo ficticio e com preço multimilionario, pq aqui a gente sonha alto kkk.\n");

carregarDadosIniciais();

console.log("1. Bora ver o que tem na loja");
console.table(listarProdutos());
console.log("Buscando o produto de ID 1:", buscarProdutoId(1));
console.log("Procurando DESIGNER em parte do nome:", buscarProdutoNome("DESIGNER"));
console.log("Agora so a categoria tradução:", buscarProdutoCategoria("tradução"));

console.log("\n2. Criando um produto so pra testar, mudar e depois tirar");

cadastrarProduto({
  id: 99,
  nome: "Briefing temporário do multiverso",
  categoria: "Design",
  preco: 3_000_000,
  estoque: 1,
  tipo: "servico"
});

console.log(
  "Depois da alteraçao:",
  atualizarProduto(99, {
    nome: "Briefing revisado do multiverso",
    preco: 4_000_000
  })
);

console.log("Produto que tirei:", removerProduto(99));

console.log("\n3. Quem vai comprar essas coisas? Clientes B2B e B2C");
console.table(listarClientes());
console.log("Buscando o cliente 3:", buscarClienteId(3));

console.log("\n4. Bora montar esse carrinho");

const carrinhoEmpresa = criarCarrinho();

adicionarAoCarrinho(carrinhoEmpresa, 1, 1);
adicionarAoCarrinho(carrinhoEmpresa, 1, 1);

console.log(
  "Coloquei o mesmo produto duas vezes, olha ai como ficou:",
  carrinhoEmpresa
);

adicionarAoCarrinho(carrinhoEmpresa, 3, 1);
adicionarAoCarrinho(carrinhoEmpresa, 5, 1);
alterarQuantidade(carrinhoEmpresa, 1, 3);
removerDoCarrinho(carrinhoEmpresa, 5);

console.table(listarItensCarrinho(carrinhoEmpresa));

console.log(
  "Quanto deu so de livro:",
  dinheiro(calcularSubtotalItem(carrinhoEmpresa, 1))
);

console.log(
  "Total do carrinho ate aqui:",
  dinheiro(calcularTotalCarrinho(carrinhoEmpresa))
);

console.log("\n5. Fechando a compra da empresa e conferindo o estoque");

const estoqueAntes = buscarProdutoId(1)?.estoque;
const pedidoEmpresa = finalizarPedido(carrinhoEmpresa, 1);

console.log("Pedido da empresa:", pedidoEmpresa);

console.log(
  "Tinha de livro:",
  estoqueAntes,
  "| ficou com:",
  buscarProdutoId(1)?.estoque
);

console.log("Carrinho depois de fechar a compra:", carrinhoEmpresa);

console.log("\n6. Agora e a compra do Bruno, sem cupom mesmo");

const carrinhoBruno = criarCarrinho();

adicionarAoCarrinho(carrinhoBruno, 2, 1);

console.log("Pedido B2C do Bruno:", finalizarPedido(carrinhoBruno, 2));

console.log("\n7. Vez da Moranguinho do Nordeste: 98% de desconto, pq sim kkk");

const carrinhoMoranguinho = criarCarrinho();

adicionarAoCarrinho(carrinhoMoranguinho, 1, 1);

const pedidoMoranguinho = finalizarPedido(
  carrinhoMoranguinho,
  ID_MORANGUINHO,
  CUPOM_MORANGUINHO
);

console.log("Antes do desconto:", dinheiro(pedidoMoranguinho.subtotal));
console.log("Desconto dela:", dinheiro(pedidoMoranguinho.desconto));
console.log("Ficou pra pagar:", dinheiro(pedidoMoranguinho.total));

console.log("\n8. Mudei o preço do livro. Bora ver se o pedido antigo ta igual");

atualizarProduto(1, { preco: 6_000_000 });

console.log(
  "Livro no catalogo agora:",
  dinheiro(buscarProdutoId(1)?.preco ?? 0)
);

console.log(
  "Preço do livro que ficou salvo no primeiro pedido:",
  dinheiro(buscarPedidoId(pedidoEmpresa.id)?.itens[0].precoUnitario ?? 0)
);

console.log("Pedidos da Cabeça do Bruno Ltda:", listarPedidosPorCliente(1));
console.log("Quantos pedidos foram feitos:", listarPedidos().length);

console.log("\n9. Agora vou tentar umas coisas erradas pra ver se o sistema barra");

testarBloqueio(
  "preço zero",
  "O preço deve ser maior que zero",
  () => cadastrarProduto({
    id: 90,
    nome: "Produto sem preço",
    categoria: "Teste",
    preco: 0,
    estoque: 1,
    tipo: "produto"
  })
);

testarBloqueio(
  "e-mail repetido",
  "Já existe um cliente com esse e-mail",
  () => cadastrarCliente({
    id: 90,
    nome: "Cliente repetido",
    email: " BRUNOHORLANDOBOHR@GMAIL.COM ",
    tipo: "B2C"
  })
);

testarBloqueio(
  "quantidade maior que o estoque",
  "Estoque insuficiente",
  () => adicionarAoCarrinho(criarCarrinho(), 1, 999)
);

testarBloqueio(
  "carrinho vazio",
  "O carrinho está vazio",
  () => finalizarPedido(criarCarrinho(), 1)
);

testarBloqueio(
  "cliente inexistente",
  "Cliente não encontrado",
  () => finalizarPedido(criarCarrinho(), 999)
);

const carrinhoSemPermissao = criarCarrinho();

adicionarAoCarrinho(carrinhoSemPermissao, 2, 1);

testarBloqueio(
  "Bruno H. tentando o cupom da Moranguinho",
  "exclusivo da Moranguinho",
  () => finalizarPedido(carrinhoSemPermissao, 2, CUPOM_MORANGUINHO)
);

testarBloqueio(
  "cupom experimental antigo na versão atual",
  "Cupom inválido",
  () => finalizarPedido(carrinhoSemPermissao, 2, "Thay's Wife"),
  "404 não encontrado"
);

console.log("\n10. O ultimo item ficou sem estoque. Bora ver se preserva o resto");

cadastrarProduto({
  id: 98,
  nome: "Serviço temporariamente sem agenda",
  categoria: "Teste",
  preco: 2_000_000,
  estoque: 1,
  tipo: "servico"
});

const carrinhoSemEstoque = criarCarrinho();

adicionarAoCarrinho(carrinhoSemEstoque, 1, 1);
adicionarAoCarrinho(carrinhoSemEstoque, 98, 1);

atualizarProduto(98, { estoque: 0 });

const estoqueAntesDaFalha = buscarProdutoId(1)?.estoque;
const pedidosAntesDaFalha = listarPedidos().length;

testarBloqueio(
  "último item perdeu disponibilidade",
  "Estoque insuficiente",
  () => finalizarPedido(carrinhoSemEstoque, 3)
);

console.log(
  "Estoque do primeiro item ficou igual?",
  buscarProdutoId(1)?.estoque === estoqueAntesDaFalha
);

console.log(
  "Continuou com a mesma quantidade de pedidos?",
  listarPedidos().length === pedidosAntesDaFalha
);

console.log(
  "Os dois itens ainda tao no carrinho?",
  carrinhoSemEstoque.length === 2
);

removerProduto(98);

console.log("\n11. Bora ver quanto essa brincadeira vendeu");

const relatorio = gerarRelatorioVendas();

console.log("Pedidos fechados:", relatorio.quantidadePedidos);
console.log("Total vendido antes dos descontos:", dinheiro(relatorio.receitaBruta));
console.log("Quanto foi de desconto:", dinheiro(relatorio.descontosConcedidos));
console.log("Total vendido depois dos descontos:", dinheiro(relatorio.receitaLiquida));
console.log("Total depois dos descontos - B2B:", dinheiro(relatorio.receitaPorTipo.B2B));
console.log("Total depois dos descontos - B2C:", dinheiro(relatorio.receitaPorTipo.B2C));

console.table(relatorio.vendasPorProduto);