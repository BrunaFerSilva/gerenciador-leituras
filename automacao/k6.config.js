/**
 * Configuração K6 para diferentes ambientes
 * Facilita execução de testes em Development, Staging e Production
 */

// Configurações por ambiente
export const environments = {
  development: {
    baseUrl: 'http://localhost:8000',
    scenarios: {
      smoke_test: {
        executor: 'constant-vus',
        vus: 1,
        duration: '10s',
      },
      load_test: {
        executor: 'constant-vus', 
        vus: 5,
        duration: '30s',
      },
    },
    thresholds: {
      http_req_duration: ['p(95)<3000'],
      http_req_failed: ['rate<0.1'],
    },
  },

  staging: {
    baseUrl: 'https://staging.exemplo.com',
    scenarios: {
      load_test: {
        executor: 'constant-vus',
        vus: 20,
        duration: '2m',
      },
      stress_test: {
        executor: 'ramping-vus',
        stages: [
          { duration: '1m', target: 50 },
          { duration: '3m', target: 50 },
          { duration: '1m', target: 0 },
        ],
      },
    },
    thresholds: {
      http_req_duration: ['p(95)<2000'],
      http_req_failed: ['rate<0.05'],
    },
  },

  production: {
    baseUrl: 'https://prod.exemplo.com',
    scenarios: {
      load_test: {
        executor: 'constant-vus',
        vus: 50,
        duration: '5m',
      },
      stress_test: {
        executor: 'ramping-vus',
        stages: [
          { duration: '2m', target: 100 },
          { duration: '5m', target: 100 },
          { duration: '2m', target: 200 },
          { duration: '3m', target: 200 },
          { duration: '2m', target: 0 },
        ],
      },
      spike_test: {
        executor: 'ramping-vus',
        stages: [
          { duration: '30s', target: 500 },
          { duration: '1m', target: 500 },
          { duration: '30s', target: 0 },
        ],
      },
    },
    thresholds: {
      http_req_duration: ['p(95)<1500'],
      http_req_failed: ['rate<0.02'],
    },
  },
};

// Configuração padrão baseada no ambiente
export function getConfig(env = 'development') {
  const config = environments[env];
  
  if (!config) {
    throw new Error(`Ambiente '${env}' não encontrado. Disponíveis: ${Object.keys(environments).join(', ')}`);
  }

  return {
    ...config,
    // Configurações globais
    userAgent: 'K6-Performance-Test/1.0',
    insecureSkipTLSVerify: env === 'development',
    noConnectionReuse: false,
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'p(99.9)'],
    
    // Tags para identificação
    tags: {
      environment: env,
      team: 'qa',
      project: 'gerenciador-leituras',
    },
  };
}

// Utilitários para cenários específicos
export const scenarios = {
  // Teste de fumaça - validação básica
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '30s',
    description: 'Teste básico de funcionalidade',
  },

  // Teste de carga normal
  load: {
    executor: 'constant-vus',
    vus: 10,
    duration: '60s',
    description: 'Simulação de uso normal',
  },

  // Teste de stress - encontrar limites
  stress: {
    executor: 'ramping-vus',
    stages: [
      { duration: '30s', target: 20 },
      { duration: '60s', target: 50 },
      { duration: '60s', target: 100 },
      { duration: '30s', target: 0 },
    ],
    description: 'Teste progressivo até limites',
  },

  // Teste de pico - carga súbita
  spike: {
    executor: 'ramping-vus',
    stages: [
      { duration: '10s', target: 100 },
      { duration: '30s', target: 100 },
      { duration: '10s', target: 0 },
    ],
    description: 'Pico súbito de usuários',
  },

  // Teste de volume - execução prolongada
  volume: {
    executor: 'constant-vus',
    vus: 20,
    duration: '10m',
    description: 'Teste de estabilidade prolongada',
  },

  // Teste de breakpoint - até quebrar
  breakpoint: {
    executor: 'ramping-arrival-rate',
    stages: [
      { duration: '30s', target: 10 },
      { duration: '60s', target: 50 },
      { duration: '60s', target: 100 },
      { duration: '60s', target: 200 },
      { duration: '60s', target: 400 },
    ],
    preAllocatedVUs: 500,
    maxVUs: 1000,
    description: 'Teste até encontrar ponto de quebra',
  },
};

// Thresholds recomendados por tipo de aplicação
export const thresholds = {
  // Para aplicações web interativas
  web_app: {
    http_req_duration: ['p(95)<2000'],     // 95% < 2s
    http_req_failed: ['rate<0.05'],        // < 5% erro
    http_req_receiving: ['p(95)<100'],     // Download < 100ms
    http_req_connecting: ['p(95)<100'],    // Conexão < 100ms
  },

  // Para APIs REST
  api: {
    http_req_duration: ['p(95)<500'],      // 95% < 500ms
    http_req_failed: ['rate<0.01'],        // < 1% erro
    http_reqs: ['rate>100'],               // > 100 req/s
  },

  // Para aplicações críticas
  critical: {
    http_req_duration: ['p(99)<1000'],     // 99% < 1s
    http_req_failed: ['rate<0.001'],       // < 0.1% erro
    http_req_duration: ['avg<300'],        // Média < 300ms
  },

  // Para testes de desenvolvimento
  development: {
    http_req_duration: ['p(95)<5000'],     // Mais tolerante
    http_req_failed: ['rate<0.1'],         // 10% erro OK
  },
};

// Configurações de output para diferentes necessidades
export const outputs = {
  // Para CI/CD
  ci: ['json=reports/k6-results.json'],

  // Para análise detalhada
  analysis: [
    'json=reports/k6-detailed.json',
    'csv=reports/k6-metrics.csv',
  ],

  // Para integração com ferramentas de monitoramento
  monitoring: [
    'influxdb=http://localhost:8086/k6',
    'statsd=localhost:8125',
  ],

  // Para dashboards em tempo real
  realtime: [
    'json=reports/k6-realtime.json',
    '--summary-trend-stats=avg,min,med,max,p(90),p(95),p(99)',
  ],
};

// Função para gerar configuração completa
export function generateConfig(options = {}) {
  const {
    environment = 'development',
    scenario = 'load',
    output = 'ci',
    customThresholds = {},
  } = options;

  const envConfig = getConfig(environment);
  const selectedScenario = scenarios[scenario];
  const selectedThresholds = { ...thresholds.web_app, ...customThresholds };
  const selectedOutput = outputs[output];

  return {
    ...envConfig,
    scenarios: {
      [scenario]: selectedScenario,
    },
    thresholds: selectedThresholds,
    ext: {
      outputs: selectedOutput,
    },
  };
}

// Exemplo de uso:
// import { generateConfig } from './k6.config.js';
// export const options = generateConfig({
//   environment: 'staging',
//   scenario: 'stress',
//   output: 'analysis'
// });
