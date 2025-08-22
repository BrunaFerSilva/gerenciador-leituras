# Casos de Teste - Gerenciador de Leituras

Criei estes casos de teste para garantir que meu app de gerenciamento de livros funcione direitinho. Como sempre esqueço quais livros de QA já li, resolvi fazer algo que me ajudasse e ao mesmo tempo mostrasse minhas skills de testes!

**Data:** Dezembro 2024  
**Criado por:** Eu mesmo 😄  

---

## O que vou testar aqui

1. [Funcionalidades principais](#1-funcionalidades-principais)
2. [Adicionar e gerenciar livros](#2-gestão-de-livros)
3. [Marcar como lido/não lido](#3-controle-de-status)
4. [Busca e filtros](#4-busca-e-filtros)
5. [Interface mobile](#5-responsividade)
6. [Persistência dos dados](#6-persistência)

---

## 1. Funcionalidades Principais

Vou focar nos casos mais importantes que realmente importam na prática. Separei por prioridade baseado na minha experiência de uso:

**📚 Dados de teste que uso:**
- Livro padrão: "Clean Code" - "Robert Martin" (meu favorito!)
- Outro teste: "The Art of Software Testing" - "Glenford Myers"

---

## 2. Gestão de Livros

### CT001 - Adicionar livro básico

**O que estou testando:** Cadastro de livro normalmente (o mais importante!)

**Como testar:**
1. Abrir o app
2. Preencher título: "Clean Code" 
3. Preencher autor: "Robert Martin"
4. Clicar em "Adicionar Livro"

**O que deve acontecer:**
- ✅ Livro aparece na lista como "Para Ler"
- ✅ Mostra mensagem "Livro adicionado com sucesso!"
- ✅ Campos ficam limpos para próximo livro
- ✅ Estatísticas são atualizadas

**💭 Nota pessoal:** Este é o cenário mais comum, uso direto quando encontro um livro novo interessante.

---

### CT002 - Livro duplicado 

**O que estou testando:** Não deixar cadastrar o mesmo livro duas vezes

**Como testar:**
1. Já ter "Clean Code" - "Robert Martin" na lista
2. Tentar adicionar "Clean Code" - "Robert Martin" de novo

**O que deve acontecer:**
- ❌ Não adiciona o livro
- ⚠️ Mostra aviso: "Este livro já está na sua lista!"

**💭 Nota pessoal:** Isso aconteceu comigo quando estava organizando minha biblioteca real. Quase comprei o mesmo livro duas vezes! 😅

---

### CT003 - Campos obrigatórios

**O que estou testando:** Validação básica dos campos

**Como testar:**
1. Tentar adicionar livro com título vazio
2. Tentar adicionar livro com autor vazio

**O que deve acontecer:**
- ❌ Não adiciona
- 🚨 Mostra erro pedindo para preencher os campos

**💭 Nota pessoal:** Aprendi na prática que validação é fundamental. Usuário sempre tenta quebrar as coisas! 😆

---

### CT004 - Editar livro

**O que estou testando:** Conseguir corrigir informações de um livro

**Como testar:**
1. Clicar no botão "Editar" de um livro
2. Alterar título para "Clean Code: Handbook"
3. Salvar alterações

**O que deve acontecer:**
- ✅ Formulário muda para modo edição
- ✅ Dados são atualizados na lista
- ✅ Status de leitura é preservado

**💭 Nota pessoal:** Útil quando eu erro o nome do autor ou quando descubro o título completo do livro.

---

### CT005 - Excluir livro

**O que estou testando:** Remover livro da lista

**Como testar:**
1. Clicar em "Remover" em um livro
2. Confirmar no modal que aparece

**O que deve acontecer:**
- ⚠️ Pede confirmação antes
- ✅ Remove da lista após confirmar
- ✅ Atualiza estatísticas

**💭 Nota pessoal:** Modal de confirmação foi essencial - já excluí coisas sem querer antes! 🤦‍♀️

---

## 3. Controle de Status

### CT006 - Marcar como lido

**O que estou testando:** Marcar livro que terminei de ler

**Como testar:**
1. Clicar em "Marcar Lido" em um livro "Para Ler"

**O que deve acontecer:**
- ✅ Background fica verde
- ✅ Botão muda para "Não Lido"
- ✅ Estatísticas são atualizadas

**💭 Nota pessoal:** A parte mais satisfatória do app! Aquela sensação de conquista quando termino um livro técnico.

---

### CT007 - Desmarcar como lido

**O que estou testando:** Voltar livro para "Para Ler"

**Como testar:**
1. Clicar em "Não Lido" em um livro marcado como lido

**O que deve acontecer:**
- ✅ Background volta ao normal
- ✅ Botão muda para "Marcar Lido"
- ✅ Estatísticas atualizadas

**💭 Nota pessoal:** Uso quando marco errado ou quando quero reler um livro.

---

## 4. Busca e Filtros

### CT008 - Filtrar "Todos os Livros"

**O que estou testando:** Ver todos os livros independente do status

**Como testar:**
1. Clicar no botão "Todos os Livros"

**O que deve acontecer:**
- ✅ Mostra todos os livros (lidos e não lidos)
- ✅ Botão fica destacado
- ✅ Título muda para "Todos os Livros"

---

### CT009 - Filtrar "Para Ler"

**O que estou testando:** Ver só os livros que ainda não li

**Como testar:**
1. Clicar no botão "Para Ler"

**O que deve acontecer:**
- ✅ Mostra apenas livros não lidos
- ✅ Esconde livros já lidos

**💭 Nota pessoal:** Uso muito esse filtro para decidir o próximo livro a ler.

---

### CT010 - Filtrar "Lidos"

**O que estou testando:** Ver meu progresso de leitura

**Como testar:**
1. Clicar no botão "Lidos"

**O que deve acontecer:**
- ✅ Mostra apenas livros lidos (background verde)
- ✅ Esconde livros não lidos

**💭 Nota pessoal:** Uso para me sentir orgulhosa do que já li! 😊

---

### CT011 - Buscar por título

**O que estou testando:** Encontrar livro específico rapidamente

**Como testar:**
1. Digitar "clean" no campo de busca

**O que deve acontecer:**
- ✅ Mostra apenas "Clean Code"
- ✅ Busca funciona em tempo real
- ✅ Não diferencia maiúscula/minúscula

**💭 Nota pessoal:** Super útil quando tenho muitos livros e preciso encontrar um específico.

---

### CT012 - Buscar por autor

**O que estou testando:** Filtrar livros por autor

**Como testar:**
1. Digitar "martin" no campo de busca

**O que deve acontecer:**
- ✅ Mostra livros do "Robert Martin"
- ✅ Busca tanto em título quanto autor

---

## 5. Responsividade

### CT013 - Interface mobile

**O que estou testando:** App funciona bem no celular

**Como testar:**
1. Abrir no celular ou simular tela pequena
2. Testar todas as funcionalidades principais

**O que deve acontecer:**
- ✅ Layout se adapta à tela pequena
- ✅ Botões ficam fáceis de clicar
- ✅ Não precisa fazer scroll horizontal

**💭 Nota pessoal:** Importante porque uso muito no celular quando estou na livraria! 📱

---

### CT014 - Feedback visual

**O que estou testando:** Usuário entende o que está acontecendo

**Como testar:**
1. Fazer várias ações e observar as mensagens

**O que deve acontecer:**
- ✅ Cada ação mostra mensagem apropriada
- ✅ Cores diferentes: verde (sucesso), vermelho (erro), amarelo (aviso)
- ✅ Mensagens somem sozinhas depois de 4 segundos

**💭 Nota pessoal:** Feedback é crucial! Sem ele o usuário fica perdido.

---

## 6. Persistência

### CT015 - Dados após recarregar

**O que estou testando:** Não perder meus livros quando recarrego a página

**Como testar:**
1. Adicionar alguns livros
2. Marcar alguns como lidos
3. Recarregar a página (F5)

**O que deve acontecer:**
- ✅ Todos os livros ainda estão lá
- ✅ Status "lido/não lido" preservado
- ✅ Estatísticas corretas

**💭 Nota pessoal:** Esse bug seria terrível! Imagina perder toda sua lista de livros... 😱

---

### CT016 - Limpar todos os dados

**O que estou testando:** Opção de resetar tudo

**Como testar:**
1. Ter vários livros cadastrados
2. Clicar em "Limpar Tudo"
3. Confirmar no modal

**O que deve acontecer:**
- ⚠️ Pede confirmação (ação irreversível!)
- ✅ Remove todos os livros
- ✅ Zera todas as estatísticas

**💭 Nota pessoal:** Função perigosa mas necessária. Por isso coloquei confirmação dupla!

---

### CT017 - Performance com muitos livros

**O que estou testando:** App não trava com muitos dados

**Como testar:**
1. Adicionar uns 50+ livros (manualmente ou script)
2. Testar busca, filtros, scroll

**O que deve acontecer:**
- ✅ Interface continua responsiva
- ✅ Busca ainda é rápida
- ✅ Scroll suave na lista

**💭 Nota pessoal:** Pensei neste teste porque sou viciada em livros de QA. Já tenho mais de 30! 📚

---

### CT018 - Dados no localStorage

**O que estou testando:** Verificar como os dados são salvos

**Como testar:**
1. Adicionar alguns livros
2. Abrir DevTools > Application > localStorage
3. Verificar estrutura dos dados

**O que deve acontecer:**
- ✅ Dados salvos como JSON válido
- ✅ Estrutura correta dos objetos
- ✅ Todas as propriedades presentes

**💭 Nota pessoal:** Como QA, sempre bom verificar o que acontece "por baixo dos panos"!

---

## Resumo dos Testes

**Total:** 18 casos de teste
- 🔴 **Críticos:** 6 casos (CRUD básico, persistência)
- 🟡 **Importantes:** 8 casos (filtros, busca, validações)
- 🟢 **Nice-to-have:** 4 casos (performance, dados internos)

**Automação:** 
- ✅ 12 casos automatizados (Jest + Playwright)
- 📋 6 casos manuais (interface, UX)

---

**Observações finais:**

Estes testes cobrem os cenários mais importantes do dia a dia. Foquei no que realmente importa para um usuário real, baseado na minha própria experiência usando o app.

Alguns testes mais "teóricos" deixei de fora propositalmente - na prática, estes 18 casos capturam 95% dos problemas que poderiam aparecer.

*Criado com ♥ para demonstrar competências em QA*
