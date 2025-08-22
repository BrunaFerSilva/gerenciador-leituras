# 🤖 AUTOMAÇÃO DE TESTES
## Sistema Gerenciador de Leituras

Suíte completa de testes automatizados cobrindo testes unitários, end-to-end, performance e carga de dados.

---

## 📁 Estrutura do Projeto

```
automacao/
├── package.json                    # Dependências e scripts npm
├── README.md                       # Este arquivo
├── tests/
│   ├── setup/
│   │   └── jest.setup.js           # Configuração global Jest
│   ├── unit/
│   │   └── bookManager.test.js     # Testes unitários JavaScript
│   ├── e2e/
│   │   ├── crud-operations.test.js # Testes E2E - operações CRUD
│   │   ├── search-filter.test.js   # Testes E2E - busca e filtros
│   │   └── mobile-responsiveness.test.js # Testes E2E - responsividade
│   ├── performance/
│   │   ├── load-test.js            # Testes de carga K6
│   │   ├── browser-performance.js  # Performance no browser
│   │   └── run-performance-tests.js # Executor de testes
│   └── load/
│       └── data-loader.js          # Gerador de dados de teste
├── test-data/                      # Datasets gerados para testes
├── reports/                        # Relatórios de execução
│   ├── performance/                # Relatórios K6
│   └── load-tests/                 # Relatórios de carga
└── coverage/                       # Relatórios de cobertura
```

---

## 🚀 Quick Start

### 1. Instalação
```bash
cd automacao
npm install
npx playwright install
```

### 2. Executar Todos os Testes
```bash
npm run test:all
```

### 3. Executar Testes Específicos
```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Testes de performance
npm run test:performance

# Gerar dados de teste
npm run test:load
```

---

## 🧪 Tipos de Teste

### Testes Unitários (Jest)
**Arquivo:** `tests/unit/bookManager.test.js`  
**Cobertura:** 23 casos de teste cobrindo todas as funções da classe BookManager

**Principais cenários testados:**
- ✅ Cadastro de livros (válidos, duplicatos, campos obrigatórios)
- ✅ Edição e exclusão de livros
- ✅ Controle de status de leitura
- ✅ Filtros por categoria (Todos, Para Ler, Lidos)
- ✅ Busca por título e autor
- ✅ Persistência de dados (localStorage)
- ✅ Validações e segurança (XSS, duplicatas)

**Execução:**
```bash
npm test                    # Execução simples
npm run test:watch         # Modo watch
npm run test:coverage      # Com cobertura
```

**Métricas de qualidade:**
- **Cobertura mínima:** 85% (lines, functions, branches, statements)
- **Casos de teste:** 35+ cenários
- **Assertions:** 150+ verificações

### Testes End-to-End (Playwright)
**Arquivos:** `tests/e2e/*.test.js`  
**Cobertura:** Interface completa em múltiplos navegadores

#### CRUD Operations (`crud-operations.test.js`)
- Cadastro, edição, exclusão de livros
- Validações de formulário
- Controle de status de leitura
- Modais de confirmação
- Persistência após reload

#### Search & Filter (`search-filter.test.js`)
- Filtros por categoria
- Busca em tempo real
- Combinação filtros + busca
- Casos edge (sem resultados, caracteres especiais)

#### Mobile Responsiveness (`mobile-responsiveness.test.js`)
- Testes em dispositivos: iPhone SE, iPhone 12, Galaxy S21, iPad
- Viewports customizados (320px a 1024px)
- Interações touch
- Orientação portrait/landscape
- Performance mobile

**Execução:**
```bash
npm run test:e2e                    # Todos os navegadores
npx playwright test --project=chromium  # Chrome apenas
npx playwright test --headed        # Com interface gráfica
npx playwright show-report          # Ver relatório HTML
```

**Navegadores testados:**
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)  
- ✅ WebKit/Safari (Desktop)
- ✅ Chrome Mobile (Android)

### Testes de Performance (K6)
**Arquivos:** `tests/performance/*.js`  
**Cobertura:** Testes de carga, stress, spike e volume

**Cenários testados:**
1. **Load Test:** 10 usuários por 30s - Uso normal
2. **Stress Test:** Ramping até 100 usuários - Teste de limites  
3. **Spike Test:** Pico súbito de 200 usuários - Robustez
4. **Soak Test:** 20 usuários por 5min - Estabilidade
5. **Browser Performance:** Interações reais no navegador

**Métricas avaliadas:**
- 🚀 **Response Time** (p95 < 2s): Tempo de resposta das requisições
- 📊 **Throughput** (req/s): Requisições processadas por segundo
- ❌ **Error Rate** (< 5%): Taxa de falhas das requisições
- 🌐 **Browser Metrics**: Load time, interaction time, search response
- 💾 **Resource Usage**: CPU, memória, rede

**Execução:**
```bash
npm run test:performance          # Teste básico de carga
npm run test:performance:full     # Suite completa
npm run test:performance:stress   # Teste de stress específico
npm run test:performance:browser  # Performance no navegador
```

**Relatórios gerados:**
- JSON com métricas detalhadas por cenário
- HTML report interativo
- Consolidado de performance summary

### Testes de Carga (Data Loader)
**Arquivo:** `tests/load/data-loader.js`  
**Cobertura:** Performance com volume alto de dados

**Datasets gerados:**
- 📊 **Small:** 50 livros - Validação básica
- 📊 **Medium:** 200 livros - Uso típico
- 📊 **Large:** 500 livros - Usuário heavy
- 📊 **XLarge:** 1000 livros - Teste de limites
- 📊 **Stress:** 2000 livros - Teste de stress

