// Gerenciador de Leituras - Script Principal
class BookManager {
    // Constantes da classe
    static STORAGE_KEY = 'readingManagerBooks';
    static VIEWS = {
        ALL: 'all',
        TO_READ: 'to-read',
        READ: 'read'
    };
    static ALERT_DURATION = 4000;
    static ANIMATION_DURATION = 300;

    constructor() {
        this.books = [];
        this.currentView = BookManager.VIEWS.ALL;
        this.editingBookId = null;
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadBooks();
        this.setupEventListeners();
        this.addInitialBooks();
        this.updateDisplay();
    }

    // Carrega livros salvos (aprendi que localStorage pode falhar!)
    loadBooks() {
        try {
            const savedBooks = localStorage.getItem(BookManager.STORAGE_KEY);
            if (savedBooks) {
                this.books = JSON.parse(savedBooks);
                this.validateBooksData();
                console.log('Livros carregados:', this.books.length); // debug útil
            }
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
            this.books = [];
            // TODO: mostrar mensagem amigável pro usuário quando isso acontecer
        }
    }

    // Valida integridade dos dados carregados
    validateBooksData() {
        this.books = this.books.filter(book => 
            book && 
            typeof book.title === 'string' && 
            typeof book.author === 'string' &&
            typeof book.id === 'string'
        );
    }

    // Salva livros no localStorage
    saveBooks() {
        try {
            localStorage.setItem(BookManager.STORAGE_KEY, JSON.stringify(this.books));
        } catch (error) {
            console.error('Erro ao salvar livros:', error);
            this.showAlert('Erro ao salvar dados', 'error');
        }
    }

    // Dados dos livros iniciais
    static INITIAL_BOOKS_DATA = [
        { title: "Lessons Learned in Software Testing", author: "Cem Kaner e James Marcus Bach" },
        { title: "The Art of Software Testing", author: "Glenford Myers" },
        { title: "Explore It!: Reduce Risk and Increase Confidence with Exploratory Testing", author: "Elisabeth Hendrickson" },
        { title: "Agile Testing Condensed", author: "Lisa Crispin and Janet Gregory" },
        { title: "Análise De Riscos Em Projetos De Teste De Software", author: "Emerson Rios" },
        { title: "Taking Testing Seriously: The Rapid Software Testing Approach", author: "James Bach e Michael Bolton" }
    ];

    // Adiciona alguns livros iniciais se lista estiver vazia
    // (escolhi livros de QA que realmente recomendo!)
    addInitialBooks() {
        if (this.books.length === 0) {
            this.books = this.createInitialBooks();
            this.saveBooks();
            console.log('Adicionados livros iniciais para demonstração');
        }
    }

    // Cria livros iniciais a partir dos dados
    createInitialBooks() {
        return BookManager.INITIAL_BOOKS_DATA.map(bookData => 
            this.createBookObject(bookData.title, bookData.author)
        );
    }

    // Factory method para criação de objetos livro
    createBookObject(title, author, isRead = false) {
        return {
            id: this.generateId(),
            title: title.trim(),
            author: author.trim(),
            isRead,
            dateAdded: new Date().toISOString()
        };
    }

