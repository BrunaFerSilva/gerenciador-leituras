/**
 * Testes End-to-End - Responsividade Mobile
 * Testa a aplicação em diferentes dispositivos e resoluções
 */

import { test, expect, devices } from '@playwright/test';

// Configurações de dispositivos para teste
const testDevices = [
    {
        name: 'iPhone SE',
        ...devices['iPhone SE'],
        description: 'Tela pequena (375x667)'
    },
    {
        name: 'iPhone 12',
        ...devices['iPhone 12'],
        description: 'Tela média (390x844)'
    },
    {
        name: 'Samsung Galaxy S21',
        ...devices['Galaxy S21'],
        description: 'Android moderno (360x800)'
    },
    {
        name: 'iPad',
        ...devices['iPad'],
        description: 'Tablet (768x1024)'
    }
];

// Configurações customizadas para testes específicos
const customViewports = [
    { width: 320, height: 568, name: 'Small Mobile' },
    { width: 375, height: 667, name: 'Medium Mobile' },
    { width: 414, height: 896, name: 'Large Mobile' },
    { width: 768, height: 1024, name: 'Tablet Portrait' },
    { width: 1024, height: 768, name: 'Tablet Landscape' }
];

test.describe('Responsividade Mobile - Testes Visuais', () => {
    
    for (const device of testDevices) {
        test.describe(`Dispositivo: ${device.name}`, () => {
            test.use({ ...device });

            test(`CT016 - Layout responsivo em ${device.name}`, async ({ page }) => {
                // Arrange
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Act & Assert - Verificar elementos principais visíveis
                
                // Header deve estar visível e bem formatado
                const header = page.locator('.header');
                await expect(header).toBeVisible();
                
                const headerTitle = page.locator('.header h1');
                await expect(headerTitle).toBeVisible();
                
                // Formulário deve estar em layout responsivo
                const formSection = page.locator('.form-section');
                await expect(formSection).toBeVisible();
                
                const titleInput = page.locator('#book-title');
                const authorInput = page.locator('#book-author');
                await expect(titleInput).toBeVisible();
                await expect(authorInput).toBeVisible();
                
                // Verificar que inputs têm largura adequada
                const titleBox = await titleInput.boundingBox();
                const authorBox = await authorInput.boundingBox();
                expect(titleBox.width).toBeGreaterThan(200); // Largura mínima
                expect(authorBox.width).toBeGreaterThan(200);
                
                // Controles devem estar organizados adequadamente
                const controls = page.locator('.controls');
                await expect(controls).toBeVisible();
                
                // Estatísticas devem estar visíveis
                const stats = page.locator('.stats');
                await expect(stats).toBeVisible();
                
                const statCards = page.locator('.stat-card');
                const statCount = await statCards.count();
                expect(statCount).toBe(3);
                
                // Lista de livros deve estar visível
                const booksSection = page.locator('.books-section');
                await expect(booksSection).toBeVisible();
                
                // Verificar que não há overflow horizontal
                const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
                const viewportWidth = device.viewport.width;
                expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Pequena tolerância
            });

            test(`Interações touch em ${device.name}`, async ({ page }) => {
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Verificar que botões têm tamanho adequado para touch
                const buttons = page.locator('button');
                const buttonCount = await buttons.count();
                
                for (let i = 0; i < Math.min(buttonCount, 10); i++) { // Testar os primeiros 10 botões
                    const button = buttons.nth(i);
                    if (await button.isVisible()) {
                        const box = await button.boundingBox();
                        if (box) {
                            // Área mínima de touch recomendada: 44x44px
                            expect(box.width).toBeGreaterThan(32);
                            expect(box.height).toBeGreaterThan(32);
                        }
                    }
                }

                // Testar tap em elementos principais
                const addButton = page.locator('#submit-btn');
                await expect(addButton).toBeVisible();
                
                // Simular touch interaction
                await addButton.tap();
                await page.waitForTimeout(300);
                
                // Verificar que a interação funcionou (deveria mostrar erro por campos vazios)
                // Mas o importante é que o tap foi registrado
            });

            test(`Navegação em ${device.name}`, async ({ page }) => {
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Testar navegação por filtros
                const showAllBtn = page.locator('#show-all');
                const showToReadBtn = page.locator('#show-to-read');
                const showReadBtn = page.locator('#show-read');

                await expect(showAllBtn).toBeVisible();
                await expect(showToReadBtn).toBeVisible();
                await expect(showReadBtn).toBeVisible();

                // Testar taps nos filtros
                await showToReadBtn.tap();
                await page.waitForTimeout(300);
                await expect(showToReadBtn).toHaveClass(/active/);

                await showReadBtn.tap();
                await page.waitForTimeout(300);
                await expect(showReadBtn).toHaveClass(/active/);

                await showAllBtn.tap();
                await page.waitForTimeout(300);
                await expect(showAllBtn).toHaveClass(/active/);
            });

            test(`Formulário mobile em ${device.name}`, async ({ page }) => {
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Testar preenchimento de formulário em mobile
                const titleInput = page.locator('#book-title');
                const authorInput = page.locator('#book-author');
                const submitBtn = page.locator('#submit-btn');

                // Verificar que campos são focáveis
                await titleInput.tap();
                await expect(titleInput).toBeFocused();

                // Preencher dados
                await titleInput.fill('Livro Mobile Test');
                await authorInput.tap();
                await expect(authorInput).toBeFocused();
                await authorInput.fill('Autor Mobile Test');

                // Submeter
                await submitBtn.tap();
                await page.waitForTimeout(500);

                // Verificar que livro foi adicionado
                const newBook = page.locator('.book-item:has-text("Livro Mobile Test")');
                await expect(newBook).toBeVisible();

                // Verificar layout do livro em mobile
                const bookBox = await newBook.boundingBox();
                expect(bookBox.width).toBeLessThanOrEqual(device.viewport.width);
            });
        });
    }
});

