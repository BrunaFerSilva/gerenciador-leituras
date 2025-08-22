# ESPECIFICAÇÃO DE CASOS DE TESTE
## Sistema Gerenciador de Leituras (SGL)

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Responsável:** Analista de Teste  
**Revisor:** Líder de QA  

---

## SUMÁRIO

1. [Informações Gerais](#1-informações-gerais)
2. [Casos de Teste - Gestão de Livros](#2-casos-de-teste---gestão-de-livros)
3. [Casos de Teste - Controle de Status](#3-casos-de-teste---controle-de-status)
4. [Casos de Teste - Navegação e Filtros](#4-casos-de-teste---navegação-e-filtros)
5. [Casos de Teste - Interface e Usabilidade](#5-casos-de-teste---interface-e-usabilidade)
6. [Casos de Teste - Performance](#6-casos-de-teste---performance)
7. [Casos de Teste - Persistência](#7-casos-de-teste---persistência)

---

## 1. INFORMAÇÕES GERAIS

### 1.1 Convenções
- **ID:** Identificador único do caso de teste
- **Prioridade:** Crítica | Alta | Média | Baixa
- **Tipo:** Funcional | Interface | Performance | Compatibilidade
- **Automação:** Sim | Não | Planejado

### 1.2 Dados de Teste Padrão
- **Livro Válido 1:** "Clean Code" - "Robert Martin"
- **Livro Válido 2:** "JavaScript: The Good Parts" - "Douglas Crockford"
- **Título Longo:** "Este é um título muito longo para testar os limites do sistema de cadastro de livros que pode causar problemas"
- **Caracteres Especiais:** "Título com @#$%&*()_+{}[]|\\:;\"'<>?,./"

---

## 2. CASOS DE TESTE - GESTÃO DE LIVROS

### CT001 - Cadastrar Livro com Dados Válidos

**Objetivo:** Verificar o cadastro de livro com informações válidas

| Campo | Valor |
|-------|-------|
| **ID:** | CT001 |
| **Prioridade:** | Crítica |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF001 |

**Pré-condições:**
- Sistema carregado e funcional
- Lista de livros pode estar vazia ou com outros livros

**Dados de Entrada:**
- Título: "Clean Code"
- Autor: "Robert Martin"

**Passos de Execução:**
1. Acessar a página principal do sistema
2. Localizar o formulário "Adicionar Novo Livro"
3. Preencher o campo "Título do Livro" com "Clean Code"
4. Preencher o campo "Autor(es)" com "Robert Martin"
5. Clicar no botão "Adicionar Livro"

**Resultado Esperado:**
- Livro é adicionado à lista com status "Para Ler"
- Mensagem de sucesso é exibida: "Livro adicionado com sucesso!"
- Campos do formulário são limpos automaticamente
- Estatísticas são atualizadas (Total +1, Para Ler +1)
- Livro aparece na lista "Todos os Livros"

**Critérios de Aceitação:**
- ✅ Livro é salvo no localStorage
- ✅ Interface é atualizada imediatamente
- ✅ Não há erros no console do navegador

---

### CT002 - Tentar Cadastrar Livro Duplicado

**Objetivo:** Verificar prevenção de cadastro de livros duplicados

| Campo | Valor |
|-------|-------|
| **ID:** | CT002 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF001 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" já cadastrado

**Dados de Entrada:**
- Título: "Clean Code"
- Autor: "Robert Martin"

**Passos de Execução:**
1. Acessar a página principal do sistema
2. Localizar o formulário "Adicionar Novo Livro"
3. Preencher o campo "Título" com "Clean Code"
4. Preencher o campo "Autor" com "Robert Martin"
5. Clicar no botão "Adicionar Livro"

**Resultado Esperado:**
- Livro NÃO é adicionado à lista
- Mensagem de aviso é exibida: "Este livro já está na sua lista!"
- Campos do formulário permanecem preenchidos
- Estatísticas permanecem inalteradas
- Lista não é modificada

**Critérios de Aceitação:**
- ✅ Verificação case-insensitive de duplicatas
- ✅ Comparação tanto de título quanto autor
- ✅ Mensagem apropriada exibida

---

### CT003 - Tentar Cadastrar com Título Vazio

**Objetivo:** Verificar validação de campo obrigatório título

| Campo | Valor |
|-------|-------|
| **ID:** | CT003 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF001 |

**Pré-condições:**
- Sistema carregado e funcional

**Dados de Entrada:**
- Título: "" (vazio)
- Autor: "Robert Martin"

**Passos de Execução:**
1. Acessar a página principal do sistema
2. Localizar o formulário "Adicionar Novo Livro"
3. Deixar o campo "Título" vazio
4. Preencher o campo "Autor" com "Robert Martin"
5. Clicar no botão "Adicionar Livro"

**Resultado Esperado:**
- Livro NÃO é adicionado à lista
- Mensagem de erro é exibida: "Por favor, preencha todos os campos."
- Formulário mantém os dados preenchidos (autor)
- Foco retorna para o campo título
- Estatísticas permanecem inalteradas

**Critérios de Aceitação:**
- ✅ Validação HTML5 ativa (required)
- ✅ Validação JavaScript funcional
- ✅ Feedback visual adequado

---

### CT004 - Tentar Cadastrar com Autor Vazio

**Objetivo:** Verificar validação de campo obrigatório autor

| Campo | Valor |
|-------|-------|
| **ID:** | CT004 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF001 |

**Pré-condições:**
- Sistema carregado e funcional

**Dados de Entrada:**
- Título: "Clean Code"
- Autor: "" (vazio)

**Passos de Execução:**
1. Acessar a página principal do sistema
2. Localizar o formulário "Adicionar Novo Livro"
3. Preencher o campo "Título" com "Clean Code"
4. Deixar o campo "Autor" vazio
5. Clicar no botão "Adicionar Livro"

**Resultado Esperado:**
- Livro NÃO é adicionado à lista
- Mensagem de erro é exibida: "Por favor, preencha todos os campos."
- Formulário mantém os dados preenchidos (título)
- Foco retorna para o campo autor
- Estatísticas permanecem inalteradas

**Critérios de Aceitação:**
- ✅ Validação HTML5 ativa (required)
- ✅ Validação JavaScript funcional
- ✅ Feedback visual adequado

---

### CT005 - Editar Livro Existente

**Objetivo:** Verificar funcionalidade de edição de livros

| Campo | Valor |
|-------|-------|
| **ID:** | CT005 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Planejado |
| **Requisito:** | RF002 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado

**Dados de Entrada:**
- Novo Título: "Clean Code: A Handbook"
- Novo Autor: "Robert C. Martin"

**Passos de Execução:**
1. Localizar o livro "Clean Code" na lista
2. Clicar no botão "Editar" do livro
3. Verificar que o formulário é preenchido automaticamente
4. Alterar título para "Clean Code: A Handbook"
5. Alterar autor para "Robert C. Martin"
6. Clicar em "Salvar Alterações"

**Resultado Esperado:**
- Formulário muda para modo "Editar Livro"
- Campos são preenchidos com dados atuais
- Botão muda para "Salvar Alterações"
- Botão "Cancelar" aparece
- Após salvar: livro é atualizado na lista
- Mensagem de sucesso: "Livro atualizado com sucesso!"
- Status de leitura é preservado

**Critérios de Aceitação:**
- ✅ ID do livro é preservado
- ✅ Status de leitura não é alterado
- ✅ Interface retorna ao modo normal após edição

---

### CT006 - Cancelar Edição de Livro

**Objetivo:** Verificar funcionalidade de cancelamento da edição

| Campo | Valor |
|-------|-------|
| **ID:** | CT006 |
| **Prioridade:** | Média |
| **Tipo:** | Funcional |
| **Automação:** | Não |
| **Requisito:** | RF002 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado
- Modo de edição ativado

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Iniciar edição de um livro (seguir CT005 até passo 3)
2. Fazer alterações nos campos título e autor
3. Clicar no botão "Cancelar"

**Resultado Esperado:**
- Alterações são descartadas
- Formulário volta ao modo "Adicionar Novo Livro"
- Campos são limpos
- Botão "Cancelar" desaparece
- Livro permanece inalterado na lista
- Nenhuma mensagem de confirmação é exibida

**Critérios de Aceitação:**
- ✅ Dados originais são preservados
- ✅ Interface volta ao estado original
- ✅ Nenhum efeito colateral

---

### CT007 - Excluir Livro com Confirmação

**Objetivo:** Verificar exclusão de livro com confirmação

| Campo | Valor |
|-------|-------|
| **ID:** | CT007 |
| **Prioridade:** | Crítica |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF003 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Localizar o livro "Clean Code" na lista
2. Clicar no botão "Remover" do livro
3. Verificar exibição do modal de confirmação
4. Ler a mensagem de confirmação
5. Clicar em "Confirmar"

**Resultado Esperado:**
- Modal de confirmação é exibido
- Mensagem específica: "Tem certeza que deseja remover "Clean Code" da sua lista?"
- Após confirmar: livro é removido da lista
- Mensagem de sucesso: "Livro removido com sucesso!"
- Estatísticas são atualizadas
- Modal desaparece automaticamente

**Critérios de Aceitação:**
- ✅ Confirmação obrigatória antes da exclusão
- ✅ Livro é removido permanentemente
- ✅ Interface é atualizada imediatamente

---

### CT008 - Cancelar Exclusão de Livro

**Objetivo:** Verificar cancelamento da exclusão de livro

| Campo | Valor |
|-------|-------|
| **ID:** | CT008 |
| **Prioridade:** | Média |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF003 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Localizar o livro "Clean Code" na lista
2. Clicar no botão "Remover" do livro
3. Verificar exibição do modal de confirmação
4. Clicar em "Cancelar"

**Resultado Esperado:**
- Modal de confirmação desaparece
- Livro permanece na lista inalterado
- Nenhuma mensagem é exibida
- Estatísticas permanecem inalteradas
- Interface volta ao estado normal

**Critérios de Aceitação:**
- ✅ Operação é cancelada completamente
- ✅ Nenhum efeito colateral
- ✅ Interface responsiva

---

## 3. CASOS DE TESTE - CONTROLE DE STATUS

### CT009 - Marcar Livro como Lido

**Objetivo:** Verificar marcação de livro como lido

| Campo | Valor |
|-------|-------|
| **ID:** | CT009 |
| **Prioridade:** | Crítica |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF004 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado com status "Para Ler"

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Localizar o livro "Clean Code" na lista
2. Verificar que o status atual é "Para Ler"
3. Clicar no botão "Marcar Lido"

**Resultado Esperado:**
- Status do livro muda para "Lido"
- Aparência visual do livro muda (background verde)
- Botão muda para "Não Lido"
- Ícone muda para "fa-undo"
- Estatísticas são atualizadas:
  - "Livros Lidos" +1
  - "Para Ler" -1
- Mensagem: "Livro marcado como lido!"

**Critérios de Aceitação:**
- ✅ Mudança visual imediata
- ✅ Estatísticas corretas
- ✅ Persistência do status

---

### CT010 - Desmarcar Livro como Lido

**Objetivo:** Verificar desmarcação de livro lido

| Campo | Valor |
|-------|-------|
| **ID:** | CT010 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF004 |

**Pré-condições:**
- Sistema carregado e funcional
- Livro "Clean Code" - "Robert Martin" cadastrado com status "Lido"

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Localizar o livro "Clean Code" na lista
2. Verificar que o status atual é "Lido" (background verde)
3. Clicar no botão "Não Lido"

**Resultado Esperado:**
- Status do livro muda para "Para Ler"
- Aparência visual volta ao normal (background branco)
- Botão muda para "Marcar Lido"
- Ícone muda para "fa-check"
- Estatísticas são atualizadas:
  - "Livros Lidos" -1
  - "Para Ler" +1
- Mensagem: "Livro marcado como não lido!"

**Critérios de Aceitação:**
- ✅ Mudança visual imediata
- ✅ Estatísticas corretas
- ✅ Persistência do status

---

## 4. CASOS DE TESTE - NAVEGAÇÃO E FILTROS

### CT011 - Filtrar "Todos os Livros"

**Objetivo:** Verificar filtro para exibir todos os livros

| Campo | Valor |
|-------|-------|
| **ID:** | CT011 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF005 |

**Pré-condições:**
- Sistema carregado e funcional
- 3 livros cadastrados: 2 "Para Ler" e 1 "Lido"

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Verificar estado atual da lista
2. Clicar no botão "Todos os Livros"

**Resultado Esperado:**
- Todos os 3 livros são exibidos na lista
- Botão "Todos os Livros" fica marcado como ativo
- Título da seção muda para "Todos os Livros"
- Livros são ordenados: não lidos primeiro, depois por data

**Critérios de Aceitação:**
- ✅ Exibe livros com qualquer status
- ✅ Ordenação correta
- ✅ Interface visual adequada

---

### CT012 - Filtrar "Para Ler"

**Objetivo:** Verificar filtro para livros não lidos

| Campo | Valor |
|-------|-------|
| **ID:** | CT012 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF005 |

**Pré-condições:**
- Sistema carregado e funcional
- 3 livros cadastrados: 2 "Para Ler" e 1 "Lido"

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Clicar no botão "Para Ler"

**Resultado Esperado:**
- Apenas os 2 livros "Para Ler" são exibidos
- Livro "Lido" fica oculto
- Botão "Para Ler" fica marcado como ativo
- Título da seção muda para "Livros Para Ler"
- Estatística "Para Ler" continua mostrando 2

**Critérios de Aceitação:**
- ✅ Filtragem precisa por status
- ✅ Livros lidos ocultos
- ✅ Interface consistente

---

### CT013 - Filtrar "Lidos"

**Objetivo:** Verificar filtro para livros lidos

| Campo | Valor |
|-------|-------|
| **ID:** | CT013 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF005 |

**Pré-condições:**
- Sistema carregado e funcional
- 3 livros cadastrados: 2 "Para Ler" e 1 "Lido"

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Clicar no botão "Lidos"

**Resultado Esperado:**
- Apenas o 1 livro "Lido" é exibido
- Livros "Para Ler" ficam ocultos
- Botão "Lidos" fica marcado como ativo
- Título da seção muda para "Livros Lidos"
- Livro é exibido com aparência de "lido" (verde)

**Critérios de Aceitação:**
- ✅ Filtragem precisa por status
- ✅ Livros não lidos ocultos
- ✅ Visual correto para livros lidos

---

### CT014 - Buscar por Título

**Objetivo:** Verificar busca por título de livro

| Campo | Valor |
|-------|-------|
| **ID:** | CT014 |
| **Prioridade:** | Média |
| **Tipo:** | Funcional |
| **Automação:** | Planejado |
| **Requisito:** | RF006 |

**Pré-condições:**
- Sistema carregado e funcional
- Livros cadastrados: "Clean Code", "JavaScript: The Good Parts", "Python Tricks"

**Dados de Entrada:**
- Termo de busca: "clean"

**Passos de Execução:**
1. Localizar campo de busca no cabeçalho da lista
2. Digitar "clean" no campo de busca
3. Observar resultado em tempo real

**Resultado Esperado:**
- Apenas o livro "Clean Code" é exibido
- Outros livros ficam ocultos
- Busca funciona em tempo real (sem botão)
- Busca é case-insensitive
- Se não encontrar nada, exibe mensagem apropriada

**Critérios de Aceitação:**
- ✅ Busca case-insensitive
- ✅ Busca em tempo real
- ✅ Busca por correspondência parcial

---

### CT015 - Buscar por Autor

**Objetivo:** Verificar busca por nome do autor

| Campo | Valor |
|-------|-------|
| **ID:** | CT015 |
| **Prioridade:** | Média |
| **Tipo:** | Funcional |
| **Automação:** | Planejado |
| **Requisito:** | RF006 |

**Pré-condições:**
- Sistema carregado e funcional
- Livros cadastrados com autores: "Robert Martin", "Douglas Crockford", "Dan Bader"

**Dados de Entrada:**
- Termo de busca: "martin"

**Passos de Execução:**
1. Localizar campo de busca no cabeçalho da lista
2. Digitar "martin" no campo de busca
3. Observar resultado em tempo real

**Resultado Esperado:**
- Apenas livros do autor "Robert Martin" são exibidos
- Outros livros ficam ocultos
- Busca funciona em tempo real
- Busca é case-insensitive
- Busca funciona tanto em título quanto autor

**Critérios de Aceitação:**
- ✅ Busca simultânea em título e autor
- ✅ Case-insensitive
- ✅ Correspondência parcial

---

## 5. CASOS DE TESTE - INTERFACE E USABILIDADE

### CT016 - Responsividade Mobile

**Objetivo:** Verificar adequação da interface para dispositivos móveis

| Campo | Valor |
|-------|-------|
| **ID:** | CT016 |
| **Prioridade:** | Alta |
| **Tipo:** | Interface |
| **Automação:** | Não |
| **Requisito:** | RNF003 |

**Pré-condições:**
- Sistema carregado em dispositivo móvel ou simulador
- Resolução de teste: 375x667 (iPhone SE)

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Abrir sistema em viewport móvel (375px largura)
2. Verificar layout do cabeçalho
3. Verificar formulário de cadastro
4. Verificar botões de controle
5. Verificar lista de livros
6. Testar todas as funcionalidades principais

**Resultado Esperado:**
- Layout se adapta automaticamente
- Todos os elementos ficam visíveis
- Botões têm tamanho adequado para toque
- Formulário fica em coluna única
- Lista de livros empilha verticalmente
- Não há rolagem horizontal
- Todas as funcionalidades funcionam

**Critérios de Aceitação:**
- ✅ Sem overflow horizontal
- ✅ Elementos tapeáveis > 44px
- ✅ Texto legível sem zoom

---

### CT017 - Feedback Visual de Ações

**Objetivo:** Verificar feedback visual adequado para ações do usuário

| Campo | Valor |
|-------|-------|
| **ID:** | CT017 |
| **Prioridade:** | Média |
| **Tipo:** | Interface |
| **Automação:** | Não |
| **Requisito:** | RNF001 |

**Pré-condições:**
- Sistema carregado e funcional

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Cadastrar um livro e observar feedback
2. Editar um livro e observar feedback
3. Marcar livro como lido e observar feedback
4. Excluir um livro e observar feedback
5. Tentar ação inválida e observar feedback

**Resultado Esperado:**
- Cada ação exibe alerta temporário apropriado
- Cores diferentes para tipos de mensagem:
  - Verde: sucesso
  - Vermelho: erro
  - Amarelo: aviso
  - Azul: informação
- Alertas desaparecem automaticamente após 4s
- Animações suaves de entrada/saída

**Critérios de Aceitação:**
- ✅ Feedback para todas as ações
- ✅ Cores e ícones apropriados
- ✅ Timing adequado de exibição

---

### CT018 - Acessibilidade Básica

**Objetivo:** Verificar recursos básicos de acessibilidade

| Campo | Valor |
|-------|-------|
| **ID:** | CT018 |
| **Prioridade:** | Baixa |
| **Tipo:** | Interface |
| **Automação:** | Não |
| **Requisito:** | RNF001 |

**Pré-condições:**
- Sistema carregado
- Leitor de tela ou simulador disponível

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Navegar usando apenas teclado (Tab)
2. Verificar ordem de foco lógica
3. Testar tecla Enter em botões
4. Verificar contraste de cores
5. Verificar labels de formulário

**Resultado Esperado:**
- Navegação por teclado funcional
- Ordem de foco lógica
- Todos os elementos interativos focáveis
- Indicador visual de foco claro
- Labels associados aos inputs
- Contraste adequado para leitura

**Critérios de Aceitação:**
- ✅ Navegação completa por teclado
- ✅ Indicadores de foco visíveis
- ✅ Labels descritivos

---

## 6. CASOS DE TESTE - PERFORMANCE

### CT019 - Tempo de Carregamento Inicial

**Objetivo:** Verificar tempo de carregamento da aplicação

| Campo | Valor |
|-------|-------|
| **ID:** | CT019 |
| **Prioridade:** | Média |
| **Tipo:** | Performance |
| **Automação:** | Sim |
| **Requisito:** | RNF002 |

**Pré-condições:**
- Sistema hospedado e acessível
- Conexão de internet estável
- Cache do navegador limpo

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Limpar cache e dados do navegador
2. Abrir DevTools e ir para aba Network
3. Carregar a página do sistema
4. Medir tempo até DOMContentLoaded
5. Medir tempo até Load completo

**Resultado Esperado:**
- DOMContentLoaded: < 1 segundo
- Load completo: < 3 segundos
- Primeira pintura com conteúdo: < 1.5 segundos
- Interface responsiva imediatamente

**Critérios de Aceitação:**
- ✅ Tempo total < 3 segundos
- ✅ Interface utilizável < 2 segundos
- ✅ Sem erros de carregamento

---

### CT020 - Performance com Muitos Dados

**Objetivo:** Verificar performance com volume alto de livros

| Campo | Valor |
|-------|-------|
| **ID:** | CT020 |
| **Prioridade:** | Baixa |
| **Tipo:** | Performance |
| **Automação:** | Planejado |
| **Requisito:** | RNF002 |

**Pré-condições:**
- Sistema carregado
- Script de criação de dados de teste disponível

**Dados de Entrada:**
- 500 livros de teste

**Passos de Execução:**
1. Carregar 500 livros via script de teste
2. Medir tempo de renderização da lista
3. Testar responsividade da busca
4. Testar mudanças de filtro
5. Testar operações CRUD

**Resultado Esperado:**
- Renderização inicial: < 500ms
- Busca em tempo real: < 100ms por caractere
- Mudança de filtros: < 200ms
- Operações CRUD: < 100ms
- Interface permanece responsiva

**Critérios de Aceitação:**
- ✅ Sem travamentos ou delays perceptíveis
- ✅ Scroll suave na lista
- ✅ Operações executam rapidamente

---

## 7. CASOS DE TESTE - PERSISTÊNCIA

### CT021 - Persistência Após Reload

**Objetivo:** Verificar que dados são mantidos após recarregar página

| Campo | Valor |
|-------|-------|
| **ID:** | CT021 |
| **Prioridade:** | Crítica |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF009 |

**Pré-condições:**
- Sistema carregado
- localStorage do navegador ativo

**Dados de Entrada:**
- Livro de teste: "Test Book" - "Test Author"

**Passos de Execução:**
1. Cadastrar livro "Test Book" - "Test Author"
2. Marcar livro como lido
3. Verificar que livro está na lista como "Lido"
4. Recarregar a página (F5 ou Ctrl+R)
5. Verificar estado dos dados após reload

**Resultado Esperado:**
- Livro permanece na lista após reload
- Status "Lido" é mantido
- Estatísticas corretas são exibidas
- Nenhum dado é perdido
- Interface carrega com estado anterior

**Critérios de Aceitação:**
- ✅ Dados íntegros após reload
- ✅ Status mantidos corretamente
- ✅ Estatísticas precisas

---

### CT022 - Limpeza Completa de Dados

**Objetivo:** Verificar funcionalidade de limpeza total

| Campo | Valor |
|-------|-------|
| **ID:** | CT022 |
| **Prioridade:** | Alta |
| **Tipo:** | Funcional |
| **Automação:** | Sim |
| **Requisito:** | RF008 |

**Pré-condições:**
- Sistema carregado
- Múltiplos livros cadastrados (pelo menos 3)

**Dados de Entrada:**
- N/A

**Passos de Execução:**
1. Verificar que existem livros na lista
2. Clicar no botão "Limpar Tudo"
3. Ler mensagem do modal de confirmação
4. Clicar em "Confirmar"
5. Verificar estado da aplicação

**Resultado Esperado:**
- Modal exibe aviso sobre ação irreversível
- Após confirmação: todos os livros são removidos
- Lista fica vazia
- Estado vazio é exibido apropriadamente
- Todas as estatísticas zeradas (0, 0, 0)
- Mensagem de sucesso: "Todos os livros foram removidos!"

**Critérios de Aceitação:**
- ✅ Confirmação obrigatória
- ✅ Limpeza completa dos dados
- ✅ Interface atualizada corretamente

---

### CT023 - Integridade de Dados no localStorage

**Objetivo:** Verificar integridade dos dados salvos localmente

| Campo | Valor |
|-------|-------|
| **ID:** | CT023 |
| **Prioridade:** | Média |
| **Tipo:** | Funcional |
| **Automação:** | Planejado |
| **Requisito:** | RF009 |

**Pré-condições:**
- Sistema carregado
- DevTools aberto para inspeção de localStorage

**Dados de Entrada:**
- Múltiplos livros com diferentes status

**Passos de Execução:**
1. Cadastrar 3 livros diferentes
2. Marcar 2 como lidos, deixar 1 para ler
3. Abrir DevTools > Application > localStorage
4. Verificar estrutura dos dados salvos
5. Verificar formato JSON válido
6. Comparar dados salvos com interface

**Resultado Esperado:**
- Dados salvos em formato JSON válido
- Chave: 'readingManagerBooks'
- Estrutura correta dos objetos livro:
  - id (string única)
  - title (string)
  - author (string)  
  - isRead (boolean)
  - dateAdded (ISO string)
- Dados consistentes com interface

**Critérios de Aceitação:**
- ✅ JSON válido e bem formado
- ✅ Todos os campos obrigatórios presentes
- ✅ Tipos de dados corretos

---

## 8. MATRIZ DE COBERTURA

### 8.1 Cobertura por Requisito

| Requisito | Casos de Teste | Status |
|-----------|---------------|---------|
| RF001 | CT001, CT002, CT003, CT004 | ✅ |
| RF002 | CT005, CT006 | ✅ |
| RF003 | CT007, CT008 | ✅ |
| RF004 | CT009, CT010 | ✅ |
| RF005 | CT011, CT012, CT013 | ✅ |
| RF006 | CT014, CT015 | ✅ |
| RF007 | Incluído em outros CTs | ✅ |
| RF008 | CT022 | ✅ |
| RF009 | CT021, CT023 | ✅ |
| RNF001 | CT016, CT017, CT018 | ✅ |
| RNF002 | CT019, CT020 | ✅ |
| RNF003 | CT016 | ✅ |

### 8.2 Resumo Estatístico

- **Total de Casos:** 23
- **Casos Críticos:** 6 (26%)
- **Casos Altos:** 8 (35%)
- **Casos Médios:** 7 (30%)
- **Casos Baixos:** 2 (9%)
- **Automação Planejada:** 15 (65%)

---

## 9. EXECUÇÃO E RESULTADOS

### 9.1 Template de Execução

Para cada caso de teste, documentar:

- ✅ **PASSOU** - Resultado conforme esperado
- ❌ **FALHOU** - Resultado diferente do esperado  
- ⚠️ **BLOQUEADO** - Não pode ser executado
- ⏸️ **PULADO** - Não executado nesta rodada

### 9.2 Registro de Defeitos

Defeitos encontrados devem ser registrados referenciando o caso de teste correspondente e incluindo:
- ID do defeito
- Severidade e prioridade  
- Passos para reproduzir
- Resultado atual vs esperado
- Ambiente e versão

---

**Aprovação:**

| Papel | Nome | Data | Assinatura |
|-------|------|------|-----------|
| Analista de Teste | [Nome] | [Data] | [Assinatura] |
| Líder de QA | [Nome] | [Data] | [Assinatura] |

---

*Documento controlado - Versão 1.0*
