/**
 * Script de Carga de Dados para Testes de Performance
 * Gera e carrega dados de teste para validar performance com volume alto
 */

const fs = require('fs');
const path = require('path');

class DataLoader {
    constructor() {
        this.testDataDir = path.join(__dirname, '../../test-data');
        this.reportDir = path.join(__dirname, '../../reports/load-tests');
        
        // Garantir que diretórios existem
        [this.testDataDir, this.reportDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        // Templates de dados realistas
        this.bookTemplates = {
            titles: [
                "Clean Code: A Handbook of Agile Software Craftsmanship",
                "The Pragmatic Programmer: Your Journey To Mastery",
                "Design Patterns: Elements of Reusable Object-Oriented Software",
                "Refactoring: Improving the Design of Existing Code",
                "Code Complete: A Practical Handbook of Software Construction",
                "The Mythical Man-Month: Essays on Software Engineering",
                "Structure and Interpretation of Computer Programs",
                "The Art of Computer Programming",
                "Introduction to Algorithms",
                "JavaScript: The Definitive Guide",
                "Effective Java",
                "Python Crash Course",
                "Learning React: Modern Patterns for Developing React Apps",
                "Node.js Design Patterns",
                "Microservices Patterns: With examples in Java",
                "Building Microservices: Designing Fine-Grained Systems",
                "Continuous Delivery: Reliable Software Releases",
                "The DevOps Handbook",
                "Agile Estimating and Planning",
                "Test Driven Development: By Example",
                "The Art of Software Testing",
                "Lessons Learned in Software Testing",
                "Explore It!: Reduce Risk and Increase Confidence",
                "Agile Testing: A Practical Guide",
                "Cucumber for Java: Behavior-Driven Development",
                "Selenium WebDriver 3 Practical Guide",
                "API Testing and Development with Postman",
                "Performance Testing with JMeter 3",
                "Security Testing Handbook",
                "Mobile App Testing: A Complete Guide"
            ],
            authors: [
                "Robert C. Martin",
                "Andrew Hunt",
                "David Thomas", 
                "Erich Gamma",
                "Richard Helm",
                "Ralph Johnson",
                "John Vlissides",
                "Martin Fowler",
                "Steve McConnell",
                "Frederick P. Brooks Jr.",
                "Harold Abelson",
                "Gerald Jay Sussman",
                "Donald E. Knuth",
                "Thomas H. Cormen",
                "Charles E. Leiserson",
                "Ronald L. Rivest",
                "David Flanagan",
                "Joshua Bloch",
                "Eric Matthes",
                "Alex Banks",
                "Eve Porcello",
                "Mario Casciaro",
                "Luciano Mammino",
                "Chris Richardson",
                "Sam Newman",
                "Jez Humble",
                "David Farley",
                "Gene Kim",
                "Patrick Debois",
                "John Willis",
                "Jez Humble",
                "Mike Cohn",
                "Kent Beck",
                "Glenford J. Myers",
                "Cem Kaner",
                "James Bach",
                "Elisabeth Hendrickson",
                "Lisa Crispin",
                "Janet Gregory",
                "Seb Rose",
                "Matt Wynne",
                "Aslak Hellesøy",
                "Yujun Liang",
                "Alex Li",
                "Boni García",
                "Valentin Despa",
                "Antonio Gomes Rodrigues",
                "Bayo Erinle",
                "Daniel Knott",
                "Rahul Rathore"
            ],
            categories: [
                "Programming",
                "Software Engineering", 
                "Testing",
                "DevOps",
                "Agile",
                "Architecture",
                "JavaScript",
                "Java",
                "Python",
                "Mobile Development",
                "Web Development",
                "Database",
                "Security",
                "Performance",
                "Leadership"
            ]
        };
    }

    generateId() {
        return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateRandomBook() {
        const titles = this.bookTemplates.titles;
        const authors = this.bookTemplates.authors;
        
        // Selecionar título e autor aleatórios
        const title = titles[Math.floor(Math.random() * titles.length)];
        const author = authors[Math.floor(Math.random() * authors.length)];
        
        // Adicionar variação para criar mais livros únicos
        const variations = [
            "", 
            ": Second Edition", 
            ": Advanced Guide", 
            " - Complete Reference",
            " Fundamentals",
            " in Practice",
            " Patterns and Best Practices"
        ];
        
        const variation = variations[Math.floor(Math.random() * variations.length)];
        const finalTitle = title + variation;
        
        // Status aleatório (70% não lido, 30% lido)
        const isRead = Math.random() < 0.3;
        
        // Data aleatória nos últimos 2 anos
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 730));
        
        return {
            id: this.generateId(),
            title: finalTitle,
            author: author,
            isRead: isRead,
            dateAdded: randomDate.toISOString()
        };
    }

