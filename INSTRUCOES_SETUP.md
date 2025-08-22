# ⚙️ INSTRUÇÕES DE SETUP E EXECUÇÃO
## Portfólio de Testes - Sistema Gerenciador de Leituras

> **Guia completo para configuração e execução de todos os componentes do portfólio**

---

## 🚀 EXECUÇÃO RÁPIDA (5 minutos)

### 1. Aplicação Principal
```bash
# Opção 1: Abrir diretamente no navegador
open index.html

# Opção 2: Servidor local (recomendado)
cd gerenciador-leituras
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Documentação
```bash
# Todos os documentos estão em formato Markdown
# Podem ser lidos diretamente no GitHub/editor ou convertidos para PDF

# Documentos principais:
documentacao/01_Especificacao_Requisitos.md
documentacao/02_Plano_de_Testes.md  
documentacao/03_Casos_de_Teste.md
documentacao/04_Relatorio_Defeitos.md
```

### 3. Automação (Opcional)
```bash
cd automacao
npm install          # Instalar dependências
npx playwright install  # Instalar navegadores
npm run test:all     # Executar todos os testes
```

---

## 🔧 CONFIGURAÇÃO COMPLETA

### Pré-requisitos
- **Navegador moderno:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Node.js:** v16+ (para automação Jest e Playwright)
- **K6:** Ferramenta de performance testing
- **Python:** v3.6+ (opcional, para servidor local)

### Verificação do Ambiente
```bash
# Verificar versões
node --version        # v16.0.0 ou superior
npm --version         # v8.0.0 ou superior
k6 version           # Qualquer versão recente
python --version      # v3.6.0 ou superior

# Verificar navegadores disponíveis
npx playwright install-deps
```

### Instalação do K6
```bash
# Windows (via winget)
winget install k6

# macOS (via Homebrew)
brew install k6

# Linux (via Snap)
sudo snap install k6

# Ou download direto de: https://k6.io/docs/getting-started/installation/
```

---

## 📱 TESTANDO A APLICAÇÃO

### Funcionalidades Principais para Demonstrar

#### 1. Cadastro de Livros
```
✅ Preencher título e autor → "Clean Code" / "Robert Martin"
✅ Clicar "Adicionar Livro" → Verificar se aparece na lista
✅ Tentar duplicata → Verificar mensagem de erro
✅ Campos vazios → Verificar validação
```

#### 2. Gestão de Status
```
✅ Marcar livro como "Lido" → Verificar mudança visual (verde)
✅ Desmarcar como lido → Verificar volta ao normal
✅ Observar estatísticas → Números devem atualizar
```

#### 3. Filtros e Busca
```
✅ Clicar "Para Ler" → Mostrar apenas não lidos
✅ Clicar "Lidos" → Mostrar apenas lidos  
✅ Clicar "Todos" → Mostrar todos os livros
✅ Buscar "software" → Filtrar em tempo real
```

#### 4. Responsividade
```
✅ Redimensionar janela → Layout adapta
✅ Testar em mobile → Elementos organizados verticalmente
✅ Testar interações touch → Botões adequados
```

#### 5. Persistência
```
✅ Adicionar livro → Recarregar página (F5)
✅ Verificar que livro permanece → localStorage funcionando
```

---

## 🤖 EXECUTANDO AUTOMAÇÃO

### Testes Unitários (Jest)
```bash
cd automacao

# Execução básica
npm test

# Com cobertura detalhada
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# Verificar arquivos de cobertura
open coverage/lcov-report/index.html
```

**Resultado esperado:**
- ✅ 23 testes passando
- ✅ Cobertura > 85%
- ✅ Tempo de execução < 30s

### Testes End-to-End (Playwright)
```bash
# Todos os navegadores
npm run test:e2e

# Apenas Chrome (mais rápido)
npx playwright test --project=chromium

# Com interface gráfica (demonstração)
npx playwright test --headed

# Gerar relatório HTML
npx playwright show-report
```

**Resultado esperado:**
- ✅ 30+ cenários passando
- ✅ 4 navegadores testados
- ✅ Screenshots de falhas (se houver)
- ✅ Relatório HTML navegável

### Testes de Performance (K6)
```bash
# Executar teste básico de carga
npm run test:performance

# Executar suite completa de performance
npm run test:performance:full

# Executar teste de stress específico
npm run test:performance:stress

# Verificar relatórios gerados
ls reports/performance/

# Abrir relatório JSON
cat reports/performance/performance-summary.json
```

**Resultado esperado:**
- ✅ Response time p95 < 2000ms
- ✅ Error rate < 5%
- ✅ Load test suporta 10+ usuários simultâneos
- ✅ Stress test suporta picos de 100+ usuários

### Geração de Dados de Teste
```bash
# Gerar todos os datasets
npm run test:load

# Gerar dataset específico
node tests/load/data-loader.js generate 100

# Listar datasets disponíveis
node tests/load/data-loader.js list

# Limpar dados antigos
node tests/load/data-loader.js clean
```

---

## 🐛 TROUBLESHOOTING

### Problemas Comuns

#### Aplicação não carrega
```bash
# Verificar se arquivo existe
ls -la index.html

# Tentar servidor local
python -m http.server 8000
# ou
npx serve .
```

#### Automação falha na instalação
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Instalar navegadores manualmente
npx playwright install chromium firefox webkit
```

