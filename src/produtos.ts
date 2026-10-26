import type { AtualizacaoProduto, Produto } from "./types";
import { emCentavos, emReais, validarEstoque, validarId, validarPreco, validarTexto } from "./validacoes";

const produtos: Produto[] = [];

function validarProduto(produto: Produto): void {
  validarId(produto.id);
  validarTexto(produto.nome, "O nome do produto");
  validarTexto(produto.categoria, "A categoria");
  validarPreco(produto.preco);
  validarEstoque(produto.estoque);
  if (produto.tipo !== "produto" && produto.tipo !== "servico") {
    throw new Error("O tipo do item deve ser produto ou servico.");
  }
}

export function cadastrarProduto(produto: Produto): Produto {
  validarProduto(produto);
  if (produtos.find(item => item.id === produto.id)) {
    throw new Error("Já existe um produto com esse ID.");
  }
  const novoProduto: Produto = {
    ...produto,
    nome: produto.nome.trim(),
    categoria: produto.categoria.trim(),
    preco: emReais(emCentavos(produto.preco))
  };
  produtos.push(novoProduto);
  return { ...novoProduto };
}

export function listarProdutos(): Produto[] {
  return produtos.map(produto => ({ ...produto }));
}

export function buscarProdutoId(id: number): Produto | undefined {
  const produto = produtos.find(item => item.id === id);
  return produto ? { ...produto } : undefined;
}

export function buscarProdutoNome(nome: string): Produto[] {
  const busca = nome.trim().toLowerCase();
  return listarProdutos().filter(produto => produto.nome.toLowerCase().includes(busca));
}

export function buscarProdutoCategoria(categoria: string): Produto[] {
  const busca = categoria.trim().toLowerCase();
  return listarProdutos().filter(produto => produto.categoria.toLowerCase() === busca);
}

export function atualizarProduto(id: number, dados: AtualizacaoProduto): Produto {
  const indice = produtos.findIndex(produto => produto.id === id);
  if (indice === -1) {
    throw new Error("Produto não encontrado.");
  }
  const atual = produtos[indice];
  const atualizado: Produto = {
    id: atual.id,
    nome: dados.nome ?? atual.nome,
    categoria: dados.categoria ?? atual.categoria,
    preco: dados.preco ?? atual.preco,
    estoque: dados.estoque ?? atual.estoque,
    tipo: dados.tipo ?? atual.tipo
  };
  validarProduto(atualizado);
  atualizado.nome = atualizado.nome.trim();
  atualizado.categoria = atualizado.categoria.trim();
  atualizado.preco = emReais(emCentavos(atualizado.preco));
  produtos[indice] = atualizado;
  return { ...atualizado };
}

export function removerProduto(id: number): Produto {
  const indice = produtos.findIndex(produto => produto.id === id);
  if (indice === -1) {
    throw new Error("Produto não encontrado.");
  }
  const removidos = produtos.splice(indice, 1);
  return { ...removidos[0] };
}