    generateTestDataset(size) {
        console.log(`📚 Gerando dataset com ${size} livros...`);
        
        const books = [];
        const usedCombinations = new Set();
        
        for (let i = 0; i < size; i++) {
            let book;
            let attempts = 0;
            
            // Tentar gerar livro único (evitar duplicatas)
            do {
                book = this.generateRandomBook();
                const combination = `${book.title}|${book.author}`;
                
                if (!usedCombinations.has(combination)) {
                    usedCombinations.add(combination);
                    break;
                }
                
                attempts++;
                if (attempts > 50) {
                    // Se muitas tentativas, aceitar duplicata para não travar
                    break;
                }
            } while (true);
            
            books.push(book);
            
            // Log de progresso para datasets grandes
            if (size > 1000 && (i + 1) % 100 === 0) {
                console.log(`   Gerados ${i + 1}/${size} livros...`);
            }
        }
        
        console.log(`✅ Dataset gerado com ${books.length} livros únicos`);
        return books;
    }

    saveTestData(books, filename) {
        const filePath = path.join(this.testDataDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
        console.log(`💾 Dados salvos em: ${filePath}`);
        return filePath;
    }

    loadTestData(filename) {
        const filePath = path.join(this.testDataDir, filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Arquivo não encontrado: ${filePath}`);
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`📖 Carregados ${data.length} livros de: ${filePath}`);
        return data;
    }

    async injectDataIntoApp(books, url) {
        console.log(`🔄 Injetando ${books.length} livros na aplicação...`);
        
        // Esta função seria usada com Playwright para injetar dados
        // Simulação do processo aqui
        const script = `
            // Script para ser executado no browser
            localStorage.setItem('readingManagerBooks', JSON.stringify(${JSON.stringify(books)}));
            if (window.bookManager) {
                window.bookManager.loadBooks();
                window.bookManager.updateDisplay();
            }
        `;
        
        return script;
    }

    generatePerformanceReport(testResults) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: testResults.length,
                passed: testResults.filter(r => r.passed).length,
                failed: testResults.filter(r => !r.passed).length
            },
            results: testResults,
            statistics: this.calculateStatistics(testResults)
        };

        const reportPath = path.join(this.reportDir, `load-test-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📊 Relatório de performance salvo: ${reportPath}`);
        return report;
    }

    calculateStatistics(results) {
        if (results.length === 0) return {};
        
        const times = results.map(r => r.duration).filter(d => d !== undefined);
        
        if (times.length === 0) return {};
        
        times.sort((a, b) => a - b);
        
        return {
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            avgTime: times.reduce((a, b) => a + b, 0) / times.length,
            medianTime: times[Math.floor(times.length / 2)],
            p95Time: times[Math.floor(times.length * 0.95)],
            p99Time: times[Math.floor(times.length * 0.99)]
        };
    }
}

// Cenários de teste predefinidos
const loadTestScenarios = [
    {
        name: 'small-dataset',
        description: 'Teste com dataset pequeno (50 livros)',
        size: 50,
        expectedLoadTime: 500 // ms
    },
    {
        name: 'medium-dataset', 
        description: 'Teste com dataset médio (200 livros)',
        size: 200,
        expectedLoadTime: 1000 // ms
    },
    {
        name: 'large-dataset',
        description: 'Teste com dataset grande (500 livros)',
        size: 500,
        expectedLoadTime: 2000 // ms
    },
    {
        name: 'xlarge-dataset',
        description: 'Teste com dataset muito grande (1000 livros)',
        size: 1000,
        expectedLoadTime: 3000 // ms
    },
    {
        name: 'stress-test',
        description: 'Teste de stress (2000 livros)',
        size: 2000,
        expectedLoadTime: 5000 // ms
    }
];

// Função principal para gerar todos os datasets
async function generateAllTestDatasets() {
    const dataLoader = new DataLoader();
    const generatedFiles = [];
    
    console.log('🚀 Iniciando geração de datasets para testes de carga...\n');
    
    for (const scenario of loadTestScenarios) {
        try {
            console.log(`\n📋 Cenário: ${scenario.description}`);
            
            const startTime = Date.now();
            const books = dataLoader.generateTestDataset(scenario.size);
            const generationTime = Date.now() - startTime;
            
            const filename = `${scenario.name}-${scenario.size}books.json`;
            const filePath = dataLoader.saveTestData(books, filename);
            
            generatedFiles.push({
                scenario: scenario.name,
                filePath,
                size: scenario.size,
                generationTime,
                description: scenario.description
            });
            
            console.log(`⏱️  Tempo de geração: ${generationTime}ms`);
            
        } catch (error) {
            console.error(`❌ Erro ao gerar ${scenario.name}:`, error.message);
        }
    }
    
    // Salvar índice dos arquivos gerados
    const indexPath = path.join(dataLoader.testDataDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(generatedFiles, null, 2));
    
    console.log(`\n✅ Geração completa! ${generatedFiles.length} datasets criados.`);
    console.log(`📄 Índice salvo em: ${indexPath}`);
    
    return generatedFiles;
}

// Função para limpar dados de teste antigos
function cleanupTestData() {
    const dataLoader = new DataLoader();
    
    if (fs.existsSync(dataLoader.testDataDir)) {
        const files = fs.readdirSync(dataLoader.testDataDir);
        files.forEach(file => {
            const filePath = path.join(dataLoader.testDataDir, file);
            fs.unlinkSync(filePath);
        });
        console.log(`🧹 Limpeza completa: ${files.length} arquivos removidos`);
    }
}

// CLI Interface
function showUsage() {
    console.log(`
📚 DataLoader - Gerador de Dados de Teste

Uso:
  node data-loader.js generate          # Gerar todos os datasets
  node data-loader.js generate <size>   # Gerar dataset específico
  node data-loader.js clean             # Limpar dados antigos
  node data-loader.js list              # Listar datasets existentes

Exemplos:
  node data-loader.js generate 100
  node data-loader.js clean
    `);
}

// Executar se chamado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'generate':
            if (args[1] && !isNaN(args[1])) {
                // Gerar dataset de tamanho específico
                const size = parseInt(args[1]);
                const dataLoader = new DataLoader();
                const books = dataLoader.generateTestDataset(size);
                const filename = `custom-${size}books-${Date.now()}.json`;
                dataLoader.saveTestData(books, filename);
            } else {
                // Gerar todos os datasets
                generateAllTestDatasets().catch(console.error);
            }
            break;
            
        case 'clean':
            cleanupTestData();
            break;
            
        case 'list':
            const dataLoader = new DataLoader();
            const indexPath = path.join(dataLoader.testDataDir, 'index.json');
            if (fs.existsSync(indexPath)) {
                const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
                console.log('\n📋 Datasets disponíveis:');
                index.forEach((item, i) => {
                    console.log(`  ${i + 1}. ${item.description} (${item.size} livros)`);
                    console.log(`     Arquivo: ${path.basename(item.filePath)}`);
                });
            } else {
                console.log('❌ Nenhum dataset encontrado. Execute "generate" primeiro.');
            }
            break;
            
        default:
            showUsage();
    }
}

module.exports = { DataLoader, loadTestScenarios };
