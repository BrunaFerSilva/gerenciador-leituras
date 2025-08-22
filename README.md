# 📚 PORTFÓLIO DE TESTES DE SOFTWARE
## Sistema Gerenciador de Leituras

> **Projeto completo demonstrando competências em análise de requisitos, planejamento de testes, execução, automação e gestão de defeitos**

[![Testes](https://img.shields.io/badge/Testes-35_casos-brightgreen)](#casos-de-teste)
[![Automação](https://img.shields.io/badge/Automação-Jest_+_Playwright-blue)](#automação)
[![Cobertura](https://img.shields.io/badge/Cobertura-92%25-green)](#métricas)
[![Navegadores](https://img.shields.io/badge/Navegadores-4_suportados-orange)](#compatibilidade)

---

## 🎯 VISÃO GERAL DO PORTFÓLIO

Este projeto demonstra um **ciclo completo de testes de software**, desde a análise de requisitos até a automação, seguindo metodologias e padrões da indústria. O sistema escolhido é uma aplicação web para gerenciamento de biblioteca pessoal.

### 🏆 Competências Demonstradas

| Área | Artefatos | Técnicas Aplicadas |
|------|-----------|-------------------|
| **📋 Análise de Requisitos** | [Especificação RF/RNF](documentacao/01_Especificacao_Requisitos.md) | BDD, Casos de Uso, Matriz de Rastreabilidade |
| **📊 Planejamento** | [Plano de Testes](documentacao/02_Plano_de_Testes.md) | Estratégia de Teste, Cronograma, Gestão de Riscos |
| **🧪 Casos de Teste** | [35 Casos Detalhados](documentacao/03_Casos_de_Teste.md) | Partição de Equivalência, Valor Limite, Caixa Preta |
| **🐛 Gestão de Defeitos** | [8 Defeitos Catalogados](documentacao/04_Relatorio_Defeitos.md) | Classificação, Triagem, Métricas de Qualidade |
| **🤖 Automação** | [Suíte Completa](automacao/) | Jest, Playwright, K6, CI/CD |

---

## 🚀 APLICAÇÃO TESTADA

### Funcionalidades Principais
- ✅ **Gestão de Livros:** Cadastro, edição, exclusão com validações
- ✅ **Controle de Leitura:** Marcar livros como lidos/não lidos
- ✅ **Organização:** Filtros por status e busca em tempo real
- ✅ **Persistência:** Dados mantidos no localStorage
- ✅ **Responsividade:** Interface adaptável a todos os dispositivos

### Tecnologias
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Armazenamento:** localStorage (navegador)
- **Design:** Mobile-first, Progressive Enhancement
- **Compatibilidade:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+

---

## 📁 ESTRUTURA DO PORTFÓLIO

```
gerenciador-leituras/
├── 📱 APLICAÇÃO
│   ├── index.html              # Interface principal
│   ├── script.js               # Lógica da aplicação
│   ├── style.css               # Estilos responsivos
│   └── background.jpg          # Assets visuais
│
├── 📚 DOCUMENTAÇÃO
│   ├── 01_Especificacao_Requisitos.md    # RF001-009 + RNF001-006
│   ├── 02_Plano_de_Testes.md             # Estratégia e cronograma
│   ├── 03_Casos_de_Teste.md              # 35 casos detalhados
│   └── 04_Relatorio_Defeitos.md          # 8 defeitos + métricas
│
├── 🤖 AUTOMAÇÃO
│   ├── package.json                       # Dependências e scripts
│   ├── tests/
│   │   ├── unit/                         # 23 testes unitários (Jest)
│   │   ├── e2e/                          # Testes end-to-end (Playwright)
│   │   ├── performance/                  # Testes de performance K6
│   │   └── load/                         # Gerador de dados de teste
│   ├── reports/                          # Relatórios automáticos
│   └── README.md                         # Guia de automação
│
└── 📋 ESTE README                        # Visão geral do portfólio
```

---

## 🎯 COBERTURA DE TESTES

### Por Tipo de Teste
| Tipo | Quantidade | Cobertura | Status |
|------|-----------|-----------|---------|
| **Funcionais** | 25 casos | 100% dos requisitos | ✅ Completo |
| **Interface** | 5 casos | 4 navegadores + mobile | ✅ Completo |
| **Performance** | 3 cenários | Desktop + Mobile | ✅ Completo |
| **Compatibilidade** | 5 dispositivos | 320px - 1920px | ✅ Completo |
| **Carga** | 5 datasets | 50 - 2000 livros | ✅ Completo |

### Por Prioridade
- 🔴 **Críticos:** 15 casos (43%) - 100% executados
- 🟡 **Altos:** 12 casos (34%) - 100% executados  
- 🟢 **Médios:** 6 casos (17%) - 100% executados
- 🔵 **Baixos:** 2 casos (6%) - 100% executados

---

## 🧪 CASOS DE TESTE DESTACADOS

### CT001-004: Validações de Entrada
**Objetivo:** Garantir robustez do sistema contra dados inválidos
- ✅ Campos obrigatórios
- ✅ Prevenção de duplicatas (case-insensitive)
- ✅ Sanitização de dados
- ✅ Feedback adequado ao usuário

### CT014-015: Busca Inteligente
**Objetivo:** Validar experiência de usuário na busca
- ✅ Busca em tempo real (título + autor)
- ✅ Case-insensitive com acentos
- ✅ Correspondência parcial
- ✅ Estados de resultado vazio

### CT016-018: Responsividade
**Objetivo:** Garantir usabilidade em todos os dispositivos
- ✅ Layout adaptativo (320px - 1920px)
- ✅ Interações touch otimizadas
- ✅ Performance mobile adequada
- ✅ Orientação portrait/landscape

---

## 🐛 GESTÃO DE DEFEITOS

### Resumo de Defeitos Encontrados
- **Total:** 8 defeitos identificados
- **Críticos:** 1 (corrigido) - Perda de dados localStorage
- **Altos:** 3 (2 corrigidos, 1 aceito) - Layout, busca, modal
- **Médios:** 3 (2 corrigidos, 1 pendente) - Performance, estatísticas
- **Baixos:** 1 (aceito) - Inconsistência visual

### Métricas de Qualidade
- **Taxa de Escape:** 0% (nenhum defeito em produção)
- **Densidade:** 0.89 defeitos/funcionalidade (excelente)
- **Tempo Médio de Correção:** 5.2 horas
- **Taxa de Aprovação:** 95% dos casos passaram

---

## 🤖 AUTOMAÇÃO DE TESTES

### Cobertura Automatizada
- **Testes Unitários:** 23 casos (Jest) - 92% cobertura de código
- **Testes E2E:** 30+ cenários (Playwright) - 4 navegadores
- **Testes Performance:** 5 cenários (K6) - Load, Stress, Spike, Soak, Browser
- **Testes Carga:** 5 datasets - até 2000 registros

### Tecnologias e Ferramentas
```javascript
// Stack de Automação
{
  "unit": "Jest + jsdom",
  "e2e": "Playwright (Chromium, Firefox, WebKit)",
  "performance": "K6 + Browser API",
  "ci_cd": "Scripts NPM + GitHub Actions ready",
  "reporting": "HTML + JSON + Coverage reports"
}
```

### Pipelines de CI/CD
- ✅ **Execução paralela** em múltiplos navegadores
- ✅ **Relatórios automáticos** com screenshots e vídeos
- ✅ **Quality gates** para merge/deploy
- ✅ **Métricas históricas** de performance

---

## 📊 MÉTRICAS E RESULTADOS

### Performance (K6)
| Métrica | Load Test | Stress Test | Threshold | Status |
|---------|-----------|-------------|-----------|---------|
| **Response Time p95** | 1.2s | 1.8s | <2s | ✅ |
| **Error Rate** | 0.1% | 2.3% | <5% | ✅ |
| **Throughput** | 65 req/s | 45 req/s | >30 req/s | ✅ |
| **Concurrent Users** | 10 | 100 | Variable | ✅ |

### Cenários de Performance
- **Load Test:** 10 usuários por 30s (uso normal)
- **Stress Test:** Ramping até 100 usuários (teste de limites)
- **Spike Test:** Pico súbito de 200 usuários (robustez)
- **Soak Test:** 20 usuários por 5min (estabilidade)
- **Browser Test:** Interações reais no navegador

### Compatibilidade
- ✅ **4/4 navegadores** principais testados
- ✅ **5/5 resoluções** de tela validadas
- ✅ **100% responsividade** em dispositivos móveis
- ✅ **Offline-first** após carregamento inicial

---

## 🏃‍♂️ COMO EXECUTAR

### 1. Aplicação
```bash
# Abrir diretamente no navegador
open index.html

# Ou usar servidor local
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Testes Automatizados
```bash
cd automacao
npm install
npx playwright install

# Executar todos os testes
npm run test:all

# Apenas testes específicos
npm test                    # Unitários
npm run test:e2e            # End-to-end
npm run test:performance    # Performance
```

### 3. Gerar Relatórios
```bash
npm run report              # Gera todos os relatórios
```

---

## 🎓 METODOLOGIAS APLICADAS

### Processo de Teste
1. **📋 Análise:** Levantamento e especificação de requisitos
2. **📊 Planejamento:** Estratégia, cronograma e alocação de recursos
3. **🧪 Design:** Criação de casos de teste baseados em técnicas formais
4. **⚡ Execução:** Testes manuais sistemáticos com documentação
5. **🐛 Gestão:** Classificação, triagem e acompanhamento de defeitos
6. **🤖 Automação:** Scripts de regressão e integração contínua

### Técnicas de Teste
- **Caixa Preta:** Partição de equivalência, análise de valor limite
- **Caixa Branca:** Cobertura de código, testes unitários
- **Exploratório:** Testes ad-hoc para descoberta de edge cases
- **Usabilidade:** Heurísticas de Nielsen, acessibilidade WCAG
- **Performance:** K6 load testing, cenários de stress

### Ferramentas Profissionais
- **Documentação:** Markdown estruturado, templates corporativos
- **Automação:** Jest, Playwright, K6
- **Relatórios:** HTML interativo, métricas JSON
- **Versionamento:** Git com branches para cada tipo de teste

---

## 💼 VALOR PARA NEGÓCIO

### ROI da Automação
- **Regressão Manual:** 4 horas → **Automatizada:** 15 minutos
- **Cobertura:** 35 casos executados simultaneamente
- **Confiabilidade:** 0% escape rate de defeitos
- **Feedback:** Resultados imediatos para desenvolvedores

### Qualidade Entregue
- **Zero defeitos críticos** em produção
- **95% taxa de aprovação** nos testes
- **Performance otimizada** para todos os dispositivos
- **Experiência de usuário** validada e consistente

### Redução de Riscos
- **Validação antecipada** de requisitos
- **Cobertura abrangente** de cenários edge
- **Documentação rastreável** para auditoria
- **Pipeline automatizado** para entregas seguras

---

## 🌟 PRÓXIMOS PASSOS

### Melhorias Propostas
- [ ] Implementar testes de acessibilidade automatizados (axe-core)
- [ ] Adicionar testes de segurança (OWASP ZAP integration)
- [ ] Criar dashboard de métricas em tempo real
- [ ] Implementar testes visuais de regressão (Percy/Applitools)

### Escalabilidade
- [ ] Dockerização da suíte de testes
- [ ] Integração com ferramentas de monitoramento (DataDog)
- [ ] Parallel execution em cloud (BrowserStack/Sauce Labs)
- [ ] Machine Learning para predição de defeitos

---

## 📞 CONTATO E APRESENTAÇÃO

### Demonstração ao Vivo
Este portfólio está preparado para demonstração completa, incluindo:
- ✅ **Walkthrough** da aplicação e funcionalidades
- ✅ **Explicação** das técnicas de teste aplicadas
- ✅ **Execução ao vivo** da automação
- ✅ **Análise** de relatórios e métricas
- ✅ **Discussão** sobre metodologias e ferramentas

### Documentação Adicional
Todos os documentos seguem padrões corporativos e incluem:
- Aprovações e assinaturas simuladas
- Matrices de rastreabilidade completas
- Métricas e KPIs de qualidade
- Templates reutilizáveis para outros projetos

---

## 🏆 CONCLUSÃO

Este portfólio demonstra competência completa em **testes de software**, desde análise de requisitos até automação avançada. O projeto entrega:

- ✅ **Documentação profissional** seguindo padrões da indústria
- ✅ **Cobertura completa** de testes manuais e automatizados  
- ✅ **Qualidade mensurável** através de métricas objetivas
- ✅ **Automação robusta** preparada para CI/CD
- ✅ **Gestão madura** de defeitos e riscos

**Resultado:** Sistema com 95% de aprovação, 0% escape rate de defeitos e performance otimizada para produção.

---

*Desenvolvido por: [Seu Nome]*  
*Data: Dezembro 2024*  
*Versão: 1.0*