import type { Carrinho, ItemPedido } from "./types";
import { buscarProdutoId } from "./produtos";
import { emCentavos, emReais, validarQuantidade } from "./validacoes";

export function criarCarrinho(): Carrinho {
  return [];
}

export function adicionarAoCarrinho(carrinho: Carrinho, produtoId: number, quantidade: number): void {
  validarQuantidade(quantidade);
  const produto = buscarProdutoId(produtoId);
  if (!produto) {
    throw new Error("Produto não encontrado.");
  }
  const item = carrinho.find(itemAtual => itemAtual.produtoId === produtoId);
  const novaQuantidade = quantidade + (item ? item.quantidade : 0);
  validarQuantidade(novaQuantidade);
  if (novaQuantidade > produto.estoque) {
    throw new Error("Estoque insuficiente.");
  }
  if (item) {
    item.quantidade = novaQuantidade;
  } else {
    carrinho.push({ produtoId, quantidade });
  }
}

export function alterarQuantidade(carrinho: Carrinho, produtoId: number, quantidade: number): void {
  validarQuantidade(quantidade);
  const item = carrinho.find(itemAtual => itemAtual.produtoId === produtoId);
  if (!item) {
    throw new Error("Item não encontrado no carrinho.");
  }
  const produto = buscarProdutoId(produtoId);
  if (!produto) {
    throw new Error("Produto não encontrado.");
  }
  if (quantidade > produto.estoque) {
    throw new Error("Estoque insuficiente.");
  }
  item.quantidade = quantidade;
}

export function removerDoCarrinho(carrinho: Carrinho, produtoId: number): void {
  const indice = carrinho.findIndex(item => item.produtoId === produtoId);
  if (indice === -1) {
    throw new Error("Item não encontrado no carrinho.");
  }
  carrinho.splice(indice, 1);
}

export function listarItensCarrinho(carrinho: Carrinho): ItemPedido[] {
  const itens: ItemPedido[] = [];
  carrinho.forEach(item => {
    validarQuantidade(item.quantidade);
    if (itens.find(outro => outro.produtoId === item.produtoId)) {
      throw new Error("Produto repetido no carrinho. Use adicionarAoCarrinho para somar quantidades.");
    }
    const produto = buscarProdutoId(item.produtoId);
    if (!produto) {
      throw new Error("Produto não encontrado.");
    }
    if (item.quantidade > produto.estoque) {
      throw new Error("Estoque insuficiente.");
    }
    itens.push({
      produtoId: produto.id,
      nomeProduto: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal: emReais(emCentavos(produto.preco) * item.quantidade)
    });
  });
  return itens;
}

export function calcularSubtotalItem(carrinho: Carrinho, produtoId: number): number {
  const item = listarItensCarrinho(carrinho).find(itemAtual => itemAtual.produtoId === produtoId);
  if (!item) {
    throw new Error("Item não encontrado no carrinho.");
  }
  return item.subtotal;
}

export function calcularTotalCarrinho(carrinho: Carrinho): number {
  const centavos = listarItensCarrinho(carrinho).reduce((total, item) => total + emCentavos(item.subtotal), 0);
  return emReais(centavos);
}
