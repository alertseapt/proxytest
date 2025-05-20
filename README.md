# API Proxy CorpEM-WMS

Servidor de API proxy para integração com o sistema CorpEM-WMS. Este proxy foi projetado para resolver problemas de CORS (Compartilhamento de Recursos entre Origens) entre aplicações cliente e a API CorpEM-WMS.

## Funcionalidades

- Suporte a CORS: permite requisições de domínios cruzados
- Requisições e respostas em formato JSON
- Suporte a múltiplos endpoints
- Tratamento de erros
- Registro de requisições

## Instalação

```bash
# Clonar o repositório
git clone [URL do repositório]
cd corpem-wms-proxy

# Instalar dependências
npm install
```

## Configuração do Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3000
WMS_ENDPOINT=http://webcorpem.no-ip.info:37560/scripts/mh.dll/wc
```

## Como Usar

### Iniciar o Servidor

```bash
# Modo de desenvolvimento
npm run dev

# Modo de produção
npm start
```

### Endpoints

| Endpoint | Descrição |
|--------------|------|
| `GET /` | Verificação de saúde |
| `POST /api/wms` | Proxy WMS genérico - encaminha qualquer requisição JSON |
| `POST /api/wms/products` | Operações do catálogo de produtos (CORPEM_ERP_MERC) |
| `POST /api/wms/inbound` | Informações de entrada (CORPEM_ERP_DOC_ENT) |
| `POST /api/wms/outbound` | Informações de saída (CORPEM_ERP_DOC_SAI) |
| `POST /api/wms/inventory` | Consulta de estoque (CORPEM_ERP_ESTOQUE) |
| `POST /api/wms/cancel` | Cancelamento de pedido (CORPEM_ERP_CANC_PED) |

### Exemplos de Uso

#### Consulta de Estoque

```javascript
// Consulta de estoque de todos os produtos
fetch('http://localhost:3000/api/wms/inventory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    CGCCLIWMS: '10584607000110'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// Consulta de estoque de um produto específico
fetch('http://localhost:3000/api/wms/inventory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    CGCCLIWMS: '10584607000110',
    CODPROD: '002'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Endpoint de API Genérico

Enviar qualquer requisição para a API CorpEM-WMS:

```javascript
fetch('http://localhost:3000/api/wms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    CORPEM_ERP_MERC: {
      CGCCLIWMS: '00000002000000',
      PRODUTOS: [
        {
          CODPROD: '1003',
          NOMEPROD: 'Produto de Exemplo',
          // Outros campos necessários
        }
      ]
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Tratamento de Erros

A API proxy trata os seguintes casos de erro:

- Formato JSON inválido
- Erros de conexão com o servidor WMS
- Respostas de erro do servidor WMS
- Outros erros internos

Exemplo de resposta de erro:

```json
{
  "error": "Erro da API externa",
  "details": {
    "CORPEM_WS_ERRO": "077 - Nenhuma Mercadoria informada"
  }
}
```

## Considerações de Segurança

Este proxy foi projetado para uso em redes internas. Ao usar em ambiente de produção, adicione medidas de autenticação e segurança adequadas. 