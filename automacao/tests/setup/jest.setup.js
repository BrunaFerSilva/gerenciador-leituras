// Jest Setup - Configuração global para testes unitários

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do DOM básico
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn()
  }
});

// Mock de elementos DOM comuns
const mockElement = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(),
  innerHTML: '',
  textContent: '',
  value: '',
  style: {},
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn()
  },
  scrollIntoView: jest.fn(),
  focus: jest.fn(),
  click: jest.fn()
};

global.document = {
  ...mockElement,
  createElement: jest.fn(() => mockElement),
  head: mockElement,
  body: mockElement,
  addEventListener: jest.fn(),
  getElementById: jest.fn(() => mockElement),
  querySelector: jest.fn(() => mockElement),
  querySelectorAll: jest.fn(() => [mockElement])
};

// Mock de console para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Reset de mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.getItem.mockReturnValue(null);
});
