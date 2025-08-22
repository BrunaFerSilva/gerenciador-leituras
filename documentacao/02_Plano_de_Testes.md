# PLANO DE TESTES
## Sistema Gerenciador de Leituras (SGL)

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Responsável pelos Testes:** Analista de QA  
**Aprovado por:** Gerente de Projeto  

---

## 1. INTRODUÇÃO

### 1.1 Objetivo
Este documento define a estratégia, escopo e atividades de teste para o Sistema Gerenciador de Leituras, garantindo que todos os requisitos funcionais e não-funcionais sejam validados antes da entrega.

### 1.2 Escopo do Teste
**Incluído no Escopo:**
- Testes funcionais de todas as funcionalidades especificadas
- Testes de interface de usuário
- Testes de usabilidade
- Testes de compatibilidade de navegadores
- Testes de performance básicos
- Testes de responsividade

**Excluído do Escopo:**
- Testes de segurança avançados (não aplicável para aplicação local)
- Testes de carga distribuída
- Testes de integração com sistemas externos

### 1.3 Documentos de Referência
- Especificação de Requisitos de Software v1.0
- Protótipos de Interface
- Padrões de Codificação da Organização

---

## 2. ESTRATÉGIA DE TESTE

### 2.1 Tipos de Teste

#### 2.1.1 Testes Funcionais
**Objetivo:** Verificar se o sistema atende aos requisitos funcionais especificados

**Técnicas:**
- Particionamento de Equivalência
- Análise de Valor Limite
- Teste de Caixa Preta
- Teste de Fluxo de Trabalho

#### 2.1.2 Testes de Interface
**Objetivo:** Validar a usabilidade e consistência da interface

**Técnicas:**
- Inspeção de UI/UX
- Teste de Navegação
- Validação de Layout Responsivo

#### 2.1.3 Testes de Compatibilidade
**Objetivo:** Garantir funcionamento em diferentes navegadores e dispositivos

**Técnicas:**
- Teste Cross-browser
- Teste de Responsividade
- Teste de Performance em diferentes dispositivos

#### 2.1.4 Testes de Performance
**Objetivo:** Verificar tempos de resposta e comportamento sob carga

**Técnicas:**
- Teste de Tempo de Resposta
- Teste de Carregamento
- Teste de Stress (volume de dados)

### 2.2 Níveis de Teste

#### 2.2.1 Teste de Unidade
- **Responsável:** Desenvolvedor
- **Escopo:** Funções individuais JavaScript
- **Ferramenta:** Jest (planejado para automação)

#### 2.2.2 Teste de Integração
- **Responsável:** QA
- **Escopo:** Interação entre componentes
- **Ferramenta:** Teste manual e automação

#### 2.2.3 Teste de Sistema
- **Responsável:** QA
- **Escopo:** Sistema completo
- **Ferramenta:** Teste manual e automação

#### 2.2.4 Teste de Aceitação
- **Responsável:** Product Owner / Usuário Final
- **Escopo:** Validação final dos requisitos
- **Ferramenta:** Teste manual guiado

---

## 3. CRITÉRIOS DE ENTRADA E SAÍDA

### 3.1 Critérios de Entrada
- [ ] Código fonte completo e versionado
- [ ] Especificação de Requisitos aprovada
- [ ] Ambiente de teste configurado
- [ ] Dados de teste preparados
- [ ] Ferramentas de teste instaladas

### 3.2 Critérios de Saída
- [ ] 100% dos casos de teste executados
- [ ] Taxa de aprovação ≥ 95%
- [ ] Todos os defeitos críticos corrigidos
- [ ] Todos os defeitos altos corrigidos ou aceitos
- [ ] Documentação de teste atualizada
- [ ] Relatório final de teste aprovado

---

## 4. RECURSOS E RESPONSABILIDADES

### 4.1 Equipe de Teste

| Papel | Responsável | Responsabilidades |
|-------|-------------|-------------------|
| **Gerente de Teste** | [Nome] | Planejamento, coordenação, relatórios |
| **Analista de Teste** | [Nome] | Criação de casos de teste, execução |
| **Testador** | [Nome] | Execução de testes, registro de defeitos |
| **Testador de Automação** | [Nome] | Desenvolvimento de testes automatizados |

### 4.2 Ambiente de Teste

**Hardware:**
- Desktop Windows 10/11 (Chrome, Edge, Firefox)
- Desktop macOS (Safari, Chrome)
- Smartphone Android (Chrome)
- Smartphone iOS (Safari)
- Tablet Android/iOS

**Software:**
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Ferramentas: DevTools, Lighthouse, Jest
- Resolução de tela: 1920x1080, 1366x768, 375x667 (mobile)

---

## 5. CRONOGRAMA DE TESTES

### 5.1 Fases de Teste

| Fase | Duração | Responsável | Deliverable |
|------|---------|-------------|-------------|
| **Planejamento** | 2 dias | Analista QA | Plano de Testes |
| **Preparação** | 3 dias | Analista QA | Casos de Teste |
| **Execução Manual** | 5 dias | Testador | Relatórios de Execução |
| **Automação** | 7 dias | Testador Automação | Scripts Automatizados |
| **Testes de Regressão** | 2 dias | Equipe QA | Relatório de Regressão |
| **Relatório Final** | 1 dia | Gerente Teste | Relatório Consolidado |

### 5.2 Marcos Importantes

- **Início dos Testes:** [Data]
- **Conclusão Teste Manual:** [Data + 10 dias]
- **Conclusão Automação:** [Data + 17 dias]
- **Entrega Final:** [Data + 20 dias]

---

## 6. CASOS DE TESTE - RESUMO EXECUTIVO

### 6.1 Módulos de Teste

