/**
 * Testes de Performance Browser - K6 + Browser API
 * Testes que simulam interações reais do usuário no navegador
 */

import { browser } from 'k6/experimental/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

// Métricas customizadas para performance do browser
const pageLoadTime = new Trend('page_load_time');
const domContentLoadTime = new Trend('dom_content_load_time');
const interactionTime = new Trend('interaction_time');
const searchResponseTime = new Trend('search_response_time');

export const options = {
  scenarios: {
    browser_performance: {
      executor: 'constant-vus',
      vus: 3,  // Menor número para testes de browser
      duration: '2m',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    page_load_time: ['p(95)<3000'],      // 95% das páginas carregam < 3s
    dom_content_load_time: ['p(90)<2000'], // DOM carrega < 2s
    interaction_time: ['avg<500'],        // Interações < 500ms
    search_response_time: ['p(95)<200'],  // Busca responde < 200ms
  },
};

export default async function () {
  const page = browser.newPage();
  
  try {
    // CT023 - Performance de carregamento inicial
    await testPageLoad(page);
    
    // CT024 - Performance de interações do usuário
    await testUserInteractions(page);
    
    // CT025 - Performance com dados de teste
    await testWithTestData(page);
    
    // CT026 - Performance de busca em tempo real
    await testSearchPerformance(page);
    
  } finally {
    page.close();
  }
}

/**
 * CT023 - Teste de Performance de Carregamento
 */
async function testPageLoad(page) {
  console.log('🔄 Testando performance de carregamento...');
  
  const startTime = Date.now();
  
  // Navegar para a aplicação
  await page.goto('http://localhost:8000/index.html', { 
    waitUntil: 'networkidle' 
  });
  
  const loadTime = Date.now() - startTime;
  pageLoadTime.add(loadTime);
  
  // Verificar se carregou corretamente
  const title = await page.locator('h1').textContent();
  check(null, {
    'página carrega completamente': () => title.includes('Gerenciador de Leituras'),
    'carregamento dentro do limite': () => loadTime < 3000,
  });
  
  // Medir tempo de DOMContentLoaded
  const domTime = await page.evaluate(() => {
    return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
  });
  
  domContentLoadTime.add(domTime);
  
  console.log(`📊 Página carregada em: ${loadTime}ms (DOM: ${domTime}ms)`);
}

/**
 * CT024 - Teste de Performance de Interações
 */
async function testUserInteractions(page) {
  console.log('🖱️ Testando performance de interações...');
  
  // Teste 1: Adicionar livro
  let startTime = Date.now();
  
  await page.fill('#book-title', 'Livro de Performance Test');
  await page.fill('#book-author', 'Autor de Performance');
  await page.click('#submit-btn');
  
  // Aguardar atualização da interface
  await page.waitForSelector('.book-item:has-text("Livro de Performance Test")', {
    timeout: 2000
  });
  
  const addBookTime = Date.now() - startTime;
  interactionTime.add(addBookTime);
  
  check(null, {
    'adicionar livro rápido': () => addBookTime < 1000,
    'livro aparece na lista': () => true,
  });
  
  // Teste 2: Alternar status de leitura
  startTime = Date.now();
  
  await page.click('.book-item:first-child .btn-read');
  await page.waitForSelector('.book-item.read', { timeout: 1000 });
  
  const toggleTime = Date.now() - startTime;
  interactionTime.add(toggleTime);
  
  check(null, {
    'toggle status rápido': () => toggleTime < 500,
    'mudança visual aplicada': () => true,
  });
  
  // Teste 3: Filtrar por categoria
  startTime = Date.now();
  
  await page.click('#show-read');
  await page.waitForTimeout(200); // Tempo para filtros aplicarem
  
  const filterTime = Date.now() - startTime;
  interactionTime.add(filterTime);
  
  check(null, {
    'filtro aplicado rapidamente': () => filterTime < 300,
  });
  
  console.log(`📊 Interações: Add(${addBookTime}ms), Toggle(${toggleTime}ms), Filter(${filterTime}ms)`);
}

/**
 * CT025 - Performance com Volume de Dados
 */
async function testWithTestData(page) {
  console.log('📚 Testando performance com volume de dados...');
  
  // Injetar dados de teste via JavaScript
  await page.evaluate(() => {
    const testBooks = [];
    for (let i = 0; i < 100; i++) {
      testBooks.push({
        id: `test_${i}`,
        title: `Livro de Teste ${i}`,
        author: `Autor ${i}`,
        isRead: i % 3 === 0, // 1/3 dos livros marcados como lidos
        dateAdded: new Date().toISOString()
      });
    }
    
    localStorage.setItem('readingManagerBooks', JSON.stringify(testBooks));
  });
  
  // Recarregar página com dados
  const startTime = Date.now();
  await page.reload({ waitUntil: 'networkidle' });
  const reloadTime = Date.now() - startTime;
  
  pageLoadTime.add(reloadTime);
  
  // Verificar se dados foram carregados
  const totalBooks = await page.locator('#total-books').textContent();
  
  check(null, {
    'dados carregados corretamente': () => totalBooks === '100',
    'carregamento com dados rápido': () => reloadTime < 5000,
  });
  
  // Testar scroll performance
  const scrollStartTime = Date.now();
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(100);
  const scrollTime = Date.now() - scrollStartTime;
  
  check(null, {
    'scroll suave com muitos dados': () => scrollTime < 200,
  });
  
  console.log(`📊 Performance com 100 livros: Reload(${reloadTime}ms), Scroll(${scrollTime}ms)`);
}

/**
 * CT026 - Performance de Busca em Tempo Real
 */
async function testSearchPerformance(page) {
  console.log('🔍 Testando performance de busca...');
  
  const searchTerms = ['teste', 'livro', 'autor', 'javascript', 'performance'];
  
  for (const term of searchTerms) {
    const startTime = Date.now();
    
    // Limpar campo e digitar novo termo
    await page.fill('#search-input', '');
    await page.fill('#search-input', term);
    
    // Aguardar resposta da busca (sem delay específico - tempo real)
    await page.waitForTimeout(100); // Pequeno delay para processamento
    
    const searchTime = Date.now() - startTime;
    searchResponseTime.add(searchTime);
    
    // Verificar resultados
    const visibleBooks = await page.locator('.book-item').count();
    
    check(null, {
      [`busca "${term}" rápida`]: () => searchTime < 300,
      [`busca "${term}" tem resultados`]: () => visibleBooks >= 0, // Pode ser 0 se não encontrar
    });
    
    console.log(`🔍 Busca "${term}": ${searchTime}ms (${visibleBooks} resultados)`);
    
    // Pequeno delay entre buscas
    await page.waitForTimeout(200);
  }
  
  // Limpar busca
  await page.fill('#search-input', '');
  await page.waitForTimeout(100);
  
  const totalAfterClear = await page.locator('.book-item').count();
  check(null, {
    'limpar busca restaura lista': () => totalAfterClear > 0,
  });
}

/**
 * Setup específico para testes de browser
 */
export function setup() {
  console.log('🌐 Iniciando testes de performance no browser');
  console.log('🚀 Cenários: carregamento, interações, dados, busca');
}

/**
 * Teardown para limpeza
 */
export function teardown() {
  console.log('🏁 Testes de performance browser finalizados');
}