    // Gera um ID único para os livros
    generateId() {
        return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Configura todos os event listeners
    setupEventListeners() {
        // Formulário de livro
        const bookForm = document.getElementById('book-form');
        bookForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Botões de visualização
        document.getElementById('show-all').addEventListener('click', () => this.setView(BookManager.VIEWS.ALL));
        document.getElementById('show-to-read').addEventListener('click', () => this.setView(BookManager.VIEWS.TO_READ));
        document.getElementById('show-read').addEventListener('click', () => this.setView(BookManager.VIEWS.READ));

        // Botão limpar tudo
        document.getElementById('clear-all').addEventListener('click', () => this.clearAllBooks());

        // Botão cancelar edição
        document.getElementById('cancel-btn').addEventListener('click', () => this.cancelEdit());

        // Campo de busca
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Modal
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.hideModal();
        });

        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.cancelEdit();
            }
        });
    }

    // Manipula o envio do formulário
    handleFormSubmit(e) {
        e.preventDefault();
        
        const titleInput = document.getElementById('book-title');
        const authorInput = document.getElementById('book-author');
        
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();

        if (!title || !author) {
            this.showAlert('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (this.editingBookId) {
            this.updateBook(this.editingBookId, title, author);
        } else {
            this.addBook(title, author);
        }

        // Limpar formulário
        titleInput.value = '';
        authorInput.value = '';
        this.cancelEdit();
    }

    // Adiciona um novo livro
    addBook(title, author) {
        // Validar entrada
        const validationError = this.validateBookInput(title, author);
        if (validationError) {
            this.showAlert(validationError, 'error');
            return;
        }

        // Verificar duplicatas
        if (this.isDuplicateBook(title, author)) {
            this.showAlert('Este livro já está na sua lista!', 'warning');
            return;
        }

        const newBook = this.createBookObject(title, author);
        this.books.push(newBook);
        this.saveBooks();
        this.updateDisplay();
        this.showAlert('Livro adicionado com sucesso!', 'success');
    }

    // Valida entrada de dados
    validateBookInput(title, author) {
        if (!title?.trim()) return 'Título é obrigatório';
        if (!author?.trim()) return 'Autor é obrigatório';
        if (title.trim().length > 200) return 'Título muito longo (máx. 200 caracteres)';
        if (author.trim().length > 100) return 'Nome do autor muito longo (máx. 100 caracteres)';
        return null;
    }

    // Verifica se é livro duplicado
    isDuplicateBook(title, author) {
        return this.books.some(book => 
            book.title.toLowerCase() === title.toLowerCase() && 
            book.author.toLowerCase() === author.toLowerCase()
        );
    }

    // Atualiza um livro existente
    updateBook(bookId, title, author) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            this.books[bookIndex].title = title;
            this.books[bookIndex].author = author;
            this.saveBooks();
            this.updateDisplay();
            this.showAlert('Livro atualizado com sucesso!', 'success');
        }
    }

    // Marca/desmarca livro como lido
    toggleReadStatus(bookId) {
        const book = this.books.find(book => book.id === bookId);
        if (book) {
            book.isRead = !book.isRead;
            this.saveBooks();
            this.updateDisplay();
            
            const status = book.isRead ? 'lido' : 'não lido';
            this.showAlert(`Livro marcado como ${status}!`, 'success');
        }
    }

    // Inicia a edição de um livro
    editBook(bookId) {
        const book = this.books.find(book => book.id === bookId);
        if (book) {
            this.editingBookId = bookId;
            
            // Preencher formulário
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-author').value = book.author;
            
            // Atualizar interface
            document.getElementById('form-title').textContent = 'Editar Livro';
            document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
            document.getElementById('cancel-btn').style.display = 'inline-flex';
            
            // Scroll para o formulário
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Cancela a edição
    cancelEdit() {
        this.editingBookId = null;
        
        // Limpar formulário
        document.getElementById('book-title').value = '';
        document.getElementById('book-author').value = '';
        
        // Restaurar interface
        document.getElementById('form-title').textContent = 'Adicionar Novo Livro';
        document.getElementById('submit-btn').innerHTML = '<i class="fas fa-plus"></i> Adicionar Livro';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    // Remove um livro
    deleteBook(bookId) {
        const book = this.books.find(book => book.id === bookId);
        if (book) {
            this.showModal(
                'Confirmar Exclusão',
                `Tem certeza que deseja remover "${book.title}" da sua lista?`,
                () => {
                    this.books = this.books.filter(book => book.id !== bookId);
                    this.saveBooks();
                    this.updateDisplay();
                    this.showAlert('Livro removido com sucesso!', 'success');
                }
            );
        }
    }

    // Limpa todos os livros
    clearAllBooks() {
        if (this.books.length === 0) {
            this.showAlert('Não há livros para remover.', 'info');
            return;
        }

        this.showModal(
            'Limpar Todos os Livros',
            'Tem certeza que deseja remover TODOS os livros da sua lista? Esta ação não pode ser desfeita.',
            () => {
                this.books = [];
                this.saveBooks();
                this.updateDisplay();
                this.showAlert('Todos os livros foram removidos!', 'success');
            }
        );
    }

    // Define a visualização atual
    setView(view) {
        this.currentView = view;
        
        // Atualizar botões
        document.querySelectorAll('.btn-control').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`show-${view}`).classList.add('active');
        
        // Atualizar título da lista
        const listTitle = document.getElementById('list-title');
        switch(view) {
            case BookManager.VIEWS.ALL:
                listTitle.textContent = 'Todos os Livros';
                break;
            case BookManager.VIEWS.TO_READ:
                listTitle.textContent = 'Livros Para Ler';
                break;
            case BookManager.VIEWS.READ:
                listTitle.textContent = 'Livros Lidos';
                break;
        }
        
        this.updateDisplay();
    }

    // Busca em tempo real - uma das partes que mais me orgulho!
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.updateDisplay();
        
        // DEBUG: pra ver se busca tá funcionando
        if (searchTerm) {
            console.log(`Buscando por: "${searchTerm}"`);
        }
        
        // TODO: adicionar destaque no texto encontrado seria legal
    }

    // Filtra livros baseado na visualização atual e termo de busca
    getFilteredBooks() {
        let filteredBooks = [...this.books];
        
        // Filtrar por visualização
        switch(this.currentView) {
            case BookManager.VIEWS.READ:
                filteredBooks = filteredBooks.filter(book => book.isRead);
                break;
            case BookManager.VIEWS.TO_READ:
                filteredBooks = filteredBooks.filter(book => !book.isRead);
                break;
        }
        
        // Filtrar por busca
        if (this.searchTerm) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(this.searchTerm) ||
                book.author.toLowerCase().includes(this.searchTerm)
            );
        }
        
        return filteredBooks;
    }

    // Atualiza toda a interface
    updateDisplay() {
        this.updateBooksList();
        this.updateStats();
    }

    // Atualiza a lista de livros
    updateBooksList() {
        const booksList = document.getElementById('books-list');
        const emptyState = document.getElementById('empty-state');
        const filteredBooks = this.getFilteredBooks();
        
        if (filteredBooks.length === 0) {
            booksList.innerHTML = '';
            booksList.appendChild(emptyState);
            
            // Atualizar mensagem do estado vazio
            const emptyMessage = emptyState.querySelector('p');
            if (this.searchTerm) {
                emptyMessage.textContent = 'Nenhum livro encontrado para a busca realizada.';
            } else if (this.currentView === 'read') {
                emptyMessage.textContent = 'Você ainda não marcou nenhum livro como lido.';
            } else if (this.currentView === 'to-read') {
                emptyMessage.textContent = 'Você não tem livros marcados para ler.';
            } else {
                emptyMessage.textContent = 'Adicione seu primeiro livro usando o formulário acima.';
            }
            
            return;
        }
        
        // Ordenar livros: não lidos primeiro, depois por data de adição
        filteredBooks.sort((a, b) => {
            if (a.isRead !== b.isRead) {
                return a.isRead - b.isRead;
            }
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        });
        
        booksList.innerHTML = filteredBooks.map(book => this.createBookHTML(book)).join('');
    }

    // Cria o HTML de um livro
    createBookHTML(book) {
        return `
            <div class="book-item ${book.isRead ? 'read' : ''}" data-book-id="${book.id}">
                <div class="book-info">
                    <div class="book-title">${this.escapeHtml(book.title)}</div>
                    <div class="book-author">por ${this.escapeHtml(book.author)}</div>
                </div>
                <div class="book-actions">
                    <button class="btn-action ${book.isRead ? 'btn-unread' : 'btn-read'}" 
                            onclick="bookManager.toggleReadStatus('${book.id}')">
                        <i class="fas ${book.isRead ? 'fa-undo' : 'fa-check'}"></i>
                        ${book.isRead ? 'Não Lido' : 'Marcar Lido'}
                    </button>
                    <button class="btn-action btn-edit" onclick="bookManager.editBook('${book.id}')">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn-action btn-delete" onclick="bookManager.deleteBook('${book.id}')">
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        `;
    }

    // Atualiza as estatísticas
    updateStats() {
        const totalBooks = this.books.length;
        const booksRead = this.books.filter(book => book.isRead).length;
        const booksToRead = totalBooks - booksRead;
        
        document.getElementById('total-books').textContent = totalBooks;
        document.getElementById('books-read').textContent = booksRead;
        document.getElementById('books-to-read').textContent = booksToRead;
    }

    // Mostra modal de confirmação
    showModal(title, message, onConfirm) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const confirmBtn = document.getElementById('modal-confirm');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        // Remover listeners anteriores
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Adicionar novo listener
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            this.hideModal();
        });
        
        modal.classList.add('show');
    }

    // Esconde o modal
    hideModal() {
        document.getElementById('modal').classList.remove('show');
    }

    // Configuração de alertas
    static ALERT_CONFIG = {
        success: { icon: 'fa-check-circle', color: 'linear-gradient(135deg, #68d391, #38b2ac)' },
        error: { icon: 'fa-exclamation-circle', color: 'linear-gradient(135deg, #fc8181, #f56565)' },
        warning: { icon: 'fa-exclamation-triangle', color: 'linear-gradient(135deg, #f6ad55, #ed8936)' },
        info: { icon: 'fa-info-circle', color: 'linear-gradient(135deg, #63b3ed, #4299e1)' }
    };

    // Sistema de alertas - demorei pra fazer ficar bonito assim!
    showAlert(message, type = 'info') {
        this.removeExistingAlert();
        
        const alert = this.createAlertElement(message, type);
        document.body.appendChild(alert);
        
        // Auto-remove depois de 4 segundos (testei vários tempos até chegar neste)
        setTimeout(() => this.removeAlert(alert), BookManager.ALERT_DURATION);
    }

    // Remove alertas existentes
    removeExistingAlert() {
        const existingAlert = document.querySelector('.alert');
        existingAlert?.remove();
    }

    // Cria elemento de alerta
    createAlertElement(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${this.getAlertIcon(type)}"></i>
                <span>${this.escapeHtml(message)}</span>
            </div>
        `;
        
        Object.assign(alert.style, this.getAlertStyles(type));
        return alert;
    }

    // Estilos do alerta
    getAlertStyles(type) {
        return {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getAlertColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: '1001',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '400px',
            backdropFilter: 'blur(10px)'
        };
    }

    // Remove alerta com animação
    removeAlert(alert) {
        alert.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => alert.remove(), BookManager.ANIMATION_DURATION);
    }

    // Retorna o ícone do alerta baseado no tipo
    getAlertIcon(type) {
        return BookManager.ALERT_CONFIG[type]?.icon || BookManager.ALERT_CONFIG.info.icon;
    }

    // Retorna a cor do alerta baseado no tipo
    getAlertColor(type) {
        return BookManager.ALERT_CONFIG[type]?.color || BookManager.ALERT_CONFIG.info.color;
    }

    // Escapa HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar o gerenciador quando a página carregar
let bookManager;
document.addEventListener('DOMContentLoaded', () => {
    bookManager = new BookManager();
});

// Exportar para uso global (para os event handlers inline)
window.bookManager = bookManager;
