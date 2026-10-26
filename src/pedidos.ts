import type { Carrinho, Pedido } from "./types";
import { buscarClienteId } from "./clientes";
import { atualizarProduto, buscarProdutoId } from "./produtos";
import { calcularTotalCarrinho, listarItensCarrinho } from "./carrinho";
import { aplicarCupom } from "./cupons";

const pedidos: Pedido[] = [];
let proximoId = 1;

function copiarPedido(pedido: Pedido): Pedido {
  return {
    ...pedido,
    data: new Date(pedido.data.getTime()),
    itens: pedido.itens.map(item => ({ ...item }))
  };
}

export function finalizarPedido(carrinho: Carrinho, clienteId: number, codigoCupom?: string): Pedido {
  const cliente = buscarClienteId(clienteId);
  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }
  if (carrinho.length === 0) {
    throw new Error("O carrinho está vazio.");
  }

  // Toda validação acontece antes de alterar qualquer estoque ou registrar o pedido.
  const itens = listarItensCarrinho(carrinho);
  const subtotal = calcularTotalCarrinho(carrinho);
  const resumo = aplicarCupom(clienteId, subtotal, codigoCupom);
  const estoquesAtualizados = itens.map(item => {
    const produto = buscarProdutoId(item.produtoId);
    if (!produto) {
      throw new Error("Produto não encontrado.");
    }
    return { produtoId: produto.id, estoque: produto.estoque - item.quantidade };
  });

  const pedido: Pedido = {
    id: proximoId,
    clienteId: cliente.id,
    tipoCliente: cliente.tipo,
    itens,
    ...resumo,
    data: new Date()
  };

  estoquesAtualizados.forEach(item => atualizarProduto(item.produtoId, { estoque: item.estoque }));
  pedidos.push(pedido);
  proximoId += 1;
  carrinho.splice(0, carrinho.length);
  return copiarPedido(pedido);
}

export function listarPedidos(): Pedido[] {
  return pedidos.map(copiarPedido);
}

export function buscarPedidoId(id: number): Pedido | undefined {
  const pedido = pedidos.find(item => item.id === id);
  return pedido ? copiarPedido(pedido) : undefined;
}

export function listarPedidosPorCliente(clienteId: number): Pedido[] {
  return listarPedidos().filter(pedido => pedido.clienteId === clienteId);
}