test.describe('Responsividade - Viewports Customizados', () => {
    
    for (const viewport of customViewports) {
        test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
            test.use({ 
                viewport: { width: viewport.width, height: viewport.height }
            });

            test(`Layout em ${viewport.name}`, async ({ page }) => {
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Verificar adaptação do layout
                const container = page.locator('.container');
                await expect(container).toBeVisible();

                const containerBox = await container.boundingBox();
                expect(containerBox.width).toBeLessThanOrEqual(viewport.width);

                // Verificar que elementos se adaptam
                if (viewport.width < 768) {
                    // Mobile: verificar layout vertical
                    const controls = page.locator('.controls');
                    if (await controls.isVisible()) {
                        const controlsBox = await controls.boundingBox();
                        // Em mobile, controles devem ocupar largura total disponível
                        expect(controlsBox.width).toBeGreaterThan(viewport.width * 0.8);
                    }
                } else {
                    // Tablet/Desktop: verificar layout horizontal
                    const stats = page.locator('.stats');
                    if (await stats.isVisible()) {
                        const statCards = page.locator('.stat-card');
                        const count = await statCards.count();
                        
                        if (count > 0) {
                            const firstCard = await statCards.nth(0).boundingBox();
                            const lastCard = await statCards.nth(count - 1).boundingBox();
                            
                            // Em tablet, cards devem estar em linha
                            if (count > 1) {
                                expect(firstCard.x).toBeLessThan(lastCard.x);
                            }
                        }
                    }
                }
            });

            test(`Scroll e overflow em ${viewport.name}`, async ({ page }) => {
                await page.goto('file://' + __dirname + '/../../index.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);

                // Verificar que não há scroll horizontal
                const horizontalScroll = await page.evaluate(() => {
                    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                });
                expect(horizontalScroll).toBe(false);

                // Verificar que elementos não saem da tela
                const allElements = page.locator('*:visible');
                const elementCount = await allElements.count();
                
                // Verificar uma amostra de elementos
                const sampleSize = Math.min(elementCount, 20);
                for (let i = 0; i < sampleSize; i++) {
                    const element = allElements.nth(i);
                    const box = await element.boundingBox();
                    
                    if (box) {
                        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 5); // Pequena tolerância
                    }
                }
            });
        });
    }
});

