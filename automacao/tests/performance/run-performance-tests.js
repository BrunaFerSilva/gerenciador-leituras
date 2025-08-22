/**
 * Script de Execução de Testes de Performance K6
 * Utilitário para executar diferentes cenários de teste com K6
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class K6TestRunner {
    constructor() {
        this.reportsDir = path.join(__dirname, '../../reports/performance');
        this.ensureReportsDir();
    }

    ensureReportsDir() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    /**
     * Executa testes de carga básicos
     */
    runLoadTests() {
        console.log('🚀 Executando testes de carga com K6...\n');
        
        try {
            const command = `k6 run --out json=${this.reportsDir}/load-test-results.json tests/performance/load-test.js`;
            console.log(`Comando: ${command}\n`);
            
            const output = execSync(command, { 
                encoding: 'utf-8',
                cwd: path.join(__dirname, '../..'),
                stdio: 'inherit'
            });
            
            console.log('\n✅ Testes de carga concluídos com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao executar testes de carga:', error.message);
            throw error;
        }
    }

    /**
     * Executa testes de performance no browser
     */
    runBrowserTests() {
        console.log('🌐 Executando testes de performance no browser...\n');
        
        try {
            const command = `k6 run --out json=${this.reportsDir}/browser-test-results.json tests/performance/browser-performance.js`;
            console.log(`Comando: ${command}\n`);
            
            const output = execSync(command, {
                encoding: 'utf-8', 
                cwd: path.join(__dirname, '../..'),
                stdio: 'inherit'
            });
            
            console.log('\n✅ Testes de browser concluídos com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao executar testes de browser:', error.message);
            throw error;
        }
    }

    /**
     * Executa teste específico com configuração customizada
     */
    runCustomTest(scenario, options = {}) {
        console.log(`⚙️ Executando cenário customizado: ${scenario}\n`);
        
        const defaultOptions = {
            vus: 10,
            duration: '30s',
            iterations: null
        };
        
        const config = { ...defaultOptions, ...options };
        
        let k6Options = [];
        if (config.vus) k6Options.push(`--vus ${config.vus}`);
        if (config.duration) k6Options.push(`--duration ${config.duration}`);
        if (config.iterations) k6Options.push(`--iterations ${config.iterations}`);
        
        const outputFile = `${this.reportsDir}/${scenario}-results.json`;
        k6Options.push(`--out json=${outputFile}`);
        
        try {
            const command = `k6 run ${k6Options.join(' ')} tests/performance/load-test.js`;
            console.log(`Comando: ${command}\n`);
            
            execSync(command, {
                encoding: 'utf-8',
                cwd: path.join(__dirname, '../..'),
                stdio: 'inherit'
            });
            
            console.log(`\n✅ Cenário ${scenario} concluído com sucesso!`);
            
        } catch (error) {
            console.error(`❌ Erro ao executar cenário ${scenario}:`, error.message);
            throw error;
        }
    }

    /**
     * Executa suite completa de testes
     */
    runFullSuite() {
        console.log('🎯 Executando suite completa de testes de performance K6\n');
        console.log('=' .repeat(60));
        
        try {
            // 1. Testes de carga
            console.log('\n📊 FASE 1: Testes de Carga e Stress');
            console.log('-'.repeat(40));
            this.runLoadTests();
            
            // Pequena pausa entre testes
            console.log('\n⏳ Aguardando 10 segundos antes do próximo teste...');
            execSync('sleep 10', { stdio: 'inherit' });
            
            // 2. Testes de browser (se suportado)
            console.log('\n🌐 FASE 2: Testes de Performance no Browser');
            console.log('-'.repeat(40));
            
            try {
                this.runBrowserTests();
            } catch (error) {
                console.log('⚠️ Testes de browser não disponíveis (requer K6 browser module)');
                console.log('💡 Para habilitar: k6 version --experimental-browser');
            }
            
            console.log('\n🎉 Suite completa de testes finalizada!');
            this.generateSummaryReport();
            
        } catch (error) {
            console.error('❌ Erro na execução da suite completa:', error.message);
            process.exit(1);
        }
    }

    /**
     * Gera relatório consolidado
     */
    generateSummaryReport() {
        console.log('\n📋 Gerando relatório consolidado...');
        
        const reportFiles = fs.readdirSync(this.reportsDir)
            .filter(file => file.endsWith('-results.json'));
        
        if (reportFiles.length === 0) {
            console.log('⚠️ Nenhum arquivo de resultado encontrado');
            return;
        }
        
        const summary = {
            timestamp: new Date().toISOString(),
            totalTests: reportFiles.length,
            tests: []
        };
        
        reportFiles.forEach(file => {
            try {
                const filePath = path.join(this.reportsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                
                summary.tests.push({
                    testName: file.replace('-results.json', ''),
                    file: file,
                    metrics: this.extractKeyMetrics(data)
                });
                
            } catch (error) {
                console.log(`⚠️ Erro ao processar ${file}:`, error.message);
            }
        });
        
        // Salvar resumo
        const summaryPath = path.join(this.reportsDir, 'performance-summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        
        console.log(`📄 Relatório consolidado salvo: ${summaryPath}`);
        this.printSummary(summary);
    }

    /**
     * Extrai métricas principais dos resultados K6
     */
    extractKeyMetrics(data) {
        const metrics = data.metrics || {};
        
        return {
            httpReqDuration: metrics.http_req_duration?.avg || null,
            httpReqFailed: (metrics.http_req_failed?.rate || 0) * 100,
            vus: metrics.vus?.value || null,
            iterations: metrics.iterations?.count || null,
            dataReceived: metrics.data_received?.count || null,
            dataSent: metrics.data_sent?.count || null
        };
    }

    /**
     * Imprime resumo dos resultados
     */
    printSummary(summary) {
        console.log('\n📊 RESUMO DOS TESTES DE PERFORMANCE');
        console.log('='.repeat(50));
        
        summary.tests.forEach(test => {
            console.log(`\n🧪 ${test.testName.toUpperCase()}`);
            console.log(`   Duração média de requisição: ${test.metrics.httpReqDuration?.toFixed(2) || 'N/A'}ms`);
            console.log(`   Taxa de falhas: ${test.metrics.httpReqFailed?.toFixed(2) || 0}%`);
            console.log(`   Iterações executadas: ${test.metrics.iterations || 'N/A'}`);
        });
        
        console.log(`\n📅 Executado em: ${new Date(summary.timestamp).toLocaleString()}`);
        console.log(`📁 Relatórios salvos em: ${this.reportsDir}`);
    }

    /**
     * Verifica se K6 está instalado
     */
    checkK6Installation() {
        try {
            const version = execSync('k6 version', { encoding: 'utf-8' });
            console.log(`✅ K6 encontrado: ${version.trim()}`);
            return true;
        } catch (error) {
            console.error('❌ K6 não está instalado ou não está no PATH');
            console.log('\n💡 Para instalar K6:');
            console.log('   - Windows: winget install k6');
            console.log('   - macOS: brew install k6');
            console.log('   - Linux: sudo snap install k6');
            console.log('   - Ou baixe de: https://k6.io/docs/getting-started/installation/');
            return false;
        }
    }

    /**
     * Verifica se aplicação está rodando
     */
    checkApplication() {
        try {
            const http = require('http');
            
            return new Promise((resolve) => {
                const req = http.get('http://localhost:8000', (res) => {
                    console.log('✅ Aplicação acessível em http://localhost:8000');
                    resolve(true);
                });
                
                req.on('error', () => {
                    console.log('⚠️ Aplicação não está rodando em http://localhost:8000');
                    console.log('💡 Para iniciar: python -m http.server 8000');
                    resolve(false);
                });
                
                req.setTimeout(2000, () => {
                    req.destroy();
                    resolve(false);
                });
            });
        } catch (error) {
            return Promise.resolve(false);
        }
    }
}

// Cenários pré-definidos
const SCENARIOS = {
    smoke: { vus: 1, duration: '10s' },
    load: { vus: 10, duration: '60s' },
    stress: { vus: 50, duration: '120s' },
    spike: { vus: 100, duration: '30s' },
    volume: { vus: 20, duration: '300s' }
};

// CLI Interface
async function main() {
    const runner = new K6TestRunner();
    
    // Verificar pré-requisitos
    if (!runner.checkK6Installation()) {
        process.exit(1);
    }
    
    const appRunning = await runner.checkApplication();
    if (!appRunning) {
        console.log('\n❌ Aplicação deve estar rodando antes dos testes');
        process.exit(1);
    }
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    console.log('\n🎯 K6 Performance Test Runner');
    console.log('='.repeat(40));
    
    try {
        switch (command) {
            case 'load':
                runner.runLoadTests();
                break;
                
            case 'browser':
                runner.runBrowserTests();
                break;
                
            case 'scenario':
                const scenarioName = args[1];
                if (!scenarioName || !SCENARIOS[scenarioName]) {
                    console.log('❌ Cenário inválido. Disponíveis:', Object.keys(SCENARIOS).join(', '));
                    process.exit(1);
                }
                runner.runCustomTest(scenarioName, SCENARIOS[scenarioName]);
                break;
                
            case 'full':
            case 'all':
                runner.runFullSuite();
                break;
                
            default:
                console.log('📖 Uso: node run-performance-tests.js <comando>');
                console.log('\nComandos disponíveis:');
                console.log('  load     - Testes de carga básicos');
                console.log('  browser  - Testes de performance no browser');
                console.log('  scenario <nome> - Cenário específico (smoke, load, stress, spike, volume)');
                console.log('  full     - Suite completa de testes');
                console.log('\nExemplos:');
                console.log('  node run-performance-tests.js load');
                console.log('  node run-performance-tests.js scenario stress');
                console.log('  node run-performance-tests.js full');
        }
    } catch (error) {
        console.error('💥 Erro fatal:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Erro não tratado:', error);
        process.exit(1);
    });
}

module.exports = K6TestRunner;
