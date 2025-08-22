/**
 * Testes Unitários - BookManager
 * Cobertura das funcionalidades principais do sistema
 */

// Mock da classe BookManager (simulando importação)
class BookManager {
    constructor() {
        this.books = [];
        this.currentView = 'all';
        this.editingBookId = null;
        this.searchTerm = '';
    }

    generateId() {
        return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addBook(title, author) {
        // Validar entrada
        const validationError = this.validateBookInput(title, author);
        if (validationError) {
            throw new Error(validationError);
        }

        // Verificar duplicatas
        if (this.isDuplicateBook(title, author)) {
            throw new Error('Este livro já está na sua lista!');
        }

        const newBook = this.createBookObject(title, author);
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
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

    updateBook(bookId, title, author) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            throw new Error('Livro não encontrado');
        }

        if (!title || !author) {
            throw new Error('Por favor, preencha todos os campos.');
        }

        this.books[bookIndex].title = title.trim();
        this.books[bookIndex].author = author.trim();
        this.saveBooks();
        return this.books[bookIndex];
    }

    deleteBook(bookId) {
        const initialLength = this.books.length;
        this.books = this.books.filter(book => book.id !== bookId);
        
        if (this.books.length === initialLength) {
            throw new Error('Livro não encontrado');
        }
        
        this.saveBooks();
        return true;
    }

