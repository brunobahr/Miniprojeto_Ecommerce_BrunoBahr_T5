import { strict as assert } from "node:assert";
import { carregarDadosIniciais } from "../dadosIniciais";
import { adicionarAoCarrinho, calcularTotalCarrinho, criarCarrinho } from "../carrinho";
import { aplicarCupom, CUPOM_MORANGUINHO, ID_MORANGUINHO } from "../cupons";
import { simularCupomV1 } from "./cupomV1";

carregarDadosIniciais();
const carrinho = criarCarrinho();
adicionarAoCarrinho(carrinho, 1, 1);

const versao1 = simularCupomV1(carrinho, ID_MORANGUINHO, "Thay's Wife");
const versao2 = aplicarCupom(ID_MORANGUINHO, calcularTotalCarrinho(carrinho), CUPOM_MORANGUINHO);
const atendeNovaRegra = versao1.total === versao2.total;
assert.equal(versao1.total, 0);
assert.equal(versao2.total, 100_000);
assert.throws(() => simularCupomV1(carrinho, 2, "Thay's Wife"), /exclusivo/);
assert.throws(() => aplicarCupom(2, calcularTotalCarrinho(carrinho), CUPOM_MORANGUINHO), /exclusivo/);
assert.throws(() => aplicarCupom(ID_MORANGUINHO, calcularTotalCarrinho(carrinho), "Thay's Wife"), /Cupom inválido/);

console.log("Experimento real: mudança da regra do cupom");
console.table([
  { versao: "V1 — Thay's Wife", percentual: "100%", ...versao1 },
  { versao: "V2 — Moranguinho98", percentual: "98%", ...versao2 }
]);
console.log("V1 atende à regra experimental de 100%: PASSOU.");
console.log("V1 atende à nova regra de 98%:", atendeNovaRegra ? "SIM" : "NÃO — retorna zero; a nova regra exige R$ 100.000,00.");
console.log("V2 atende à regra de 98%: PASSOU.");
console.log("Cliente sem permissão: bloqueado nas duas versões.");
console.log("Cupom antigo na compra atual: bloqueado.");
console.log("A diferença no total vem da mudança de regra. Uma função única não provoca erro por si só.");
