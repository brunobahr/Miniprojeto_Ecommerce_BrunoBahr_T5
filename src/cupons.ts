import type { ResumoCupom } from "./types";
import { buscarClienteId, ID_MORANGUINHO } from "./clientes";
import { emCentavos, emReais } from "./validacoes";

export { ID_MORANGUINHO } from "./clientes";
export const CUPOM_MORANGUINHO = "MORANGUINHO98";

export function aplicarCupom(clienteId: number, subtotal: number, codigo?: string): ResumoCupom {
  if (!buscarClienteId(clienteId)) {
    throw new Error("Cliente não encontrado.");
  }
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Subtotal inválido.");
  }
  const subtotalCentavos = emCentavos(subtotal);
  const cupom = codigo?.trim().toUpperCase();
  if (!cupom) {
    return { subtotal: emReais(subtotalCentavos), desconto: 0, total: emReais(subtotalCentavos) };
  }
  if (cupom !== CUPOM_MORANGUINHO) {
    throw new Error("Cupom inválido.");
  }
  if (clienteId !== ID_MORANGUINHO) {
    throw new Error("Este cupom é exclusivo da Moranguinho do Nordeste.");
  }
  const descontoCentavos = Math.round(subtotalCentavos * 0.98);
  return {
    subtotal: emReais(subtotalCentavos),
    desconto: emReais(descontoCentavos),
    total: emReais(subtotalCentavos - descontoCentavos),
    cupom
  };
}
