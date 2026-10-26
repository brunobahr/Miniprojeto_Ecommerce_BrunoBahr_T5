import { strict as assert } from "node:assert";
import { carregarDadosIniciais } from "../dadosIniciais";
import { ID_MORANGUINHO } from "../clientes";
import { adicionarAoCarrinho, alterarQuantidade, calcularTotalCarrinho, criarCarrinho, removerDoCarrinho } from "../carrinho";
import { simularCupomV1 } from "../experimentos/cupomV1";

carregarDadosIniciais();
const carrinho = criarCarrinho();
adicionarAoCarrinho(carrinho, 1, 1);
adicionarAoCarrinho(carrinho, 1, 1);
assert.equal(carrinho.length, 1);
assert.equal(carrinho[0].quantidade, 2);
alterarQuantidade(carrinho, 1, 1);
adicionarAoCarrinho(carrinho, 2, 1);
removerDoCarrinho(carrinho, 2);
assert.equal(calcularTotalCarrinho(carrinho), 5_000_000);

const resultado = simularCupomV1(carrinho, ID_MORANGUINHO, "Thay's Wife");
assert.equal(resultado.subtotal, 5_000_000);
assert.equal(resultado.desconto, 5_000_000);
assert.equal(resultado.total, 0);
assert.throws(() => simularCupomV1(carrinho, 2, "Thay's Wife"), /exclusivo/);
assert.throws(() => simularCupomV1(carrinho, ID_MORANGUINHO, "outro código"), /inválido/);
console.log("ETAPA CARRINHO + CUPOM EXPERIMENTAL DE 100%: PASSOU.");
console.log(resultado);
console.log("Cliente sem permissão e código incorreto foram bloqueados.");
