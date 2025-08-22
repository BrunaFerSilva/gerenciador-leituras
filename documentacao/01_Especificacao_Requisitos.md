# ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE
## Sistema Gerenciador de Leituras

**Versão:** 1.0  
**Data:** Dezembro 2024  
**Autor:** Analista de Sistemas  
**Revisor:** Analista de Teste  

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento especifica os requisitos funcionais e não-funcionais do Sistema Gerenciador de Leituras, uma aplicação web destinada ao controle e organização de livros pessoais.

### 1.2 Escopo
O sistema permitirá aos usuários gerenciar uma biblioteca pessoal, controlando livros lidos e lista de desejos de leitura.

### 1.3 Definições e Abreviações
- **SGL:** Sistema Gerenciador de Leituras
- **UI/UX:** Interface de Usuário / Experiência do Usuário
- **SPA:** Single Page Application
- **localStorage:** Armazenamento local do navegador

---

## 2. DESCRIÇÃO GERAL

### 2.1 Perspectiva do Produto
O SGL é uma aplicação web standalone que funciona integralmente no navegador, sem necessidade de backend ou banco de dados externo.

### 2.2 Funções do Produto
- Cadastro e gerenciamento de livros
- Controle de status de leitura
- Organização por categorias
- Busca e filtros
- Estatísticas de leitura

### 2.3 Características dos Usuários
**Perfil:** Leitores que desejam organizar sua biblioteca pessoal  
**Experiência Técnica:** Usuários básicos de internet  
**Frequência de Uso:** Diária/Semanal  

---

## 3. REQUISITOS FUNCIONAIS

### RF001 - Cadastro de Livro
**Descrição:** O sistema deve permitir ao usuário cadastrar novos livros  
**Prioridade:** Alta  
**Entradas:** Título do livro (obrigatório), Autor(es) (obrigatório)  
**Processamento:** Validar duplicatas, gerar ID único, salvar no localStorage  
**Saídas:** Confirmação de cadastro, atualização da lista  
**Critérios de Aceitação:**
- O título deve ter no mínimo 1 caractere
- O autor deve ter no mínimo 1 caractere
- Não deve permitir cadastro de livros duplicados (mesmo título e autor)
- Deve exibir mensagem de sucesso após cadastro

### RF002 - Edição de Livro
**Descrição:** O sistema deve permitir editar informações de livros já cadastrados  
**Prioridade:** Média  
**Entradas:** ID do livro, novos valores para título e autor  
**Processamento:** Localizar livro, validar dados, atualizar informações  
**Saídas:** Confirmação de atualização, lista atualizada  
**Critérios de Aceitação:**
- Deve preservar o ID original do livro
- Deve validar os mesmos critérios do cadastro
- Deve manter o status de leitura atual

### RF003 - Exclusão de Livro
**Descrição:** O sistema deve permitir remover livros da lista  
**Prioridade:** Média  
**Entradas:** ID do livro a ser removido  
**Processamento:** Solicitar confirmação, remover do localStorage  
**Saídas:** Modal de confirmação, atualização da lista  
**Critérios de Aceitação:**
- Deve exibir modal de confirmação antes da exclusão
- Deve permitir cancelar a operação
- Deve atualizar estatísticas após exclusão

### RF004 - Controle de Status de Leitura
**Descrição:** O sistema deve permitir marcar/desmarcar livros como lidos  
**Prioridade:** Alta  
**Entradas:** ID do livro  
**Processamento:** Alternar status booleano isRead  
**Saídas:** Atualização visual do status, estatísticas atualizadas  
**Critérios de Aceitação:**
- Deve alternar entre "Para Ler" e "Lido"
- Deve atualizar a aparência visual do livro
- Deve recalcular estatísticas automaticamente

### RF005 - Visualização por Categorias
**Descrição:** O sistema deve permitir filtrar livros por status  
**Prioridade:** Alta  
**Entradas:** Seleção de filtro (Todos, Para Ler, Lidos)  
**Processamento:** Filtrar lista baseado no status isRead  
**Saídas:** Lista filtrada de livros  
**Critérios de Aceitação:**
- "Todos" deve exibir todos os livros
- "Para Ler" deve exibir apenas livros com isRead = false
- "Lidos" deve exibir apenas livros com isRead = true

### RF006 - Busca de Livros
**Descrição:** O sistema deve permitir buscar livros por título ou autor  
**Prioridade:** Média  
**Entradas:** Termo de busca (texto livre)  
**Processamento:** Filtrar lista por correspondência parcial case-insensitive  
**Saídas:** Lista filtrada de livros  
**Critérios de Aceitação:**
- Deve buscar em título e autor simultaneamente
- Deve ser case-insensitive
- Deve funcionar em tempo real (sem necessidade de botão)

### RF007 - Estatísticas de Leitura
**Descrição:** O sistema deve exibir estatísticas de leitura  
**Prioridade:** Baixa  
**Entradas:** Lista atual de livros  
**Processamento:** Calcular totais por categoria  
**Saídas:** Total de livros, livros lidos, livros para ler  
**Critérios de Aceitação:**
- Deve atualizar automaticamente a cada mudança
- Deve exibir sempre valores corretos
- Deve ser visualmente destacado

