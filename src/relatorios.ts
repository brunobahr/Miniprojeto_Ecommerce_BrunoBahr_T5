import type { RelatorioVendas, VendaPorProduto } from "./types";
import { listarPedidos } from "./pedidos";
import { emCentavos, emReais } from "./validacoes";

export function gerarRelatorioVendas(): RelatorioVendas {
  const pedidos = listarPedidos();
  const vendasPorProduto: VendaPorProduto[] = [];

  pedidos.forEach(pedido => {
    pedido.itens.forEach(item => {
      const venda = vendasPorProduto.find(produto => produto.produtoId === item.produtoId);
      if (venda) {
        venda.quantidadeVendida += item.quantidade;
        venda.receitaBruta = emReais(emCentavos(venda.receitaBruta) + emCentavos(item.subtotal));
      } else {
        vendasPorProduto.push({
          produtoId: item.produtoId,
          nomeProduto: item.nomeProduto,
          quantidadeVendida: item.quantidade,
          receitaBruta: item.subtotal
        });
      }
    });
  });

  const receitaBruta = emReais(pedidos.reduce((soma, pedido) => soma + emCentavos(pedido.subtotal), 0));
  const descontosConcedidos = emReais(pedidos.reduce((soma, pedido) => soma + emCentavos(pedido.desconto), 0));
  const receitaLiquida = emReais(pedidos.reduce((soma, pedido) => soma + emCentavos(pedido.total), 0));
  const receitaB2B = emReais(pedidos.filter(pedido => pedido.tipoCliente === "B2B")
    .reduce((soma, pedido) => soma + emCentavos(pedido.total), 0));
  const receitaB2C = emReais(pedidos.filter(pedido => pedido.tipoCliente === "B2C")
    .reduce((soma, pedido) => soma + emCentavos(pedido.total), 0));

  return {
    quantidadePedidos: pedidos.length,
    receitaBruta,
    descontosConcedidos,
    receitaLiquida,
    receitaPorTipo: { B2B: receitaB2B, B2C: receitaB2C },
    vendasPorProduto
  };
}
