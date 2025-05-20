const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Carregando variáveis de ambiente
dotenv.config();

const app = express();

// Configuração de porta - variável de ambiente ou padrão 3000
const PORT = process.env.PORT || 3000;

// Endpoint do WMS
const WMS_ENDPOINT = 'http://webcorpem.no-ip.info:800/scripts/mh.dll/wc';

// Middleware
app.use(cors()); // Suporte a CORS
app.use(express.json({ limit: '50mb' })); // Análise de corpo JSON (suporte a payloads grandes)
app.use(morgan('dev')); // Log de requisições

// Endpoint de verificação de saúde
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API Proxy CorpEM-WMS está em execução' });
});

// Endpoint principal de proxy
app.post('/api/wms', async (req, res) => {
  try {
    // Obter corpo da requisição
    const requestBody = req.body;
    
    // Verificar tipo de conteúdo da requisição
    if (!req.is('application/json')) {
      return res.status(400).json({ 
        error: 'A requisição deve estar no formato JSON' 
      });
    }

    console.log('Requisição para API WMS:', JSON.stringify(requestBody, null, 2));

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Resposta da API WMS:', JSON.stringify(response.data, null, 2));

    // Retornar resposta do WMS para o cliente
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ocorrido:', error);
    
    // Se tiver resposta, retornar informações do erro
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    // Se a requisição falhar
    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Endpoint personalizado - Catálogo de produtos
app.post('/api/wms/products', async (req, res) => {
  try {
    const { CGCCLIWMS, PRODUTOS } = req.body;
    
    // Construção do payload JSON
    const payload = {
      CORPEM_ERP_MERC: {
        CGCCLIWMS,
        PRODUTOS
      }
    };

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na chamada da API de catálogo de produtos:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Endpoint personalizado - Entrada de mercadorias
app.post('/api/wms/inbound', async (req, res) => {
  try {
    const requestData = req.body;
    
    // Construção do payload JSON
    const payload = {
      CORPEM_ERP_DOC_ENT: requestData
    };

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na chamada da API de entrada de mercadorias:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Endpoint personalizado - Saída de mercadorias
app.post('/api/wms/outbound', async (req, res) => {
  try {
    const requestData = req.body;
    
    // Construção do payload JSON
    const payload = {
      CORPEM_ERP_DOC_SAI: requestData
    };

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na chamada da API de saída de mercadorias:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Endpoint personalizado - Consulta de estoque
app.post('/api/wms/inventory', async (req, res) => {
  try {
    const { CGCCLIWMS, CODPROD } = req.body;
    
    // Construção do payload JSON
    const payload = {
      CORPEM_ERP_ESTOQUE: {
        CGCCLIWMS,
        ...(CODPROD && { CODPROD }) // Adicionar código do produto apenas se especificado
      }
    };

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na chamada da API de consulta de estoque:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Endpoint personalizado - Cancelamento de pedido
app.post('/api/wms/cancel', async (req, res) => {
  try {
    const { CGCCLIWMS, NUMPEDCLI } = req.body;
    
    // Construção do payload JSON
    const payload = {
      CORPEM_ERP_CANC_PED: {
        CGCCLIWMS,
        NUMPEDCLI
      }
    };

    // Encaminhar requisição para API WMS
    const response = await axios.post(WMS_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro na chamada da API de cancelamento de pedido:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erro da API externa',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Erro do servidor',
      message: error.message || 'Ocorreu um erro desconhecido'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Proxy CorpEM-WMS iniciado na porta ${PORT}`);
  console.log(`Endpoint WMS: ${WMS_ENDPOINT}`);
}); 