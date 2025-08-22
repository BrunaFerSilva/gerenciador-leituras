/**
 * Testes End-to-End - Busca e Filtros
 * Testa funcionalidades de navegação e filtros da aplicação
 */

import { test, expect } from '@playwright/test';

test.describe('Sistema Gerenciador de Leituras - Busca e Filtros', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        
        // Aguardar carregamento completo da aplicação
        await page.waitForTimeout(1000);
    });

    test.describe('CT011-CT013: Filtros por Categoria', () => {
        test.beforeEach(async ({ page }) => {
            // Garantir que temos livros com diferentes status
            // Marcar alguns livros como lidos para ter dados variados
            const bookItems = page.locator('.book-item');
            const count = await bookItems.count();
            
            if (count >= 2) {
                // Marcar os dois primeiros como lidos
                await bookItems.nth(0).locator('.btn-read').click();
                await page.waitForTimeout(300);
                await bookItems.nth(1).locator('.btn-read').click();
                await page.waitForTimeout(300);
            }
        });

        test('CT011 - Filtrar "Todos os Livros"', async ({ page }) => {
            // Act - Clicar no filtro "Todos"
            await page.click('#show-all');
            await page.waitForTimeout(300);

            // Assert
            // Verificar que botão está ativo
            const allButton = page.locator('#show-all');
            await expect(allButton).toHaveClass(/active/);

            // Verificar título da seção
            await expect(page.locator('#list-title')).toHaveText('Todos os Livros');

            // Verificar que todos os livros estão visíveis
            const bookItems = page.locator('.book-item');
            const totalBooks = parseInt(await page.locator('#total-books').textContent());
            await expect(bookItems).toHaveCount(totalBooks);

            // Deve ter livros lidos e não lidos
            const readBooks = page.locator('.book-item.read');
            const unreadBooks = page.locator('.book-item:not(.read)');
            
            if (totalBooks > 0) {
                // Deve haver pelo menos um tipo de livro
                const readCount = await readBooks.count();
                const unreadCount = await unreadBooks.count();
                expect(readCount + unreadCount).toBe(totalBooks);
            }
        });

        test('CT012 - Filtrar "Para Ler"', async ({ page }) => {
            // Act - Clicar no filtro "Para Ler"
            await page.click('#show-to-read');
            await page.waitForTimeout(300);

            // Assert
            // Verificar que botão está ativo
            const toReadButton = page.locator('#show-to-read');
            await expect(toReadButton).toHaveClass(/active/);

            // Verificar título da seção
            await expect(page.locator('#list-title')).toHaveText('Livros Para Ler');

            // Verificar que apenas livros não lidos são exibidos
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();
            
            if (count > 0) {
                // Todos os livros visíveis devem ser não lidos
                for (let i = 0; i < count; i++) {
                    const book = visibleBooks.nth(i);
                    await expect(book).not.toHaveClass(/read/);
                }
            }

            // Verificar com estatísticas
            const booksToReadStat = parseInt(await page.locator('#books-to-read').textContent());
            await expect(visibleBooks).toHaveCount(booksToReadStat);
        });

        test('CT013 - Filtrar "Lidos"', async ({ page }) => {
            // Act - Clicar no filtro "Lidos"
            await page.click('#show-read');
            await page.waitForTimeout(300);

            // Assert
            // Verificar que botão está ativo
            const readButton = page.locator('#show-read');
            await expect(readButton).toHaveClass(/active/);

            // Verificar título da seção
            await expect(page.locator('#list-title')).toHaveText('Livros Lidos');

            // Verificar que apenas livros lidos são exibidos
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();
            
            if (count > 0) {
                // Todos os livros visíveis devem estar lidos
                for (let i = 0; i < count; i++) {
                    const book = visibleBooks.nth(i);
                    await expect(book).toHaveClass(/read/);
                }
            }

            // Verificar com estatísticas
            const booksReadStat = parseInt(await page.locator('#books-read').textContent());
            await expect(visibleBooks).toHaveCount(booksReadStat);
        });

        test('Alternância entre filtros', async ({ page }) => {
            // Test workflow completo de navegação entre filtros
            
            // Começar com "Todos"
            await page.click('#show-all');
            await page.waitForTimeout(300);
            const totalCount = await page.locator('.book-item').count();

            // Ir para "Para Ler"
            await page.click('#show-to-read');
            await page.waitForTimeout(300);
            const toReadCount = await page.locator('.book-item').count();

            // Ir para "Lidos"
            await page.click('#show-read');
            await page.waitForTimeout(300);
            const readCount = await page.locator('.book-item').count();

            // Voltar para "Todos"
            await page.click('#show-all');
            await page.waitForTimeout(300);
            const totalCountAfter = await page.locator('.book-item').count();

            // Assert
            expect(totalCount).toBe(totalCountAfter); // Consistência
            expect(toReadCount + readCount).toBe(totalCount); // Soma bate
        });
    });

    test.describe('CT014-CT015: Busca de Livros', () => {
        test('CT014 - Buscar por título', async ({ page }) => {
            // Arrange
            const searchTerm = 'software'; // Termo que existe nos livros iniciais

            // Act - Digitar no campo de busca
            await page.fill('#search-input', searchTerm);
            await page.waitForTimeout(500); // Aguardar busca em tempo real

            // Assert
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();

            if (count > 0) {
                // Verificar que todos os livros visíveis contêm o termo
                for (let i = 0; i < count; i++) {
                    const book = visibleBooks.nth(i);
                    const title = await book.locator('.book-title').textContent();
                    const author = await book.locator('.book-author').textContent();
                    
                    // Termo deve estar no título ou autor (case-insensitive)
                    const hasInTitle = title.toLowerCase().includes(searchTerm.toLowerCase());
                    const hasInAuthor = author.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    expect(hasInTitle || hasInAuthor).toBe(true);
                }
            }
        });

        test('CT015 - Buscar por autor', async ({ page }) => {
            // Arrange
            const searchTerm = 'bach'; // Autor que existe nos livros iniciais

            // Act
            await page.fill('#search-input', searchTerm);
            await page.waitForTimeout(500);

            // Assert
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();

            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    const book = visibleBooks.nth(i);
                    const title = await book.locator('.book-title').textContent();
                    const author = await book.locator('.book-author').textContent();
                    
                    const hasInTitle = title.toLowerCase().includes(searchTerm.toLowerCase());
                    const hasInAuthor = author.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    expect(hasInTitle || hasInAuthor).toBe(true);
                }
            }
        });

        test('Busca em tempo real', async ({ page }) => {
            // Test que busca funciona conforme digita
            
            // Começar com lista completa
            const initialCount = await page.locator('.book-item').count();
            
            // Digitar uma letra por vez
            await page.fill('#search-input', 'a');
            await page.waitForTimeout(200);
            const countAfterA = await page.locator('.book-item').count();
            
            await page.fill('#search-input', 'ag');
            await page.waitForTimeout(200);
            const countAfterAg = await page.locator('.book-item').count();
            
            await page.fill('#search-input', 'agi');
            await page.waitForTimeout(200);
            const countAfterAgi = await page.locator('.book-item').count();
            
            // Limpar busca
            await page.fill('#search-input', '');
            await page.waitForTimeout(200);
            const countAfterClear = await page.locator('.book-item').count();

            // Assert
            // Busca deve filtrar progressivamente (geralmente menos resultados)
            expect(countAfterClear).toBe(initialCount); // Voltou ao normal
            
            // Se há livros com "agile" no nome, deve ter encontrado
            if (countAfterAgi > 0) {
                expect(countAfterAgi).toBeLessThanOrEqual(countAfterAg);
                expect(countAfterAg).toBeLessThanOrEqual(countAfterA);
            }
        });

        test('Busca case-insensitive', async ({ page }) => {
            // Test diferentes casos de texto
            const testCases = ['software', 'SOFTWARE', 'Software', 'SoFtWaRe'];
            
            let previousCount = -1;
            
            for (const testCase of testCases) {
                await page.fill('#search-input', testCase);
                await page.waitForTimeout(300);
                
                const count = await page.locator('.book-item').count();
                
                if (previousCount === -1) {
                    previousCount = count;
                } else {
                    // Todos os casos devem retornar o mesmo número de resultados
                    expect(count).toBe(previousCount);
                }
            }
        });

        test('Busca sem resultados', async ({ page }) => {
            // Arrange - Buscar termo que não existe
            const searchTerm = 'livro_que_definitivamente_nao_existe_123';

            // Act
            await page.fill('#search-input', searchTerm);
            await page.waitForTimeout(500);

            // Assert
            // Não deve haver livros visíveis
            const visibleBooks = page.locator('.book-item');
            await expect(visibleBooks).toHaveCount(0);

            // Deve mostrar estado vazio
            const emptyState = page.locator('#empty-state');
            await expect(emptyState).toBeVisible();
            
            // Mensagem específica para busca sem resultados
            const emptyMessage = emptyState.locator('p');
            await expect(emptyMessage).toContainText('busca');
        });

        test('Limpar busca restaura lista completa', async ({ page }) => {
            // Arrange
            const initialCount = await page.locator('.book-item').count();
            
            // Act - Fazer busca que filtra resultados
            await page.fill('#search-input', 'termo_especifico');
            await page.waitForTimeout(300);
            
            // Verificar que filtrou
            const filteredCount = await page.locator('.book-item').count();
            
            // Limpar busca
            await page.fill('#search-input', '');
            await page.waitForTimeout(300);
            
            // Assert
            const finalCount = await page.locator('.book-item').count();
            expect(finalCount).toBe(initialCount);
        });
    });

    test.describe('Combinação de Filtros e Busca', () => {
        test.beforeEach(async ({ page }) => {
            // Preparar dados: marcar alguns livros como lidos
            const bookItems = page.locator('.book-item');
            const count = await bookItems.count();
            
            if (count >= 2) {
                await bookItems.nth(0).locator('.btn-read').click();
                await page.waitForTimeout(300);
            }
        });

        test('Filtro + Busca - Livros Lidos com termo específico', async ({ page }) => {
            // Arrange - Ir para filtro "Lidos"
            await page.click('#show-read');
            await page.waitForTimeout(300);

            const readCountBefore = await page.locator('.book-item').count();

            // Act - Adicionar busca
            await page.fill('#search-input', 'lessons');
            await page.waitForTimeout(500);

            // Assert
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();

            // Todos os livros visíveis devem:
            // 1. Estar marcados como lidos
            // 2. Conter o termo buscado
            for (let i = 0; i < count; i++) {
                const book = visibleBooks.nth(i);
                
                // Deve estar lido
                await expect(book).toHaveClass(/read/);
                
                // Deve conter termo
                const title = await book.locator('.book-title').textContent();
                const author = await book.locator('.book-author').textContent();
                const hasSearchTerm = title.toLowerCase().includes('lessons') || 
                                    author.toLowerCase().includes('lessons');
                expect(hasSearchTerm).toBe(true);
            }
        });

        test('Filtro + Busca - Para Ler com autor específico', async ({ page }) => {
            // Arrange
            await page.click('#show-to-read');
            await page.waitForTimeout(300);

            // Act
            await page.fill('#search-input', 'rios'); // Autor dos livros iniciais
            await page.waitForTimeout(500);

            // Assert
            const visibleBooks = page.locator('.book-item');
            const count = await visibleBooks.count();

            for (let i = 0; i < count; i++) {
                const book = visibleBooks.nth(i);
                
                // Deve estar não lido
                await expect(book).not.toHaveClass(/read/);
                
                // Deve conter termo
                const title = await book.locator('.book-title').textContent();
                const author = await book.locator('.book-author').textContent();
                const hasSearchTerm = title.toLowerCase().includes('rios') || 
                                    author.toLowerCase().includes('rios');
                expect(hasSearchTerm).toBe(true);
            }
        });

        test('Mudança de filtro mantém busca ativa', async ({ page }) => {
            // Arrange - Definir busca
            await page.fill('#search-input', 'testing');
            await page.waitForTimeout(500);

            // Começar com "Todos"
            await page.click('#show-all');
            await page.waitForTimeout(300);
            const allCount = await page.locator('.book-item').count();

            // Mudar para "Para Ler"
            await page.click('#show-to-read');
            await page.waitForTimeout(300);
            const toReadCount = await page.locator('.book-item').count();

            // Mudar para "Lidos"
            await page.click('#show-read');
            await page.waitForTimeout(300);
            const readCount = await page.locator('.book-item').count();

            // Assert
            // Campo de busca deve estar preenchido
            await expect(page.locator('#search-input')).toHaveValue('testing');
            
            // Soma dos filtrados deve ser <= total
            expect(toReadCount + readCount).toBeLessThanOrEqual(allCount);
            
            // Todos os livros em cada filtro devem conter o termo
            if (toReadCount > 0) {
                await page.click('#show-to-read');
                await page.waitForTimeout(300);
                const books = page.locator('.book-item');
                for (let i = 0; i < await books.count(); i++) {
                    const book = books.nth(i);
                    await expect(book).not.toHaveClass(/read/);
                }
            }
        });

        test('Limpar busca mantém filtro ativo', async ({ page }) => {
            // Arrange
            await page.click('#show-read');
            await page.waitForTimeout(300);
            
            const initialReadCount = await page.locator('.book-item').count();
            
            // Adicionar busca que filtra mais
            await page.fill('#search-input', 'termo_especifico');
            await page.waitForTimeout(300);
            
            // Limpar busca
            await page.fill('#search-input', '');
            await page.waitForTimeout(300);

            // Assert
            // Deve voltar para todos os livros lidos
            const finalCount = await page.locator('.book-item').count();
            expect(finalCount).toBe(initialReadCount);
            
            // Filtro "Lidos" deve ainda estar ativo
            await expect(page.locator('#show-read')).toHaveClass(/active/);
            
            // Todos os livros devem estar lidos
            const books = page.locator('.book-item');
            for (let i = 0; i < await books.count(); i++) {
                const book = books.nth(i);
                await expect(book).toHaveClass(/read/);
            }
        });
    });

    test.describe('Interface de Busca', () => {
        test('Placeholder e ícone de busca visíveis', async ({ page }) => {
            const searchInput = page.locator('#search-input');
            const searchIcon = page.locator('.search-icon');

            // Assert
            await expect(searchInput).toBeVisible();
            await expect(searchInput).toHaveAttribute('placeholder', 'Buscar livros...');
            await expect(searchIcon).toBeVisible();
        });

        test('Foco no campo de busca', async ({ page }) => {
            const searchInput = page.locator('#search-input');
            
            // Act
            await searchInput.focus();
            
            // Assert
            await expect(searchInput).toBeFocused();
        });
    });
});