    toggleReadStatus(bookId) {
        const book = this.books.find(book => book.id === bookId);
        if (!book) {
            throw new Error('Livro não encontrado');
        }

        book.isRead = !book.isRead;
        this.saveBooks();
        return book;
    }

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
            const searchTermLower = this.searchTerm.toLowerCase();
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchTermLower) ||
                book.author.toLowerCase().includes(searchTermLower)
            );
        }
        
        return filteredBooks;
    }

    getStats() {
        const totalBooks = this.books.length;
        const booksRead = this.books.filter(book => book.isRead).length;
        const booksToRead = totalBooks - booksRead;
        
        return { totalBooks, booksRead, booksToRead };
    }

    loadBooks() {
        const savedBooks = localStorage.getItem('readingManagerBooks');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        }
    }

    saveBooks() {
        localStorage.setItem('readingManagerBooks', JSON.stringify(this.books));
    }

    clearAllBooks() {
        this.books = [];
        this.saveBooks();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

describe('BookManager - Testes Unitários', () => {
    let bookManager;

    beforeEach(() => {
        bookManager = new BookManager();
        jest.clearAllMocks();
    });

    describe('CT001-CT004: Gestão de Livros - Cadastro', () => {
        test('CT001: Deve cadastrar livro com dados válidos', () => {
            // Arrange
            const title = 'Clean Code';
            const author = 'Robert Martin';

            // Act
            const newBook = bookManager.addBook(title, author);

            // Assert
            expect(newBook).toBeDefined();
            expect(newBook.title).toBe(title);
            expect(newBook.author).toBe(author);
            expect(newBook.isRead).toBe(false);
            expect(newBook.id).toMatch(/^book_\d+_[a-z0-9]+$/);
            expect(bookManager.books).toHaveLength(1);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'readingManagerBooks', 
                JSON.stringify(bookManager.books)
            );
        });

        test('CT002: Deve prevenir cadastro de livro duplicado', () => {
            // Arrange
            const title = 'Clean Code';
            const author = 'Robert Martin';
            bookManager.addBook(title, author);

            // Act & Assert
            expect(() => {
                bookManager.addBook(title, author);
            }).toThrow('Este livro já está na sua lista!');
            
            expect(bookManager.books).toHaveLength(1);
        });

        test('CT002: Deve ser case-insensitive para duplicatas', () => {
            // Arrange
            bookManager.addBook('Clean Code', 'Robert Martin');

            // Act & Assert
            expect(() => {
                bookManager.addBook('CLEAN CODE', 'robert martin');
            }).toThrow('Este livro já está na sua lista!');
        });

        test('CT003: Deve rejeitar cadastro com título vazio', () => {
            // Act & Assert
            expect(() => {
                bookManager.addBook('', 'Robert Martin');
            }).toThrow('Título é obrigatório');
        });

        test('CT004: Deve rejeitar cadastro com autor vazio', () => {
            // Act & Assert
            expect(() => {
                bookManager.addBook('Clean Code', '');
            }).toThrow('Autor é obrigatório');
        });

        test('Deve validar tamanho máximo dos campos', () => {
            // Arrange
            const tituloLongo = 'a'.repeat(201); // Título muito longo
            const autorLongo = 'b'.repeat(101);  // Autor muito longo

            // Act & Assert
            expect(() => {
                bookManager.addBook(tituloLongo, 'Autor Normal');
            }).toThrow('Título muito longo');

            expect(() => {
                bookManager.addBook('Título Normal', autorLongo);
            }).toThrow('Nome do autor muito longo');
        });

        test('Deve trimmar espaços em branco nos campos', () => {
            // Arrange
            const title = '  Clean Code  ';
            const author = '  Robert Martin  ';

            // Act
            const book = bookManager.addBook(title, author);

            // Assert
            expect(book.title).toBe('Clean Code');
            expect(book.author).toBe('Robert Martin');
        });
    });

    describe('CT005-CT006: Gestão de Livros - Edição', () => {
        let existingBook;

        beforeEach(() => {
            existingBook = bookManager.addBook('Clean Code', 'Robert Martin');
        });

        test('CT005: Deve editar livro existente', () => {
            // Arrange
            const newTitle = 'Clean Code: A Handbook';
            const newAuthor = 'Robert C. Martin';

            // Act
            const updatedBook = bookManager.updateBook(existingBook.id, newTitle, newAuthor);

            // Assert
            expect(updatedBook.title).toBe(newTitle);
            expect(updatedBook.author).toBe(newAuthor);
            expect(updatedBook.id).toBe(existingBook.id); // ID preservado
            expect(updatedBook.isRead).toBe(existingBook.isRead); // Status preservado
        });

        test('Deve rejeitar edição com campos vazios', () => {
            // Act & Assert
            expect(() => {
                bookManager.updateBook(existingBook.id, '', 'Robert Martin');
            }).toThrow('Por favor, preencha todos os campos.');

            expect(() => {
                bookManager.updateBook(existingBook.id, 'Clean Code', '');
            }).toThrow('Por favor, preencha todos os campos.');
        });

        test('Deve rejeitar edição de livro inexistente', () => {
            // Act & Assert
            expect(() => {
                bookManager.updateBook('id_inexistente', 'Título', 'Autor');
            }).toThrow('Livro não encontrado');
        });
    });

    describe('CT007-CT008: Gestão de Livros - Exclusão', () => {
        let existingBook;

        beforeEach(() => {
            existingBook = bookManager.addBook('Clean Code', 'Robert Martin');
        });

        test('CT007: Deve excluir livro existente', () => {
            // Arrange
            const initialLength = bookManager.books.length;

            // Act
            const result = bookManager.deleteBook(existingBook.id);

            // Assert
            expect(result).toBe(true);
            expect(bookManager.books).toHaveLength(initialLength - 1);
            expect(bookManager.books.find(book => book.id === existingBook.id)).toBeUndefined();
        });

        test('Deve rejeitar exclusão de livro inexistente', () => {
            // Act & Assert
            expect(() => {
                bookManager.deleteBook('id_inexistente');
            }).toThrow('Livro não encontrado');
        });
    });

    describe('CT009-CT010: Controle de Status', () => {
        let existingBook;

        beforeEach(() => {
            existingBook = bookManager.addBook('Clean Code', 'Robert Martin');
        });

        test('CT009: Deve marcar livro como lido', () => {
            // Arrange
            expect(existingBook.isRead).toBe(false);

            // Act
            const updatedBook = bookManager.toggleReadStatus(existingBook.id);

            // Assert
            expect(updatedBook.isRead).toBe(true);
            expect(bookManager.books[0].isRead).toBe(true);
        });

        test('CT010: Deve desmarcar livro como lido', () => {
            // Arrange
            bookManager.toggleReadStatus(existingBook.id); // Marcar como lido primeiro
            expect(bookManager.books[0].isRead).toBe(true);

            // Act
            const updatedBook = bookManager.toggleReadStatus(existingBook.id);

            // Assert
            expect(updatedBook.isRead).toBe(false);
            expect(bookManager.books[0].isRead).toBe(false);
        });

        test('Deve rejeitar toggle de livro inexistente', () => {
            // Act & Assert
            expect(() => {
                bookManager.toggleReadStatus('id_inexistente');
            }).toThrow('Livro não encontrado');
        });
    });

    describe('CT011-CT013: Filtros por Categoria', () => {
        beforeEach(() => {
            // Adicionar livros de teste
            bookManager.addBook('Livro 1', 'Autor 1');
            bookManager.addBook('Livro 2', 'Autor 2');
            bookManager.addBook('Livro 3', 'Autor 3');
            
            // Marcar alguns como lidos
            bookManager.toggleReadStatus(bookManager.books[0].id);
            bookManager.toggleReadStatus(bookManager.books[1].id);
        });

        test('CT011: Filtro "Todos" deve exibir todos os livros', () => {
            // Arrange
            bookManager.currentView = 'all';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(3);
        });

        test('CT012: Filtro "Para Ler" deve exibir apenas não lidos', () => {
            // Arrange
            bookManager.currentView = 'to-read';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].isRead).toBe(false);
        });

        test('CT013: Filtro "Lidos" deve exibir apenas lidos', () => {
            // Arrange
            bookManager.currentView = 'read';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(2);
            filteredBooks.forEach(book => {
                expect(book.isRead).toBe(true);
            });
        });
    });

    describe('CT014-CT015: Busca de Livros', () => {
        beforeEach(() => {
            bookManager.addBook('Clean Code', 'Robert Martin');
            bookManager.addBook('JavaScript: The Good Parts', 'Douglas Crockford');
            bookManager.addBook('Python Tricks', 'Dan Bader');
        });

        test('CT014: Deve buscar por título', () => {
            // Arrange
            bookManager.searchTerm = 'clean';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].title).toBe('Clean Code');
        });

        test('CT015: Deve buscar por autor', () => {
            // Arrange
            bookManager.searchTerm = 'martin';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].author).toBe('Robert Martin');
        });

        test('Busca deve ser case-insensitive', () => {
            // Arrange
            bookManager.searchTerm = 'JAVASCRIPT';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].title).toContain('JavaScript');
        });

        test('Busca deve funcionar com correspondência parcial', () => {
            // Arrange
            bookManager.searchTerm = 'java';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].title).toContain('JavaScript');
        });

        test('Busca sem resultados deve retornar array vazio', () => {
            // Arrange
            bookManager.searchTerm = 'livro_que_nao_existe';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(0);
        });
    });

    describe('RF007: Estatísticas', () => {
        test('Deve calcular estatísticas corretamente', () => {
            // Arrange
            bookManager.addBook('Livro 1', 'Autor 1');
            bookManager.addBook('Livro 2', 'Autor 2');
            bookManager.addBook('Livro 3', 'Autor 3');
            bookManager.toggleReadStatus(bookManager.books[0].id);

            // Act
            const stats = bookManager.getStats();

            // Assert
            expect(stats.totalBooks).toBe(3);
            expect(stats.booksRead).toBe(1);
            expect(stats.booksToRead).toBe(2);
        });

        test('Estatísticas com lista vazia', () => {
            // Act
            const stats = bookManager.getStats();

            // Assert
            expect(stats.totalBooks).toBe(0);
            expect(stats.booksRead).toBe(0);
            expect(stats.booksToRead).toBe(0);
        });
    });

    describe('CT021-CT023: Persistência de Dados', () => {
        test('CT021: Deve carregar dados do localStorage', () => {
            // Arrange
            const mockBooks = [
                { id: 'test1', title: 'Livro 1', author: 'Autor 1', isRead: false, dateAdded: '2024-01-01' }
            ];
            localStorage.getItem.mockReturnValue(JSON.stringify(mockBooks));

            // Act
            bookManager.loadBooks();

            // Assert
            expect(bookManager.books).toEqual(mockBooks);
            expect(localStorage.getItem).toHaveBeenCalledWith('readingManagerBooks');
        });

        test('Deve lidar com localStorage vazio', () => {
            // Arrange
            localStorage.getItem.mockReturnValue(null);

            // Act
            bookManager.loadBooks();

            // Assert
            expect(bookManager.books).toEqual([]);
        });

        test('CT022: Deve limpar todos os dados', () => {
            // Arrange
            bookManager.addBook('Livro 1', 'Autor 1');
            bookManager.addBook('Livro 2', 'Autor 2');

            // Act
            bookManager.clearAllBooks();

            // Assert
            expect(bookManager.books).toHaveLength(0);
            expect(localStorage.setItem).toHaveBeenCalledWith('readingManagerBooks', '[]');
        });
    });

    describe('Utilidades e Segurança', () => {
        test('Deve gerar IDs únicos', () => {
            // Act
            const id1 = bookManager.generateId();
            const id2 = bookManager.generateId();

            // Assert
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^book_\d+_[a-z0-9]+$/);
            expect(id2).toMatch(/^book_\d+_[a-z0-9]+$/);
        });

        test('Deve escapar HTML para prevenir XSS', () => {
            // Arrange
            const maliciousText = '<script>alert("xss")</script>';
            
            // Act
            const escapedText = bookManager.escapeHtml(maliciousText);
            
            // Assert
            expect(escapedText).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
        });
    });

    describe('Integração de Filtros e Busca', () => {
        beforeEach(() => {
            bookManager.addBook('Clean Code', 'Robert Martin');
            bookManager.addBook('JavaScript Guide', 'Author JS');
            bookManager.addBook('Python Basics', 'Author Python');
            
            // Marcar primeiro como lido
            bookManager.toggleReadStatus(bookManager.books[0].id);
        });

        test('Deve combinar filtro de categoria com busca', () => {
            // Arrange
            bookManager.currentView = 'read';
            bookManager.searchTerm = 'clean';

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(1);
            expect(filteredBooks[0].title).toBe('Clean Code');
            expect(filteredBooks[0].isRead).toBe(true);
        });

        test('Filtro restritivo deve retornar array vazio', () => {
            // Arrange
            bookManager.currentView = 'read';
            bookManager.searchTerm = 'python'; // Python não está marcado como lido

            // Act
            const filteredBooks = bookManager.getFilteredBooks();

            // Assert
            expect(filteredBooks).toHaveLength(0);
        });
    });
});