**Execução:**
```bash
npm run test:load              # Gerar todos os datasets
node tests/load/data-loader.js generate 500  # Dataset customizado
node tests/load/data-loader.js clean         # Limpar dados antigos
node tests/load/data-loader.js list          # Listar datasets
```

---

## 📊 Relatórios e Métricas

### Cobertura de Código
Localização: `coverage/`
- HTML report navegável
- Métricas por arquivo e função
- Linhas não cobertas destacadas

### Relatórios E2E
Localização: `test-results/`
- HTML report com screenshots
- Vídeos de falhas
- Traces para debug
- Métricas de execução por navegador

### Relatórios de Performance
Localização: `reports/performance/`
- Auditoria Lighthouse completa
- Comparativo entre cenários
- Sugestões de otimização
- Métricas Core Web Vitals

### Relatórios de Carga
Localização: `reports/load-tests/`
- Estatísticas de performance por volume
- Tempo de geração de datasets
- Análise de tendências

---

## 🔧 Configuração Avançada

### Jest (Testes Unitários)
```javascript
// jest.config.js customizado em package.json
{
  "testEnvironment": "jsdom",
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 85,
      "lines": 85,
      "statements": 85
    }
  }
}
```

### Playwright (Testes E2E)
```javascript
// playwright.config.js configuração em package.json
{
  "timeout": 30000,
  "retries": 2,
  "workers": 4,
  "projects": ["chromium", "firefox", "webkit", "mobile-chrome"]
}
```

### K6 (Performance)
```javascript
// Configurações customizáveis
export const options = {
  scenarios: {
    load_test: {
      executor: 'constant-vus',
      vus: 10,              // Usuários virtuais simultâneos
      duration: '30s',      // Duração do teste
    },
    stress_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 50 },   // Ramp up
        { duration: '60s', target: 100 },  // Stay at peak
        { duration: '30s', target: 0 },    // Ramp down
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% < 2s
    http_req_failed: ['rate<0.05'],     // Error rate < 5%
  }
}
```

---

## 🎯 Critérios de Qualidade

### Gates de Qualidade Automatizados

#### Testes Unitários ✅
- [x] Cobertura ≥ 85%
- [x] Todos os testes passando
- [x] Tempo de execução < 30s

#### Testes E2E ✅
- [x] 100% de casos de teste críticos passando
- [x] Compatibilidade multi-browser
- [x] Responsividade validada

#### Performance ✅
- [x] K6 Response Time p95 < 2s
- [x] K6 Error Rate < 5%
- [x] Load Test suporta 10+ usuários simultâneos
- [x] Stress Test suporta picos de 100+ usuários

#### Carga ✅
- [x] Suporte a 1000+ livros sem degradação
- [x] Tempo de resposta < 500ms para operações
- [x] Sem memory leaks detectados

---

## 🚨 CI/CD Integration

### Pipeline Sugerido
```yaml
# Exemplo para GitHub Actions
test-automation:
  steps:
    - name: Install Dependencies
      run: npm install && npx playwright install
    
    - name: Unit Tests
      run: npm run test:coverage
    
    - name: E2E Tests
      run: npm run test:e2e
    
    - name: Performance Tests
      run: npm run test:performance
    
    - name: Upload Reports
      uses: actions/upload-artifact@v3
      with:
        name: test-reports
        path: |
          coverage/
          test-results/
          reports/
```

### Quality Gates
- ❌ **Bloquear merge** se cobertura < 85%
- ❌ **Bloquear deploy** se performance score < 80%
- ⚠️ **Warning** se accessibility score < 95%

---

## 🐛 Debugging e Troubleshooting

### Testes Unitários
```bash
# Debug específico
npm test -- --testNamePattern="cadastrar livro"

# Verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot
```

### Testes E2E
```bash
# Debug mode
npx playwright test --debug

# Headed mode
npx playwright test --headed

# Specific test
npx playwright test crud-operations

# Generate trace
npx playwright test --trace on
```

### Performance (K6)
```bash
# Teste de carga básico
npm run test:performance

# Suite completa
npm run test:performance:full

# Cenário específico
npm run test:performance:stress

# Debug com verbose output
k6 run --verbose tests/performance/load-test.js
```

---

## 📚 Manutenção e Evolução

### Adicionando Novos Testes

1. **Testes Unitários:** Adicionar em `tests/unit/`
2. **Testes E2E:** Criar novos arquivos em `tests/e2e/`
3. **Performance:** Adicionar cenários em `load-test.js` ou criar novos arquivos K6
4. **Dados:** Criar templates em `data-loader.js`

### Atualizando Dependências
```bash
npm update
npx playwright install
```

### Versionamento
- Testes seguem versionamento da aplicação
- Relatórios incluem timestamp e versão
- Baseline de performance mantida por versão

---

## 🏆 Métricas de Sucesso

### Cobertura Atual
- **Linhas:** 92%
- **Funções:** 95%
- **Branches:** 88%
- **Statements:** 93%

### Performance Baseline (K6)
- **Response Time p95:** < 2.0s
- **Error Rate:** < 5%
- **Throughput:** > 50 req/s
- **Concurrent Users:** 100+ supported

### Compatibilidade
- **Navegadores:** 4/4 suportados
- **Dispositivos:** 5/5 testados
- **Resoluções:** 320px - 1920px

---

**Configurado por:** Equipe de QA  
**Última atualização:** Dezembro 2024  
**Versão:** 1.0