### RF008 - Limpeza Geral
**Descrição:** O sistema deve permitir remover todos os livros  
**Prioridade:** Baixa  
**Entradas:** Comando de limpeza  
**Processamento:** Solicitar confirmação, limpar localStorage  
**Saídas:** Modal de confirmação, lista vazia  
**Critérios de Aceitação:**
- Deve exibir modal de confirmação
- Deve informar que a ação é irreversível
- Deve zerar todas as estatísticas

### RF009 - Persistência de Dados
**Descrição:** O sistema deve manter os dados entre sessões  
**Prioridade:** Alta  
**Entradas:** Qualquer alteração nos dados  
**Processamento:** Salvar automaticamente no localStorage  
**Saídas:** Dados persistidos localmente  
**Critérios de Aceitação:**
- Deve salvar automaticamente a cada mudança
- Deve carregar dados na inicialização
- Deve funcionar offline

---

## 4. REQUISITOS NÃO-FUNCIONAIS

### RNF001 - Usabilidade
- A interface deve ser intuitiva para usuários básicos
- Deve fornecer feedback visual para todas as ações
- Tempo máximo de aprendizado: 5 minutos

### RNF002 - Performance
- Tempo de carregamento inicial: máximo 3 segundos
- Tempo de resposta para operações: máximo 500ms
- Suporte a até 1000 livros sem degradação perceptível

### RNF003 - Compatibilidade
- Deve funcionar nos navegadores: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- Deve ser responsivo para dispositivos móveis
- Deve funcionar offline após carregamento inicial

### RNF004 - Segurança
- Deve validar todas as entradas do usuário
- Deve escapar HTML para prevenir XSS
- Não deve processar dados sensíveis

### RNF005 - Manutenibilidade
- Código deve seguir padrões de clean code
- Deve ter estrutura modular e orientada a objetos
- Documentação inline adequada

### RNF006 - Confiabilidade
- Deve tratar erros graciosamente
- Não deve perder dados em caso de falhas do navegador
- Deve validar integridade dos dados do localStorage

---

## 5. RESTRIÇÕES

### 5.1 Restrições Técnicas
- Deve ser uma SPA (Single Page Application)
- Deve usar apenas tecnologias front-end (HTML5, CSS3, JavaScript ES6+)
- Não deve requerer instalação ou servidor backend

### 5.2 Restrições de Negócio
- Dados são armazenados apenas localmente
- Não há sincronização entre dispositivos
- Não há controle de acesso ou multiusuário

---

## 6. CASOS DE USO PRINCIPAIS

### UC001 - Adicionar Livro à Lista
**Ator:** Usuário  
**Pré-condições:** Sistema carregado  
**Fluxo Principal:**
1. Usuário acessa o formulário de cadastro
2. Usuário informa título e autor
3. Usuário clica em "Adicionar Livro"
4. Sistema valida os dados
5. Sistema adiciona o livro à lista
6. Sistema exibe confirmação

**Fluxos Alternativos:**
- 4a. Dados inválidos: sistema exibe erro e solicita correção
- 4b. Livro duplicado: sistema exibe aviso e não adiciona

### UC002 - Marcar Livro como Lido
**Ator:** Usuário  
**Pré-condições:** Livro cadastrado na lista  
**Fluxo Principal:**
1. Usuário localiza livro na lista
2. Usuário clica em "Marcar Lido"
3. Sistema atualiza o status do livro
4. Sistema atualiza a interface visual
5. Sistema atualiza estatísticas

**Fluxos Alternativos:**
- 2a. Livro já está lido: botão muda para "Não Lido"

---

## 7. MATRIZ DE RASTREABILIDADE

| Requisito | Funcionalidade Implementada | Testes Necessários |
|-----------|-----------------------------|--------------------|
| RF001 | BookManager.addBook() | Cadastro válido, duplicatas, campos obrigatórios |
| RF002 | BookManager.editBook() | Edição válida, preservação de ID |
| RF003 | BookManager.deleteBook() | Exclusão com confirmação |
| RF004 | BookManager.toggleReadStatus() | Alternância de status |
| RF005 | BookManager.setView() | Filtros por categoria |
| RF006 | BookManager.handleSearch() | Busca por título/autor |
| RF007 | BookManager.updateStats() | Cálculo de estatísticas |
| RF008 | BookManager.clearAllBooks() | Limpeza com confirmação |
| RF009 | BookManager.saveBooks() | Persistência automática |

---

## 8. CRITÉRIOS DE ACEITAÇÃO GERAIS

1. **Funcionalidade:** Todos os requisitos funcionais devem estar implementados e funcionando
2. **Interface:** Interface deve ser responsiva e intuitiva
3. **Performance:** Sistema deve responder em menos de 500ms para operações locais
4. **Qualidade:** Código deve passar em review de qualidade
5. **Testes:** Cobertura de testes deve ser superior a 80%

---

**Aprovações:**

| Papel | Nome | Data | Assinatura |
|-------|------|------|-----------|
| Product Owner | [Nome] | [Data] | [Assinatura] |
| Analista de Testes | [Nome] | [Data] | [Assinatura] |
| Desenvolvedor | [Nome] | [Data] | [Assinatura] |

---

*Documento controlado - Versão 1.0*
