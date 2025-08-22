/**
 * Testes de Performance e Carga - K6
 * Suite completa de testes de performance para o Sistema Gerenciador de Leituras
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Métricas customizadas
const errorRate = new Rate('errors');
const loadTime = new Trend('load_time');
const responseTime = new Trend('response_time');
const failureCounter = new Counter('failures');

// Configuração de cenários
export const options = {
  scenarios: {
    // CT019 - Teste de carga básica
    basic_load: {
      executor: 'constant-vus',
      vus: 10,           // 10 usuários virtuais
      duration: '30s',    // Por 30 segundos
      tags: { test_type: 'load' },
      exec: 'basicLoadTest',
    },
    
    // CT020 - Teste de stress
    stress_test: {
      executor: 'ramping-vus',
      startTime: '35s',
      stages: [
        { duration: '30s', target: 50 },   // Sobe para 50 usuários
        { duration: '60s', target: 50 },   // Mantém 50 usuários
        { duration: '30s', target: 100 },  // Sobe para 100 usuários
        { duration: '60s', target: 100 },  // Mantém 100 usuários
        { duration: '30s', target: 0 },    // Volta para 0
      ],
      tags: { test_type: 'stress' },
      exec: 'stressTest',
    },

    // CT021 - Teste de picos (spike)
    spike_test: {
      executor: 'ramping-vus',
      startTime: '4m',
      stages: [
        { duration: '10s', target: 200 },  // Pico rápido para 200 usuários
        { duration: '10s', target: 200 },  // Mantém o pico
        { duration: '10s', target: 0 },    // Volta ao normal
      ],
      tags: { test_type: 'spike' },
      exec: 'spikeTest',
    },

    // CT022 - Teste de volume (soak)
    soak_test: {
      executor: 'constant-vus',
      startTime: '5m',
      vus: 20,
      duration: '5m',     // Teste prolongado
      tags: { test_type: 'soak' },
      exec: 'soakTest',
    },
  },

  // Thresholds (critérios de aceitação)
  thresholds: {
    http_req_duration: ['p(95)<2000'],        // 95% das requests < 2s
    http_req_failed: ['rate<0.05'],           // Taxa de erro < 5%
    errors: ['rate<0.1'],                     // Taxa de erro customizada < 10%
    load_time: ['p(90)<3000'],               // 90% carregam < 3s
    response_time: ['avg<1000'],             // Tempo médio < 1s
  },

  // Configurações gerais
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
};

// URLs base para testes
const BASE_URL = 'http://localhost:8000';  // Servidor local
const STATIC_FILES = [
  '/index.html',
  '/script.js', 
  '/style.css',
  '/background.jpg'
];

// Dados de teste para simulação
const TEST_BOOKS = [
  { title: 'Clean Code', author: 'Robert Martin' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
  { title: 'Design Patterns', author: 'Gang of Four' },
  { title: 'Refactoring', author: 'Martin Fowler' },
  { title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
];

// Função auxiliar para simular interação realística
function simulateUserBehavior() {
  // Think time entre ações (usuário real)
  sleep(Math.random() * 2 + 1); // 1-3 segundos
}

/**
 * CT019 - Teste de Carga Básica
 * Simula uso normal da aplicação com múltiplos usuários
 */
export function basicLoadTest() {
  const startTime = Date.now();
  
  // 1. Carregar página principal
  let response = http.get(`${BASE_URL}/index.html`);
  
  check(response, {
    'página principal carrega': (r) => r.status === 200,
    'tempo de resposta OK': (r) => r.timings.duration < 2000,
    'conteúdo HTML presente': (r) => r.body.includes('Gerenciador de Leituras'),
  });

  if (response.status !== 200) {
    errorRate.add(1);
    failureCounter.add(1);
    return;
  }

  responseTime.add(response.timings.duration);
  simulateUserBehavior();

  // 2. Carregar recursos estáticos
  const batch = http.batch([
    ['GET', `${BASE_URL}/script.js`],
    ['GET', `${BASE_URL}/style.css`],
    ['GET', `${BASE_URL}/background.jpg`],
  ]);

  batch.forEach((res, index) => {
    check(res, {
      [`recurso ${STATIC_FILES[index + 1]} carrega`]: (r) => r.status === 200,
    });
    
    if (res.status !== 200) {
      errorRate.add(1);
    }
  });

  simulateUserBehavior();

  // 3. Simular interações com localStorage (via JavaScript)
  // Como K6 não executa JavaScript do browser, simulamos as operações
  
  const totalTime = Date.now() - startTime;
  loadTime.add(totalTime);

  // Marcar como erro se muito lento
  if (totalTime > 5000) {
    errorRate.add(1);
    console.log(`Carregamento lento detectado: ${totalTime}ms`);
  }
}

/**
 * CT020 - Teste de Stress  
 * Testa limites do sistema com carga crescente
 */
