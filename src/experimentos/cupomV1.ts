import type { Carrinho, ResumoCupom } from "../types";
import { buscarClienteId, ID_MORANGUINHO } from "../clientes";
import { listarItensCarrinho } from "../carrinho";
import { emCentavos, emReais } from "../validacoes";

// Experimento preservado para comparar regras; não é chamado na compra atual.
export function simularCupomV1(carrinho: Carrinho, clienteId: number, codigo: string): ResumoCupom {
  if (!buscarClienteId(clienteId)) {
    throw new Error("Cliente não encontrado.");
  }
  if (carrinho.length === 0) {
    throw new Error("O carrinho está vazio.");
  }
  const itens = listarItensCarrinho(carrinho);
  const subtotal = emReais(itens.reduce((soma, item) => soma + emCentavos(item.subtotal), 0));
  const cupom = codigo.trim().toUpperCase();
  if (cupom !== "THAY'S WIFE") {
    throw new Error("Cupom experimental inválido.");
  }
  if (clienteId !== ID_MORANGUINHO) {
    throw new Error("O cupom experimental é exclusivo da Moranguinho do Nordeste.");
  }
  return { subtotal, desconto: subtotal, total: 0, cupom };
}
