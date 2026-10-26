export function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("O ID deve ser um número inteiro positivo.");
  }
}

export function validarTexto(texto: string, campo: string): void {
  if (texto.trim() === "") {
    throw new Error(`${campo} não pode estar vazio.`);
  }
}

export function validarQuantidade(quantidade: number): void {
  if (!Number.isSafeInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um número inteiro maior que zero.");
  }
}

export function validarEstoque(estoque: number): void {
  if (!Number.isSafeInteger(estoque) || estoque < 0) {
    throw new Error("O estoque deve ser um número inteiro igual ou maior que zero.");
  }
}

export function emCentavos(valor: number): number {
  const centavos = Math.round((valor + Number.EPSILON) * 100);
  if (!Number.isFinite(valor) || !Number.isSafeInteger(centavos)) {
    throw new Error("Valor monetário inválido ou fora do limite de cálculo.");
  }
  return centavos;
}

export function emReais(centavos: number): number {
  if (!Number.isSafeInteger(centavos)) {
    throw new Error("Valor monetário inválido ou fora do limite de cálculo.");
  }
  return centavos / 100;
}

export function validarPreco(preco: number): void {
  if (!Number.isFinite(preco) || preco <= 0 || emCentavos(preco) <= 0) {
    throw new Error("O preço deve ser maior que zero, com no mínimo um centavo.");
  }
}
