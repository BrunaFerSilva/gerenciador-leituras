/**
 * Testes End-to-End - Operações CRUD
 * Testa funcionalidades principais da aplicação no navegador
 */

import { test, expect } from '@playwright/test';

test.describe('Sistema Gerenciador de Leituras - Operações CRUD', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar para a aplicação
        await page.goto('file://' + __dirname + '/../../index.html');
        
        // Aguardar carregamento completo
        await page.waitForLoadState('networkidle');
        
        // Limpar localStorage para cada teste
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        // Recarregar página para garantir estado limpo
        await page.reload();
        await page.waitForLoadState('networkidle');
    });

    test('CT001 - Cadastrar livro com dados válidos', async ({ page }) => {
        // Arrange
        const titulo = 'Clean Code';
        const autor = 'Robert Martin';

        // Act
        await page.fill('#book-title', titulo);
        await page.fill('#book-author', autor);
        await page.click('#submit-btn');

        // Aguardar atualização da interface
        await page.waitForTimeout(500);

        // Assert
        // Verificar se livro aparece na lista
        const bookItem = page.locator('.book-item').first();
        await expect(bookItem).toBeVisible();
        
        // Verificar título e autor
        const bookTitle = bookItem.locator('.book-title');
        const bookAuthor = bookItem.locator('.book-author');
        await expect(bookTitle).toHaveText(titulo);
        await expect(bookAuthor).toContainText(autor);

        // Verificar que campos foram limpos
        await expect(page.locator('#book-title')).toHaveValue('');
        await expect(page.locator('#book-author')).toHaveValue('');

        // Verificar estatísticas
        await expect(page.locator('#total-books')).toHaveText('7'); // 6 iniciais + 1 novo
        await expect(page.locator('#books-to-read')).toHaveText('7');
        await expect(page.locator('#books-read')).toHaveText('0');

        // Verificar mensagem de sucesso (se visível)
        const alert = page.locator('.alert');
        if (await alert.isVisible()) {
            await expect(alert).toContainText('sucesso');
        }
    });

    test('CT002 - Prevenir cadastro de livro duplicado', async ({ page }) => {
        // Arrange - Cadastrar primeiro livro
        await page.fill('#book-title', 'Clean Code');
        await page.fill('#book-author', 'Robert Martin');
        await page.click('#submit-btn');
        await page.waitForTimeout(500);

        // Act - Tentar cadastrar livro duplicado
        await page.fill('#book-title', 'Clean Code');
        await page.fill('#book-author', 'Robert Martin');
        await page.click('#submit-btn');
        await page.waitForTimeout(500);

        // Assert
        // Verificar que não há livros duplicados na lista
        const bookItems = page.locator('.book-item:has-text("Clean Code")');
        await expect(bookItems).toHaveCount(1);

        // Verificar mensagem de aviso
        const alert = page.locator('.alert');
        if (await alert.isVisible()) {
            await expect(alert).toContainText('já está na sua lista');
        }

        // Verificar que estatísticas não mudaram
        await expect(page.locator('#total-books')).toHaveText('7'); // 6 iniciais + 1 novo
    });

    test('CT003 - Validar campos obrigatórios', async ({ page }) => {
        // Test 1: Título vazio
        await page.fill('#book-author', 'Robert Martin');
        await page.click('#submit-btn');
        
        // Verificar que não foi adicionado (mantém livros iniciais)
        await expect(page.locator('#total-books')).toHaveText('6');

        // Test 2: Autor vazio
        await page.fill('#book-title', 'Clean Code');
        await page.fill('#book-author', '');
        await page.click('#submit-btn');
        
        // Verificar que não foi adicionado
        await expect(page.locator('#total-books')).toHaveText('6');

        // Test 3: Ambos vazios
        await page.fill('#book-title', '');
        await page.fill('#book-author', '');
        await page.click('#submit-btn');
        
        // Verificar que não foi adicionado
        await expect(page.locator('#total-books')).toHaveText('6');
    });

    test('CT005 - Editar livro existente', async ({ page }) => {
        // Arrange - Garantir que há um livro para editar
        const firstBook = page.locator('.book-item').first();
        await expect(firstBook).toBeVisible();

        // Act - Clicar em editar
        await firstBook.locator('.btn-edit').click();
        await page.waitForTimeout(300);

        // Verificar que entrou no modo de edição
        await expect(page.locator('#form-title')).toHaveText('Editar Livro');
        await expect(page.locator('#submit-btn')).toContainText('Salvar');
        await expect(page.locator('#cancel-btn')).toBeVisible();

        // Modificar dados
        await page.fill('#book-title', 'Livro Editado');
        await page.fill('#book-author', 'Autor Editado');
        await page.click('#submit-btn');
        await page.waitForTimeout(500);

        // Assert
        // Verificar que formulário voltou ao normal
        await expect(page.locator('#form-title')).toHaveText('Adicionar Novo Livro');
        await expect(page.locator('#submit-btn')).toContainText('Adicionar');
        await expect(page.locator('#cancel-btn')).not.toBeVisible();

        // Verificar que livro foi atualizado na lista
        const updatedBook = page.locator('.book-item:has-text("Livro Editado")');
        await expect(updatedBook).toBeVisible();
        await expect(updatedBook.locator('.book-author')).toContainText('Autor Editado');
    });

    test('CT006 - Cancelar edição de livro', async ({ page }) => {
        // Arrange
        const firstBook = page.locator('.book-item').first();
        const originalTitle = await firstBook.locator('.book-title').textContent();

        // Act - Entrar no modo de edição
        await firstBook.locator('.btn-edit').click();
        await page.waitForTimeout(300);

        // Modificar dados mas cancelar
        await page.fill('#book-title', 'Título Temporário');
        await page.fill('#book-author', 'Autor Temporário');
        await page.click('#cancel-btn');
        await page.waitForTimeout(300);

        // Assert
        // Verificar que formulário voltou ao normal
        await expect(page.locator('#form-title')).toHaveText('Adicionar Novo Livro');
        await expect(page.locator('#cancel-btn')).not.toBeVisible();

        // Verificar que livro não foi alterado
        await expect(firstBook.locator('.book-title')).toHaveText(originalTitle);
        
        // Verificar que campos foram limpos
        await expect(page.locator('#book-title')).toHaveValue('');
        await expect(page.locator('#book-author')).toHaveValue('');
    });

    test('CT007 - Excluir livro com confirmação', async ({ page }) => {
        // Arrange
        const totalBooksInicial = await page.locator('#total-books').textContent();
        const firstBook = page.locator('.book-item').first();
        const bookTitle = await firstBook.locator('.book-title').textContent();

        // Act - Clicar em remover
        await firstBook.locator('.btn-delete').click();
        await page.waitForTimeout(300);

        // Verificar que modal apareceu
        const modal = page.locator('#modal');
        await expect(modal).toHaveClass(/show/);
        await expect(page.locator('#modal-message')).toContainText(bookTitle);

        // Confirmar exclusão
        await page.click('#modal-confirm');
        await page.waitForTimeout(500);

        // Assert
        // Verificar que modal fechou
        await expect(modal).not.toHaveClass(/show/);

        // Verificar que livro foi removido
        const remainingBooks = page.locator(`.book-item:has-text("${bookTitle}")`);
        await expect(remainingBooks).toHaveCount(0);

        // Verificar que estatísticas foram atualizadas
        const totalBooksAtual = await page.locator('#total-books').textContent();
        expect(parseInt(totalBooksAtual)).toBe(parseInt(totalBooksInicial) - 1);
    });

    test('CT008 - Cancelar exclusão de livro', async ({ page }) => {
        // Arrange
        const totalBooksInicial = await page.locator('#total-books').textContent();
        const firstBook = page.locator('.book-item').first();
        const bookTitle = await firstBook.locator('.book-title').textContent();

        // Act - Clicar em remover e cancelar
        await firstBook.locator('.btn-delete').click();
        await page.waitForTimeout(300);

        const modal = page.locator('#modal');
        await expect(modal).toHaveClass(/show/);

        await page.click('#modal-cancel');
        await page.waitForTimeout(300);

        // Assert
        // Verificar que modal fechou
        await expect(modal).not.toHaveClass(/show/);

        // Verificar que livro não foi removido
        const bookStillExists = page.locator(`.book-item:has-text("${bookTitle}")`);
        await expect(bookStillExists).toHaveCount(1);

        // Verificar que estatísticas não mudaram
        await expect(page.locator('#total-books')).toHaveText(totalBooksInicial);
    });

    test('CT009 - Marcar livro como lido', async ({ page }) => {
        // Arrange
        const firstBook = page.locator('.book-item').first();
        const booksReadInicial = await page.locator('#books-read').textContent();
        const booksToReadInicial = await page.locator('#books-to-read').textContent();

        // Verificar que livro inicialmente não está lido
        await expect(firstBook).not.toHaveClass(/read/);

        // Act - Marcar como lido
        await firstBook.locator('.btn-read').click();
        await page.waitForTimeout(500);

        // Assert
        // Verificar aparência visual mudou
        await expect(firstBook).toHaveClass(/read/);

        // Verificar que botão mudou
        const button = firstBook.locator('.btn-unread');
        await expect(button).toBeVisible();
        await expect(button).toContainText('Não Lido');

        // Verificar estatísticas atualizadas
        const booksReadAtual = parseInt(await page.locator('#books-read').textContent());
        const booksToReadAtual = parseInt(await page.locator('#books-to-read').textContent());
        
        expect(booksReadAtual).toBe(parseInt(booksReadInicial) + 1);
        expect(booksToReadAtual).toBe(parseInt(booksToReadInicial) - 1);
    });

    test('CT010 - Desmarcar livro como lido', async ({ page }) => {
        // Arrange - Primeiro marcar um livro como lido
        const firstBook = page.locator('.book-item').first();
        await firstBook.locator('.btn-read').click();
        await page.waitForTimeout(500);

        const booksReadInicial = await page.locator('#books-read').textContent();
        const booksToReadInicial = await page.locator('#books-to-read').textContent();

        // Act - Desmarcar como lido
        await firstBook.locator('.btn-unread').click();
        await page.waitForTimeout(500);

        // Assert
        // Verificar aparência visual voltou ao normal
        await expect(firstBook).not.toHaveClass(/read/);

        // Verificar que botão voltou ao original
        const button = firstBook.locator('.btn-read');
        await expect(button).toBeVisible();
        await expect(button).toContainText('Marcar Lido');

        // Verificar estatísticas atualizadas
        const booksReadAtual = parseInt(await page.locator('#books-read').textContent());
        const booksToReadAtual = parseInt(await page.locator('#books-to-read').textContent());
        
        expect(booksReadAtual).toBe(parseInt(booksReadInicial) - 1);
        expect(booksToReadAtual).toBe(parseInt(booksToReadInicial) + 1);
    });

    test('CT022 - Limpeza completa de dados', async ({ page }) => {
        // Arrange - Verificar que existem livros
        const totalInicial = parseInt(await page.locator('#total-books').textContent());
        expect(totalInicial).toBeGreaterThan(0);

        // Act - Clicar em limpar tudo
        await page.click('#clear-all');
        await page.waitForTimeout(300);

        // Verificar modal de confirmação
        const modal = page.locator('#modal');
        await expect(modal).toHaveClass(/show/);
        await expect(page.locator('#modal-message')).toContainText('TODOS os livros');

        // Confirmar limpeza
        await page.click('#modal-confirm');
        await page.waitForTimeout(500);

        // Assert
        // Verificar que modal fechou
        await expect(modal).not.toHaveClass(/show/);

        // Verificar que todas as estatísticas foram zeradas
        await expect(page.locator('#total-books')).toHaveText('0');
        await expect(page.locator('#books-read')).toHaveText('0');
        await expect(page.locator('#books-to-read')).toHaveText('0');

        // Verificar que lista está vazia
        const emptyState = page.locator('#empty-state');
        await expect(emptyState).toBeVisible();

        // Verificar que não há livros na lista
        const bookItems = page.locator('.book-item');
        await expect(bookItems).toHaveCount(0);
    });

    test('Persistência após reload da página', async ({ page }) => {
        // Arrange - Adicionar um livro
        await page.fill('#book-title', 'Livro de Teste');
        await page.fill('#book-author', 'Autor de Teste');
        await page.click('#submit-btn');
        await page.waitForTimeout(500);

        // Marcar como lido
        const testBook = page.locator('.book-item:has-text("Livro de Teste")');
        await testBook.locator('.btn-read').click();
        await page.waitForTimeout(500);

        // Act - Recarregar página
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Assert
        // Verificar que livro ainda existe
        const persistedBook = page.locator('.book-item:has-text("Livro de Teste")');
        await expect(persistedBook).toBeVisible();

        // Verificar que status foi mantido
        await expect(persistedBook).toHaveClass(/read/);

        // Verificar estatísticas corretas
        await expect(page.locator('#books-read')).toHaveText('1');
    });
});
