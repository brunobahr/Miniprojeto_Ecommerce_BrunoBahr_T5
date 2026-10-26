export type TipoItem = "produto" | "servico";
export type TipoCliente = "B2B" | "B2C";

export type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  tipo: TipoItem;
};

export type AtualizacaoProduto = {
  nome?: string;
  categoria?: string;
  preco?: number;
  estoque?: number;
  tipo?: TipoItem;
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  tipo: TipoCliente;
};

export type ItemCarrinho = {
  produtoId: number;
  quantidade: number;
};

export type Carrinho = ItemCarrinho[];

export type ItemPedido = {
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type ResumoCupom = {
  subtotal: number;
  desconto: number;
  total: number;
  cupom?: string;
};

export type Pedido = {
  id: number;
  clienteId: number;
  tipoCliente: TipoCliente;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  total: number;
  cupom?: string;
  data: Date;
};

export type VendaPorProduto = {
  produtoId: number;
  nomeProduto: string;
  quantidadeVendida: number;
  receitaBruta: number;
};

export type RelatorioVendas = {
  quantidadePedidos: number;
  receitaBruta: number;
  descontosConcedidos: number;
  receitaLiquida: number;
  receitaPorTipo: { B2B: number; B2C: number };
  vendasPorProduto: VendaPorProduto[];
};
