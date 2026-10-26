import type { Cliente } from "./types";
import { validarId, validarTexto } from "./validacoes";

const clientes: Cliente[] = [];
export const ID_MORANGUINHO = 4;

export function cadastrarCliente(cliente: Cliente): Cliente {
  validarId(cliente.id);
  validarTexto(cliente.nome, "O nome do cliente");
  validarTexto(cliente.email, "O e-mail");
  if (cliente.tipo !== "B2B" && cliente.tipo !== "B2C") {
    throw new Error("O tipo de cliente deve ser B2B ou B2C.");
  }
  if (clientes.find(item => item.id === cliente.id)) {
    throw new Error("Já existe um cliente com esse ID.");
  }
  const email = cliente.email.trim().toLowerCase();
  if (clientes.find(item => item.email === email)) {
    throw new Error("Já existe um cliente com esse e-mail.");
  }
  const novoCliente: Cliente = { ...cliente, nome: cliente.nome.trim(), email };
  clientes.push(novoCliente);
  return { ...novoCliente };
}

export function listarClientes(): Cliente[] {
  return clientes.map(cliente => ({ ...cliente }));
}

export function buscarClienteId(id: number): Cliente | undefined {
  const cliente = clientes.find(item => item.id === id);
  return cliente ? { ...cliente } : undefined;
}
