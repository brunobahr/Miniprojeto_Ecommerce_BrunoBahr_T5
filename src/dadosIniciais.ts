import { cadastrarCliente, ID_MORANGUINHO } from "./clientes";
import { cadastrarProduto } from "./produtos";

export function carregarDadosIniciais(): void {
  // Preços fictícios multimilionários, escolhidos para o tema da loja.
  cadastrarProduto({
    id: 1, nome: "Como não morrer de fome sendo um designer que foi pra programação",
    categoria: "Livros", preco: 5_000_000, estoque: 10, tipo: "produto"
  });
  cadastrarProduto({
    id: 2, nome: "Caneca: Marido da Morena em horário comercial",
    categoria: "Presentes", preco: 2_000_000, estoque: 8, tipo: "produto"
  });
  cadastrarProduto({
    id: 3, nome: "Tradução de Sindarin — pacote de até 100 palavras",
    categoria: "Tradução", preco: 8_000_000, estoque: 4, tipo: "servico"
  });
  cadastrarProduto({
    id: 4, nome: "Rebranding pra sua empresa parar de parecer falida",
    categoria: "Design", preco: 30_000_000, estoque: 2, tipo: "servico"
  });
  cadastrarProduto({
    id: 5, nome: "Consultoria: sobrevivi ao briefing — sessão de 1 hora",
    categoria: "Consultoria", preco: 12_000_000, estoque: 3, tipo: "servico"
  });

  cadastrarCliente({ id: 1, nome: "Cabeça do Bruno Ltda", email: "head@cabecadobruno.com.thay", tipo: "B2B" });
  cadastrarCliente({ id: 2, nome: "Bruno H.", email: "brunohorlandobohr@gmail.com", tipo: "B2C" });
  cadastrarCliente({ id: 3, nome: "Marido da Morena s2", email: "maridodathaynara27@hotmail.com", tipo: "B2C" });
  cadastrarCliente({ id: ID_MORANGUINHO, nome: "Moranguinho do Nordeste", email: "moranguinho@example.com", tipo: "B2C" });
}
