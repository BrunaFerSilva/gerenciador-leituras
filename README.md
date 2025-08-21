# 📚 Gerenciador de Leituras

Um aplicativo web moderno para gerenciar sua lista de livros lidos e para ler, desenvolvido como projeto de portfólio.

## 🎯 Objetivo

Sistema para organizar livros que o usuário deseja ler ou já leu, permitindo cadastro, edição, marcação de status e visualização em listas separadas.

## ✨ Funcionalidades

### Requisitos Implementados

| ID | Título do Requisito | Descrição | Status |
|----|-------------------|-----------|---------|
| R01 | Adição de livro à lista | O usuário pode adicionar novos livros informando título e autor | ✅ |
| R02 | Marcar livro como lido | O usuário pode marcar/desmarcar livros como "Lido" | ✅ |
| R03 | Remoção de livro da lista | O usuário pode remover livros da lista com confirmação | ✅ |
| R04 | Visualização das listas | Visualização separada de "Todos", "Para Ler" e "Lidos" | ✅ |
| R05 | Edição de informações | O usuário pode editar título e autor de livros cadastrados | ✅ |
| R06 | Persistência temporária | Dados mantidos no localStorage durante navegação | ✅ |
| R07 | Limpeza das listas | Opção para limpar todos os livros com confirmação | ✅ |

### Funcionalidades Extras

- 🔍 **Busca em tempo real** por título ou autor
- 📊 **Estatísticas** de leitura (total, lidos, para ler)
- 📱 **Design responsivo** para desktop e mobile
- ⚡ **Interface moderna** com animações suaves
- 🛡️ **Validações** e confirmações de segurança
- 💾 **Livros pré-cadastrados** relacionados a testes de software

## 🚀 Como Usar

1. **Abrir o projeto:**
   - Faça o download dos arquivos
   - Abra o arquivo `index.html` em qualquer navegador web moderno

2. **Gerenciar livros:**
   - **Adicionar:** Preencha título e autor, clique em "Adicionar Livro"
   - **Marcar como lido:** Clique no botão "Marcar Lido" do livro desejado
   - **Editar:** Clique em "Editar", modifique os dados e salve
   - **Remover:** Clique em "Remover" e confirme a ação

3. **Navegação:**
   - Use os filtros "Todos", "Para Ler" e "Lidos"
   - Digite na barra de busca para encontrar livros específicos
   - Visualize estatísticas no painel superior

## 📁 Estrutura do Projeto

```
gerenciador-leituras/
├── index.html          # Estrutura HTML principal
├── style.css           # Estilos e design responsivo
├── script.js           # Lógica JavaScript da aplicação
└── README.md           # Documentação do projeto
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos, flexbox, grid, animações
- **JavaScript (ES6+)** - Lógica da aplicação, classes, localStorage
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Inter)

## 📚 Livros Pré-cadastrados

O sistema vem com os seguintes livros sobre testes de software já cadastrados:

1. Lessons Learned in Software Testing - Cem Kaner e James Marcus Bach
2. The Art of Software Testing - Glenford Myers
3. Explore It!: Reduce Risk and Increase Confidence with Exploratory Testing - Elisabeth Hendrickson
4. Agile Testing Condensed - Lisa Crispin and Janet Gregory
5. Análise De Riscos Em Projetos De Teste De Software - Emerson Rios
6. Taking Testing Seriously: The Rapid Software Testing Approach - James Bach e Michael Bolton

## 🔧 Características Técnicas

- **SPA (Single Page Application)** - Tudo roda em uma única página
- **Armazenamento local** - Dados persistidos no localStorage do navegador
- **Sem dependências externas** - Funciona offline após carregamento inicial
- **Responsivo** - Adaptável a diferentes tamanhos de tela
- **Acessível** - Seguindo boas práticas de acessibilidade

## 📱 Compatibilidade

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móveis (iOS, Android)

## 🎨 Design Features

- Gradientes modernos
- Glassmorphism (efeito de vidro)
- Microinterações e animações
- Sistema de cores consistente
- Tipografia legível
- Estados visuais claros (hover, focus, loading)

## 📝 Notas de Implementação

- **Validação:** Previne duplicatas e campos vazios
- **Confirmações:** Ações destrutivas requerem confirmação
- **Feedback:** Alertas visuais para todas as ações
- **Estado:** Interface sempre reflete o estado atual dos dados
- **Performance:** Renderização eficiente com animações otimizadas

---

*Projeto desenvolvido como parte de um portfólio pessoal demonstrando habilidades em desenvolvimento web front-end.*
