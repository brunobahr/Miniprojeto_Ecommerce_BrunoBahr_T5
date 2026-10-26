import { strict as assert } from "node:assert";
import { carregarDadosIniciais } from "../dadosIniciais";
import { atualizarProduto, buscarProdutoCategoria, buscarProdutoId, buscarProdutoNome, cadastrarProduto, listarProdutos, removerProduto } from "../produtos";
import { buscarClienteId, cadastrarCliente, listarClientes } from "../clientes";

carregarDadosIniciais();
assert.equal(listarProdutos().length, 5);
assert.equal(listarClientes().length, 4);
assert.equal(buscarProdutoId(1)?.preco, 5_000_000);
assert.equal(buscarClienteId(1)?.tipo, "B2B");
assert.equal(buscarProdutoNome("DESIGNER").length, 1);
assert.equal(buscarProdutoCategoria("tradução").length, 1);

cadastrarProduto({ id: 99, nome: "Produto temporário", categoria: "Teste", preco: 2_000_000, estoque: 1, tipo: "produto" });
assert.equal(atualizarProduto(99, { preco: 3_000_000 }).preco, 3_000_000);
removerProduto(99);
assert.equal(buscarProdutoId(99), undefined);

assert.throws(() => cadastrarProduto({ id: 98, nome: "Inválido", categoria: "Teste", preco: 0, estoque: 1, tipo: "produto" }), /preço/);
assert.throws(() => cadastrarCliente({ id: 99, nome: "Cliente repetido", email: " BRUNOHORLANDOBOHR@GMAIL.COM ", tipo: "B2C" }), /esse e-mail/);

console.log("ETAPA CADASTROS: PASSOU.");
console.log("Conferidos: cinco produtos, quatro clientes, consultas, atualização, remoção e bloqueios de preço/e-mail.");
console.table(listarProdutos());
