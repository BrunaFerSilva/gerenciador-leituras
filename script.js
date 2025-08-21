// Gerenciador de Leituras - Script Principal
class BookManager {
    constructor() {
        this.books = [];
        this.currentView = 'all';
        this.editingBookId = null;
        this.init();
    }

    init() {
        this.loadBooks();
        this.setupEventListeners();
        this.addInitialBooks();
        this.updateDisplay();
    }

    // Carrega livros do localStorage
    loadBooks() {
        const savedBooks = localStorage.getItem('readingManagerBooks');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        }
    }

    // Salva livros no localStorage
    saveBooks() {
        localStorage.setItem('readingManagerBooks', JSON.stringify(this.books));
    }

    // Adiciona livros iniciais se não houver livros salvos
    addInitialBooks() {
        if (this.books.length === 0) {
            const initialBooks = [
                {
                    id: this.generateId(),
                    title: "Lessons Learned in Software Testing",
                    author: "Cem Kaner e James Marcus Bach",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: "The Art of Software Testing",
                    author: "Glenford Myers",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: "Explore It!: Reduce Risk and Increase Confidence with Exploratory Testing",
                    author: "Elisabeth Hendrickson",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: "Agile Testing Condensed",
                    author: "Lisa Crispin and Janet Gregory",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: "Análise De Riscos Em Projetos De Teste De Software",
                    author: "Emerson Rios",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    title: "Taking Testing Seriously: The Rapid Software Testing Approach",
                    author: "James Bach e Michael Bolton",
                    isRead: false,
                    dateAdded: new Date().toISOString()
                }
            ];

            this.books = initialBooks;
            this.saveBooks();
        }
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
        document.getElementById('show-all').addEventListener('click', () => this.setView('all'));
        document.getElementById('show-to-read').addEventListener('click', () => this.setView('to-read'));
        document.getElementById('show-read').addEventListener('click', () => this.setView('read'));

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
        // Verificar se o livro já existe
        const existingBook = this.books.find(book => 
            book.title.toLowerCase() === title.toLowerCase() && 
            book.author.toLowerCase() === author.toLowerCase()
        );

        if (existingBook) {
            this.showAlert('Este livro já está na sua lista!', 'warning');
            return;
        }

        const newBook = {
            id: this.generateId(),
            title,
            author,
            isRead: false,
            dateAdded: new Date().toISOString()
        };

        this.books.push(newBook);
        this.saveBooks();
        this.updateDisplay();
        this.showAlert('Livro adicionado com sucesso!', 'success');
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
            case 'all':
                listTitle.textContent = 'Todos os Livros';
                break;
            case 'to-read':
                listTitle.textContent = 'Livros Para Ler';
                break;
            case 'read':
                listTitle.textContent = 'Livros Lidos';
                break;
        }
        
        this.updateDisplay();
    }

    // Manipula a busca
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.updateDisplay();
    }

    // Filtra livros baseado na visualização atual e termo de busca
    getFilteredBooks() {
        let filteredBooks = [...this.books];
        
        // Filtrar por visualização
        switch(this.currentView) {
            case 'read':
                filteredBooks = filteredBooks.filter(book => book.isRead);
                break;
            case 'to-read':
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

    // Mostra alertas temporários
    showAlert(message, type = 'info') {
        // Remover alertas existentes
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Adicionar estilos do alerta
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getAlertColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        const alertContent = alert.querySelector('.alert-content');
        alertContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(alert);
        
        // Remover após 4 segundos
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }

    // Retorna o ícone do alerta baseado no tipo
    getAlertIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Retorna a cor do alerta baseado no tipo
    getAlertColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #68d391, #38b2ac)',
            error: 'linear-gradient(135deg, #fc8181, #f56565)',
            warning: 'linear-gradient(135deg, #f6ad55, #ed8936)',
            info: 'linear-gradient(135deg, #63b3ed, #4299e1)'
        };
        return colors[type] || colors.info;
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