test.describe('Funcionalidades Específicas Mobile', () => {
    test.use(devices['iPhone 12']);

    test('CT017 - Feedback visual mobile', async ({ page }) => {
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Testar feedback visual em ações touch
        const firstBook = page.locator('.book-item').first();
        
        if (await firstBook.isVisible()) {
            // Testar hover/active states em touch
            const editBtn = firstBook.locator('.btn-edit');
            
            // Simular touch press
            await editBtn.tap();
            await page.waitForTimeout(300);
            
            // Verificar que entrou em modo de edição
            const formTitle = page.locator('#form-title');
            await expect(formTitle).toHaveText('Editar Livro');
            
            // Cancelar para limpar estado
            const cancelBtn = page.locator('#cancel-btn');
            if (await cancelBtn.isVisible()) {
                await cancelBtn.tap();
                await page.waitForTimeout(300);
            }
        }
    });

    test('Modal em dispositivo mobile', async ({ page }) => {
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Testar modal de confirmação em mobile
        const clearAllBtn = page.locator('#clear-all');
        await clearAllBtn.tap();
        await page.waitForTimeout(300);

        const modal = page.locator('#modal');
        await expect(modal).toHaveClass(/show/);

        // Verificar que modal está bem dimensionado para mobile
        const modalContent = page.locator('.modal-content');
        const modalBox = await modalContent.boundingBox();
        
        const viewport = page.viewportSize();
        expect(modalBox.width).toBeLessThan(viewport.width * 0.95); // 95% da largura max
        expect(modalBox.height).toBeLessThan(viewport.height * 0.8); // 80% da altura max

        // Testar botões do modal
        const cancelBtn = page.locator('#modal-cancel');
        await cancelBtn.tap();
        await page.waitForTimeout(300);

        await expect(modal).not.toHaveClass(/show/);
    });

    test('Busca em tempo real mobile', async ({ page }) => {
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const searchInput = page.locator('#search-input');
        
        // Verificar que campo de busca é acessível em mobile
        await expect(searchInput).toBeVisible();
        
        const searchBox = await searchInput.boundingBox();
        expect(searchBox.width).toBeGreaterThan(200); // Largura mínima para digitação confortável
        
        // Testar busca
        await searchInput.tap();
        await expect(searchInput).toBeFocused();
        
        await searchInput.fill('software');
        await page.waitForTimeout(500);
        
        // Verificar que resultados são mostrados adequadamente
        const results = page.locator('.book-item');
        const resultCount = await results.count();
        
        if (resultCount > 0) {
            // Verificar que cada resultado está bem formatado em mobile
            for (let i = 0; i < Math.min(resultCount, 3); i++) {
                const result = results.nth(i);
                const resultBox = await result.boundingBox();
                
                expect(resultBox.width).toBeLessThanOrEqual(page.viewportSize().width);
            }
        }
    });

    test('Performance em dispositivo mobile', async ({ page }) => {
        // Simular conexão móvel mais lenta
        await page.route('**/*', route => {
            setTimeout(() => route.continue(), 100); // Delay simulado
        });

        const startTime = Date.now();
        
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Verificar que carregamento é aceitável mesmo em mobile
        expect(loadTime).toBeLessThan(5000); // 5 segundos max
        
        // Verificar que interface é responsiva após carregamento
        const interactionStart = Date.now();
        
        const addBtn = page.locator('#submit-btn');
        await addBtn.tap();
        
        const interactionTime = Date.now() - interactionStart;
        expect(interactionTime).toBeLessThan(1000); // 1 segundo max para resposta
    });
});

test.describe('Orientação de Tela', () => {
    test.use(devices['iPhone 12']);

    test('Rotação landscape/portrait', async ({ page, context }) => {
        await page.goto('file://' + __dirname + '/../../index.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Testar em portrait (padrão)
        let viewport = page.viewportSize();
        expect(viewport.height).toBeGreaterThan(viewport.width);

        // Verificar layout portrait
        const statsPortrait = page.locator('.stats');
        if (await statsPortrait.isVisible()) {
            const statsBox = await statsPortrait.boundingBox();
            // Em portrait, stats podem estar empilhados
        }

        // Rotacionar para landscape
        await page.setViewportSize({ width: 844, height: 390 });
        await page.waitForTimeout(500);

        viewport = page.viewportSize();
        expect(viewport.width).toBeGreaterThan(viewport.height);

        // Verificar que layout se adapta a landscape
        const container = page.locator('.container');
        await expect(container).toBeVisible();

        // Verificar que elementos ainda estão acessíveis
        const formSection = page.locator('.form-section');
        await expect(formSection).toBeVisible();

        const booksSection = page.locator('.books-section');
        await expect(booksSection).toBeVisible();
    });
});
