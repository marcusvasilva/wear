const TINY_BASE_URL = "https://api.tiny.com.br/api2";

function getToken(): string {
  const token = process.env.TINY_API_TOKEN;
  if (!token) throw new Error("TINY_API_TOKEN nao configurado");
  return token;
}

interface TinyPedidoItem {
  item: {
    codigo: string;
    descricao: string;
    unidade: string;
    quantidade: number;
    valor_unitario: number;
  };
}

interface TinyPedido {
  pedido: {
    numero_pedido_ecommerce?: string;
    data_pedido: string;
    situacao: string;
    cliente: {
      nome: string;
      cpf_cnpj: string;
      email: string;
      fone: string;
      endereco: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
    itens: TinyPedidoItem[];
    valor_frete: number;
    valor_desconto: number;
    obs?: string;
    forma_pagamento?: string;
    meio_pagamento?: string;
  };
}

interface TinyResponse {
  retorno: {
    status_processamento: string;
    status: string;
    registros?: {
      registro?: {
        id?: string;
        sequencia?: string;
      };
    };
    erros?: Array<{ erro: string }>;
  };
}

interface IncluirPedidoParams {
  orderId: string;
  customerName: string;
  customerCpf: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    logradouro: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  items: Array<{
    sku: string;
    descricao: string;
    quantidade: number;
    valorUnitario: number; // em reais (float)
  }>;
  valorFrete: number; // em reais (float)
  valorDesconto: number; // em reais (float)
  paymentMethod: string;
}

export async function incluirPedido(params: IncluirPedidoParams): Promise<string> {
  const today = new Date().toLocaleDateString("pt-BR");

  const pedido: TinyPedido = {
    pedido: {
      numero_pedido_ecommerce: params.orderId,
      data_pedido: today,
      situacao: "aprovado",
      cliente: {
        nome: params.customerName,
        cpf_cnpj: params.customerCpf,
        email: params.customerEmail,
        fone: params.customerPhone,
        endereco: params.address.logradouro,
        numero: params.address.numero,
        complemento: params.address.complemento ?? undefined,
        bairro: params.address.bairro,
        cidade: params.address.cidade,
        uf: params.address.estado,
        cep: params.address.cep,
      },
      itens: params.items.map((item) => ({
        item: {
          codigo: item.sku,
          descricao: item.descricao,
          unidade: "Un",
          quantidade: item.quantidade,
          valor_unitario: item.valorUnitario,
        },
      })),
      valor_frete: params.valorFrete,
      valor_desconto: params.valorDesconto,
      forma_pagamento: params.paymentMethod === "credit_card" ? "cartao" : params.paymentMethod,
      meio_pagamento: "Pagar.me",
    },
  };

  const formData = new URLSearchParams();
  formData.append("token", getToken());
  formData.append("formato", "json");
  formData.append("pedido", JSON.stringify(pedido));

  const response = await fetch(`${TINY_BASE_URL}/incluir.pedido.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data: TinyResponse = await response.json();

  if (data.retorno.status !== "OK") {
    const erros = data.retorno.erros?.map((e) => e.erro).join(", ") ?? "Erro desconhecido";
    throw new Error(`Tiny ERP: ${erros}`);
  }

  const pedidoId = data.retorno.registros?.registro?.id;
  if (!pedidoId) throw new Error("Tiny ERP: ID do pedido nao retornado");

  return pedidoId;
}

export async function gerarNotaFiscal(pedidoId: string): Promise<string> {
  const formData = new URLSearchParams();
  formData.append("token", getToken());
  formData.append("formato", "json");
  formData.append("id", pedidoId);

  const response = await fetch(`${TINY_BASE_URL}/gerar.nota.fiscal.pedido.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data: TinyResponse = await response.json();

  if (data.retorno.status !== "OK") {
    const erros = data.retorno.erros?.map((e) => e.erro).join(", ") ?? "Erro desconhecido";
    throw new Error(`Tiny NF-e: ${erros}`);
  }

  const nfeId = data.retorno.registros?.registro?.id;
  if (!nfeId) throw new Error("Tiny NF-e: ID da nota nao retornado");

  return nfeId;
}

export async function obterNotaFiscal(nfeId: string): Promise<{
  numero: string;
  serie: string;
  chaveAcesso: string;
  linkDanfe: string;
}> {
  const formData = new URLSearchParams();
  formData.append("token", getToken());
  formData.append("formato", "json");
  formData.append("id", nfeId);

  const response = await fetch(`${TINY_BASE_URL}/obter.nota.fiscal.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await response.json();

  const nf = data.retorno?.nota_fiscal;
  return {
    numero: nf?.numero ?? "",
    serie: nf?.serie ?? "",
    chaveAcesso: nf?.chave_acesso ?? "",
    linkDanfe: nf?.link_danfe ?? "",
  };
}