#### CT001-CT010: Gestão de Livros
- Cadastro, edição, exclusão de livros
- Validações de entrada
- Tratamento de duplicatas

#### CT011-CT015: Controle de Status
- Marcar/desmarcar como lido
- Alternância de status
- Atualização de interface

#### CT016-CT020: Navegação e Filtros
- Filtros por categoria
- Busca por título/autor
- Ordenação de resultados

#### CT021-CT025: Interface e Usabilidade
- Responsividade
- Feedback visual
- Acessibilidade básica

#### CT026-CT030: Performance e Compatibilidade
- Tempo de carregamento
- Compatibilidade cross-browser
- Comportamento com muitos dados

#### CT031-CT035: Persistência de Dados
- Salvamento automático
- Recuperação após reload
- Integridade dos dados

### 6.2 Distribuição de Prioridades

| Prioridade | Quantidade | Percentual |
|------------|-----------|-----------|
| **Crítica** | 15 casos | 43% |
| **Alta** | 12 casos | 34% |
| **Média** | 6 casos | 17% |
| **Baixa** | 2 casos | 6% |
| **Total** | 35 casos | 100% |

---

## 7. ESTRATÉGIA DE AUTOMAÇÃO

### 7.1 Candidatos para Automação

**Testes Prioritários para Automação:**
- Fluxos principais de cadastro/edição/exclusão
- Validações de entrada de dados
- Testes de regressão
- Testes de performance básicos

**Ferramentas de Automação:**
- **Playwright/Cypress:** Testes E2E
- **Jest:** Testes unitários JavaScript
- **Lighthouse:** Auditoria de performance

### 7.2 Estrutura de Automação

```
tests/
├── unit/                 # Testes unitários
│   ├── bookManager.test.js
│   └── validation.test.js
├── e2e/                  # Testes end-to-end
│   ├── crud-operations.test.js
│   ├── search-filter.test.js
│   └── ui-interactions.test.js
├── performance/          # Testes de performance
│   └── lighthouse.test.js
└── utils/               # Utilitários de teste
    ├── helpers.js
    └── test-data.js
```

---

## 8. GESTÃO DE DEFEITOS

### 8.1 Classificação de Severidade

| Severidade | Descrição | Exemplo |
|------------|-----------|---------|
| **Crítica** | Sistema não funciona / perda de dados | Crash ao salvar dados |
| **Alta** | Funcionalidade principal não funciona | Cadastro não salva livro |
| **Média** | Funcionalidade secundária com problema | Busca não encontra resultado |
| **Baixa** | Problema cosmético | Alinhamento de texto |

### 8.2 Fluxo de Defeitos

1. **Detecção:** Testador identifica defeito
2. **Registro:** Criação de relatório detalhado
3. **Triagem:** Classificação por severidade/prioridade
4. **Atribuição:** Designação para desenvolvedor
5. **Correção:** Implementação da solução
6. **Reteste:** Verificação da correção
7. **Fechamento:** Confirmação da resolução

### 8.3 Métricas de Defeitos

**Métricas a serem coletadas:**
- Número total de defeitos por severidade
- Taxa de detecção de defeitos por fase
- Tempo médio de correção por severidade
- Taxa de reabertura de defeitos
- Densidade de defeitos por módulo

---

## 9. RISCOS E MITIGAÇÕES

### 9.1 Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Atraso na entrega do código** | Média | Alto | Buffer no cronograma, comunicação frequente |
| **Mudanças de requisitos** | Baixa | Médio | Versionamento de documentos, approval board |
| **Problemas de compatibilidade** | Média | Médio | Testes antecipados em múltiplos browsers |
| **Defeitos críticos tardios** | Baixa | Alto | Testes de smoke antecipados |

### 9.2 Contingências

- **Plano B:** Se automação atrasar, focar em testes manuais críticos
- **Recursos Extra:** Possibilidade de testadores adicionais
- **Priorização:** Lista de funcionalidades por criticidade

---

## 10. COMUNICAÇÃO E RELATÓRIOS

### 10.1 Relatórios Regulares

**Daily Status Report:**
- Progresso diário de execução
- Novos defeitos encontrados
- Bloqueadores identificados

**Weekly Summary Report:**
- Estatísticas de progresso
- Análise de tendências
- Previsão de conclusão

**Final Test Report:**
- Resumo executivo completo
- Métricas finais
- Recomendações

### 10.2 Reuniões

- **Daily Standup:** Progresso e bloqueadores
- **Bug Triage:** Classificação de defeitos (2x/semana)
- **Test Review:** Revisão semanal com stakeholders

---

## 11. APROVAÇÃO

### 11.1 Critérios de Aprovação Final

- [ ] Todos os casos de teste críticos e altos PASSARAM
- [ ] Nenhum defeito crítico em aberto
- [ ] Máximo 2 defeitos altos em aberto (com aceite)
- [ ] Performance atende aos critérios especificados
- [ ] Compatibilidade validada nos browsers principais
- [ ] Documentação completa e atualizada

### 11.2 Assinaturas de Aprovação

| Papel | Nome | Data | Assinatura |
|-------|------|------|-----------|
| **Analista de QA** | [Nome] | [Data] | [Assinatura] |
| **Gerente de Projeto** | [Nome] | [Data] | [Assinatura] |
| **Product Owner** | [Nome] | [Data] | [Assinatura] |

---

## 12. ANEXOS

### Anexo A: Template de Caso de Teste
### Anexo B: Template de Relatório de Defeito  
### Anexo C: Checklist de Compatibilidade
### Anexo D: Scripts de Dados de Teste

---

*Documento controlado - Versão 1.0*  
*Próxima revisão: [Data + 30 dias]*