export function stressTest() {
  const testData = TEST_BOOKS[Math.floor(Math.random() * TEST_BOOKS.length)];
  
  // Teste mais agressivo - múltiplas requests simultâneas
  const responses = http.batch([
    ['GET', `${BASE_URL}/index.html`],
    ['GET', `${BASE_URL}/script.js`],
    ['GET', `${BASE_URL}/style.css`],
  ]);

  let allSuccess = true;
  responses.forEach((response, index) => {
    const success = check(response, {
      [`stress - arquivo ${index} OK`]: (r) => r.status === 200,
      [`stress - tempo ${index} OK`]: (r) => r.timings.duration < 3000,
    });
    
    if (!success) {
      allSuccess = false;
      errorRate.add(1);
    }
  });

  // Simular carga pesada no frontend (seria feito via JavaScript)
  if (allSuccess) {
    // Simular operações intensivas no localStorage
    sleep(0.1); // Simula processamento
  }

  // Think time menor em teste de stress
  sleep(Math.random() * 0.5 + 0.2);
}

/**
 * CT021 - Teste de Pico (Spike)
 * Testa comportamento em picos súbitos de tráfego
 */
export function spikeTest() {
  const startTime = Date.now();
  
  // Requests mais rápidas para simular pico real
  let response = http.get(`${BASE_URL}/index.html`, {
    timeout: '5s',
  });

  const success = check(response, {
    'spike - página carrega': (r) => r.status === 200,
    'spike - não trava': (r) => r.timings.duration < 5000,
    'spike - conteúdo OK': (r) => r.body && r.body.length > 1000,
  });

  if (!success) {
    errorRate.add(1);
    failureCounter.add(1);
  }

  responseTime.add(response.timings.duration);
  
  // Durante picos, usuários são menos pacientes
  sleep(Math.random() * 0.3);
}

/**
 * CT022 - Teste de Volume (Soak)
 * Testa estabilidade em execução prolongada
 */
export function soakTest() {
  // Simula usuário que fica muito tempo na aplicação
  
  // 1. Carregamento inicial
  let response = http.get(`${BASE_URL}/index.html`);
  
  check(response, {
    'soak - aplicação estável': (r) => r.status === 200,
    'soak - sem degradação': (r) => r.timings.duration < 2000,
  });

  if (response.status !== 200) {
    errorRate.add(1);
    return;
  }

  // 2. Simular múltiplas interações ao longo do tempo
  for (let i = 0; i < 3; i++) {
    simulateUserBehavior();
    
    // Simular reload/refresh da página
    response = http.get(`${BASE_URL}/index.html`);
    
    check(response, {
      [`soak - reload ${i + 1} OK`]: (r) => r.status === 200,
    });

    if (response.status !== 200) {
      errorRate.add(1);
    }
  }

  // Usuário permanece mais tempo na aplicação
  sleep(Math.random() * 3 + 2); // 2-5 segundos
}

/**
 * Teste específico para validar performance com dados
 * Simula aplicação com muitos livros carregados
 */
export function heavyDataTest() {
  // Este teste seria executado com aplicação pré-carregada com dados
  let response = http.get(`${BASE_URL}/index.html`);
  
  check(response, {
    'dados pesados - carrega': (r) => r.status === 200,
    'dados pesados - performance': (r) => r.timings.duration < 3000,
    'dados pesados - tamanho OK': (r) => r.body.length > 5000,
  });

  if (response.status !== 200) {
    errorRate.add(1);
  }

  responseTime.add(response.timings.duration);
}

/**
 * Setup function - executada uma vez no início
 */
export function setup() {
  console.log('🚀 Iniciando testes de performance com K6');
  console.log(`📊 URL base: ${BASE_URL}`);
  console.log('📋 Cenários configurados: basic_load, stress_test, spike_test, soak_test');
  
  // Verificar se aplicação está acessível
  let response = http.get(`${BASE_URL}/index.html`);
  if (response.status !== 200) {
    throw new Error(`❌ Aplicação não acessível em ${BASE_URL}. Status: ${response.status}`);
  }
  
  console.log('✅ Aplicação acessível - iniciando testes');
  return { baseUrl: BASE_URL };
}

/**
 * Teardown function - executada uma vez no final  
 */
export function teardown(data) {
  console.log('🏁 Testes de performance finalizados');
  console.log(`📊 URL testada: ${data.baseUrl}`);
}

/**
 * Função para gerar relatório customizado
 */
export function handleSummary(data) {
  console.log('📋 Gerando relatórios de performance...');
  
  return {
    'reports/performance/k6-summary.html': htmlReport(data),
    'reports/performance/k6-summary.json': JSON.stringify(data, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Configurações específicas por ambiente
 */
export const ENV_CONFIG = {
  development: {
    baseUrl: 'http://localhost:8000',
    vus: 10,
    duration: '30s'
  },
  staging: {
    baseUrl: 'https://staging.exemplo.com',
    vus: 50, 
    duration: '5m'
  },
  production: {
    baseUrl: 'https://prod.exemplo.com',
    vus: 100,
    duration: '10m'
  }
};

// Logs de debug para análise
console.log('📊 K6 Performance Test Suite initialized');
console.log(`🎯 Target: ${BASE_URL}`);
console.log('📈 Métricas: response_time, load_time, error_rate, failures');
