# Bugs que Encontrei - Gerenciador de Leituras

Durante os testes do meu app, encontrei alguns problemas que precisavam ser corrigidos. Documentei aqui os principais bugs, como um bom QA deve fazer! 😄

**Período de teste:** Dezembro 2024  
**Testado por:** Eu mesmo

---

## Resumo dos Bugs

**Total encontrado:** 6 defeitos
- 🔴 **Críticos:** 1 (que sorte que foi só um!)
- 🟡 **Médios:** 3 (coisinhas chatas mas não quebram o app)
- 🟢 **Baixos:** 2 (melhorias de UX)

**Status atual:**
- ✅ **Corrigidos:** 4 bugs
- 🔄 **Em andamento:** 2 bugs (vou resolver depois)

---

## 🔴 CRÍTICO

### BUG001 - Perda de dados ao limpar navegador

**O que acontece:** Quando limpo os dados do navegador, perco todos os meus livros sem aviso!

**Como reproduzir:**
1. Adicionar alguns livros no app
2. Ir nas configurações do navegador
3. Limpar dados de navegação
4. Voltar no app - tudo sumiu! 😱

**Por que é crítico:** Perder todos os dados sem aviso é inaceitável. Isso destruiria a confiança do usuário.

**💭 Como descobri:** Aconteceu comigo quando estava limpando o navegador pra testar outra coisa. Quase chorei! 

**Status:** ✅ **CORRIGIDO** - Adicionei validação e mensagem explicativa sobre localStorage

---

## 🟡 MÉDIOS

### BUG002 - Busca não funciona com acentos

**O que acontece:** Se busco "análise", não encontra o livro "Análise de Riscos"

**Como reproduzir:**
1. Ter livro com acentos: "Análise de Riscos"
2. Buscar por "analise" (sem acento)
3. Não encontra nada

**Por que importa:** Usuários podem não lembrar exatamente como digitaram o título.

**💭 Como descobri:** Eu mesmo sempre esqueço de usar acentos quando digito rápido!

**Status:** 🔄 **EM ANDAMENTO** - Preciso implementar busca sem sensibilidade a acentos

---

### BUG003 - Mensagem de duplicado case-sensitive

**O que acontece:** "Clean Code" e "clean code" são tratados como livros diferentes

**Como reproduzir:**
1. Adicionar "Clean Code"
2. Tentar adicionar "clean code"
3. Sistema permite (mas não deveria)

**Por que importa:** Usuário pode acabar com duplicatas por causa de maiúsculas/minúsculas.

**💭 Como descobri:** Testando cenários de duplicatas. Me lembrei que usuário não é consistente com maiúsculas.

**Status:** ✅ **CORRIGIDO** - Implementei comparação case-insensitive

---

### BUG004 - Modal de confirmação muito pequeno no mobile

**O que acontece:** No celular, o modal de confirmação fica difícil de ler

**Como reproduzir:**
1. Abrir app no celular
2. Tentar excluir um livro
3. Modal aparece pequeno demais

**Por que importa:** UX ruim no mobile pode frustrar usuários.

**💭 Como descobri:** Testando no meu celular. Tive que dar zoom pra conseguir ler!

**Status:** ✅ **CORRIGIDO** - Ajustei tamanho dos modais para telas pequenas

---

## 🟢 BAIXOS (melhorias de UX)

### BUG005 - Sem feedback visual ao salvar

**O que acontece:** Quando edito um livro, não tenho certeza se salvou

**Como reproduzir:**
1. Editar um livro
2. Clicar em salvar
3. Não tem feedback claro que funcionou

**Por que reportei:** Feedback visual sempre melhora a experiência do usuário.

**💭 Como descobri:** Fiquei na dúvida se tinha salvado mesmo, tive que recarregar pra ter certeza.

**Status:** ✅ **CORRIGIDO** - Adicionei mensagem "Livro atualizado com sucesso!"

---

### BUG006 - Botões muito próximos no mobile

**O que acontece:** No celular, é fácil clicar no botão errado (editar vs excluir)

**Como reproduzir:**
1. Abrir no celular
2. Tentar clicar em "Editar"
3. Às vezes clico em "Excluir" por engano

**Por que reportei:** Prevenção de acidentes. Excluir por engano seria frustrante.

**💭 Como descobri:** Aconteceu comigo várias vezes durante os testes!

**Status:** 🔄 **PENDENTE** - Vou aumentar espaçamento entre botões

---

## Métricas de Qualidade

### Taxa de Defeitos por Funcionalidade
- **CRUD de livros:** 2 bugs (componente mais testado)
- **Interface mobile:** 2 bugs (área que precisa mais atenção)
- **Busca:** 1 bug (funcionalidade complexa)
- **Persistência:** 1 bug (crítico mas isolado)

### Tempo Médio de Correção
- **Críticos:** 2 horas (prioridade máxima!)
- **Médios:** 1 hora (corrigidos rapidamente)
- **Baixos:** Ainda não corrigidos (backlog)

### Severidade dos Bugs por Área
- **Interface:** Mostly baixa severidade (UX)
- **Backend Logic:** Média severidade (funcional)
- **Data Persistence:** Alta severidade (crítico)

---

## Lições Aprendidas

**O que funcionou bem:**
- Testes manuais no celular revelaram vários problemas de UX
- Testar cenários "reais" (como eu mesmo usaria) encontrou bugs importantes
- Documentar tudo ajuda a não esquecer de corrigir depois

**O que melhoraria:**
- Testar mais cenários edge-case desde o início
- Automatizar testes de responsividade
- Fazer mais testes de acessibilidade

**📝 Nota pessoal:** Encontrar bugs no próprio código é meio frustrante, mas também gratificante quando corrijo tudo! É assim que se aprende.

---

*Documentado com carinho para demonstrar competências em QA e gestão de defeitos* ♥