#### Testes E2E falham
```bash
# Verificar se aplicação está acessível
curl -I file://$(pwd)/index.html

# Debug de teste específico
npx playwright test --debug crud-operations

# Executar com trace
npx playwright test --trace on
```

#### Problemas com K6
```bash
# Verificar se K6 está instalado
k6 version

# Se não estiver instalado
# Windows: winget install k6
# macOS: brew install k6
# Linux: sudo snap install k6

# Testar K6 básico
k6 run --vus 1 --duration 10s https://httpbin.test.k6.io/
```

### Logs de Debug
```bash
# Jest verbose
npm test -- --verbose

# Playwright debug
DEBUG=pw:api npx playwright test

# K6 debug
k6 run --verbose tests/performance/load-test.js

# K6 com output detalhado
k6 run --out json=debug-results.json tests/performance/load-test.js
```

---

## 📊 INTERPRETANDO RESULTADOS

### Cobertura Jest
```bash
# Abrir relatório de cobertura
open coverage/lcov-report/index.html

# Interpretar métricas:
# - Lines: % de linhas executadas
# - Functions: % de funções chamadas  
# - Branches: % de condições testadas
# - Statements: % de statements executados
```

### Relatórios Playwright
```bash
# Abrir relatório E2E
npx playwright show-report

# Estrutura do relatório:
# - Resumo por navegador
# - Detalhes de cada teste
# - Screenshots de falhas
# - Traces para debug
```

### Métricas K6
```bash
# Interpretar métricas:
# http_req_duration: Tempo de resposta das requisições
# - p(50): Mediana (50% das requests)
# - p(95): 95º percentil (95% das requests)
# - avg: Tempo médio de resposta

# http_req_failed: Taxa de falhas
# - rate: Porcentagem de requests que falharam
# - < 5% é considerado bom

# Throughput: Requisições por segundo
# - iterations/s: Iterações completas por segundo
# - req/s: Requests HTTP por segundo

# Usuários virtuais:
# - vus: Número de usuários simultâneos
# - vus_max: Pico máximo de usuários
```

---

## 🎯 CHECKLIST DE DEMONSTRAÇÃO

### Antes da Apresentação
- [ ] ✅ Aplicação carrega corretamente
- [ ] ✅ Todos os documentos acessíveis
- [ ] ✅ Automação instalada e funcionando
- [ ] ✅ Relatórios pré-gerados
- [ ] ✅ Ambiente de apresentação testado

### Durante a Apresentação
- [ ] ✅ Demonstrar aplicação funcionando
- [ ] ✅ Mostrar documentação estruturada
- [ ] ✅ Executar automação ao vivo
- [ ] ✅ Apresentar métricas e resultados
- [ ] ✅ Responder perguntas técnicas

### Arquivos Essenciais para Demo
```
✅ index.html                    # Aplicação principal
✅ README.md                     # Visão geral do portfólio
✅ GUIA_APRESENTACAO.md          # Roteiro detalhado
✅ documentacao/                 # Todos os 4 documentos
✅ automacao/package.json        # Configuração de testes
✅ automacao/README.md           # Guia técnico de automação
```

---

## 📱 TESTANDO EM DIFERENTES DISPOSITIVOS

### Desktop
```bash
# Resoluções para testar:
# - 1920x1080 (Full HD)
# - 1366x768 (HD padrão)
# - 1280x720 (HD mínimo)
```

### Mobile (via DevTools)
```bash
# Dispositivos para simular:
# - iPhone SE (375x667)
# - iPhone 12 (390x844)
# - Samsung Galaxy S21 (360x800)
# - iPad (768x1024)
```

### Ferramentas de Teste
```bash
# Lighthouse mobile audit
npm run test:performance

# Playwright mobile tests
npx playwright test mobile-responsiveness

# Manual testing
# F12 → Toggle device toolbar → Selecionar dispositivo
```

---

## 💾 BACKUP E VERSIONAMENTO

### Estrutura Recomendada
```bash
# Git repository structure
.gitignore                  # Node modules, coverage, etc.
README.md                   # Este arquivo
documentacao/              # Versionado
automacao/                 # Versionado (exceto node_modules)
reports/                   # Gerado automaticamente
coverage/                  # Gerado automaticamente
```

### Comandos Git Úteis
```bash
# Inicializar repositório
git init
git add .
git commit -m "Portfolio completo de testes"

# Ignorar arquivos gerados
echo "node_modules/" >> .gitignore
echo "coverage/" >> .gitignore  
echo "test-results/" >> .gitignore
echo "reports/" >> .gitignore
```

---

## 🆘 SUPORTE E CONTATO

### Para Problemas Técnicos
1. **Verificar pré-requisitos** listados acima
2. **Consultar seção troubleshooting** 
3. **Verificar logs** com flags de debug
4. **Testar em ambiente limpo** (nova instalação)

### Para Dúvidas sobre Metodologia
1. **Consultar documentação** em `/documentacao/`
2. **Revisar GUIA_APRESENTACAO.md** para contexto
3. **Verificar RESUMO_EXECUTIVO.md** para visão geral

### Recursos Adicionais
- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **Playwright Documentation:** https://playwright.dev/docs/intro
- **Lighthouse Documentation:** https://developers.google.com/web/tools/lighthouse

---

**✅ PORTFÓLIO PRONTO PARA DEMONSTRAÇÃO PROFISSIONAL**

*Todas as instruções testadas e validadas para funcionamento em ambiente corporativo*
