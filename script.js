document.addEventListener("DOMContentLoaded", function() {
  // Carrega produtos
  loadProducts();
  
  // Inicializa filtros
  initFilters();
  
  // Busca integrada
  initSearch();
  
  // Verifica parâmetros de URL para busca
  checkUrlParams();
});

// Carrega produtos do JSON
async function loadProducts() {
  try {
    const response = await fetch('produtos.json');
    const produtos = await response.json();
    
    // Armazena produtos globalmente
    window.produtos = produtos;
    
    // Exibe produtos na página inicial
    if (document.getElementById('destaques')) {
      const destaques = produtos.filter(p => p.destaque);
      renderProducts(destaques, 'destaques');
    }
    
    // Exibe todos os produtos na página de produtos
    if (document.getElementById('produtos')) {
      renderProducts(produtos, 'produtos');
    }
    
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

// Renderiza produtos no container especificado
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      ${product.destaque ? '<span class="product-badge">Destaque</span>' : ''}
      <div class="product-image">
        <img src="assets/${product.imagem}" alt="${product.nome}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${formatCategory(product.categoria)}</span>
        <h3 class="product-title">${product.nome}</h3>
        <p class="product-description">${product.descricao}</p>
        <div class="product-actions">
          <a href="https://wa.me/5511999999999?text=Olá, gostaria de informações sobre ${encodeURIComponent(product.nome)}" 
             class="btn whatsapp-btn" target="_blank">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// Formata categoria para exibição
function formatCategory(category) {
  const categories = {
    'parede': 'Parede',
    'madeira': 'Madeira',
    'metal': 'Metal'
  };
  return categories[category] || category;
}

// Inicializa sistema de filtros
function initFilters() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const sortSelect = document.getElementById('sortBy');
  
  // Filtro por categoria
  if (categoryButtons) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts();
      });
    });
  }
  
  // Ordenação
  if (sortSelect) {
    sortSelect.addEventListener('change', filterProducts);
  }
}

// Filtra produtos
function filterProducts() {
  const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'todos';
  const sortBy = document.getElementById('sortBy')?.value || 'name-asc';
  
  let filtered = activeCategory === 'todos' 
    ? window.produtos 
    : window.produtos.filter(p => p.categoria === activeCategory);
  
  // Ordena
  filtered = sortProducts(filtered, sortBy);
  
  // Exibe
  renderProducts(filtered, 'produtos');
}

// Ordena produtos
function sortProducts(products, criterion) {
  return [...products].sort((a, b) => {
    if (criterion === 'name-asc') return a.nome.localeCompare(b.nome);
    if (criterion === 'name-desc') return b.nome.localeCompare(a.nome);
    return 0;
  });
}

// Sistema de busca
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput.value);
      }
    });
    
    document.querySelector('.search-icon').addEventListener('click', () => {
      performSearch(searchInput.value);
    });
  }
}

// Executa busca
function performSearch(term) {
  if (!term.trim()) return;
  
  const results = window.produtos.filter(p => 
    p.nome.toLowerCase().includes(term.toLowerCase()) || 
    p.descricao.toLowerCase().includes(term.toLowerCase())
  );
  
  if (document.getElementById('produtos')) {
    renderProducts(results, 'produtos');
  } else {
    window.location.href = `produtos.html?search=${encodeURIComponent(term)}`;
  }
}

// Verifica parâmetros de URL para busca
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  
  if (searchTerm && document.getElementById('produtos')) {
    document.querySelector('.search-input').value = searchTerm;
    performSearch(searchTerm);
  }
}
