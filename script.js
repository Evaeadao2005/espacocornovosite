document.addEventListener("DOMContentLoaded", function() {
    // Elementos globais
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.querySelector(".search-input");
    const categoryLinks = document.querySelectorAll(".category-list a");
    const sortSelect = document.getElementById("sortBy");
    
    let produtos = [];
    
    // Carregar produtos
    function loadProducts() {
        fetch('produtos.json')
            .then(response => response.json())
            .then(data => {
                produtos = data;
                if (destaquesContainer) displayProducts(getFeaturedProducts(), destaquesContainer);
                if (produtosContainer) displayProducts(produtos, produtosContainer);
            })
            .catch(error => console.error("Erro ao carregar produtos:", error));
    }
    
    // Exibir produtos
    function displayProducts(products, container) {
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.categoria}">
                <div class="product-image">
                    <img src="assets/${product.imagem}" alt="${product.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao}</p>
                    <a href="https://wa.me/551112345678?text=Olá, gostaria de saber mais sobre ${encodeURIComponent(product.nome)}" 
                       class="btn whatsapp-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    // Obter produtos em destaque
    function getFeaturedProducts() {
        return produtos.filter(product => product.destaque);
    }
    
    // Filtrar por categoria
    function filterByCategory(category) {
        return category === "todos" 
            ? produtos 
            : produtos.filter(product => product.categoria === category);
    }
    
    // Ordenar produtos
    function sortProducts(products, criteria) {
        const sorted = [...products];
        switch(criteria) {
            case "name-asc": return sorted.sort((a, b) => a.nome.localeCompare(b.nome));
            case "name-desc": return sorted.sort((a, b) => b.nome.localeCompare(a.nome));
            default: return sorted;
        }
    }
    
    // Pesquisar produtos
    function searchProducts(query) {
        if (!query) return produtos;
        const lowerQuery = query.toLowerCase();
        return produtos.filter(product => 
            product.nome.toLowerCase().includes(lowerQuery) || 
            product.descricao.toLowerCase().includes(lowerQuery)
        );
    }
    
    // Evento de pesquisa
    if (searchForm) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            const results = searchProducts(query);
            displayProducts(results, produtosContainer);
        });
    }
    
    // Filtros de categoria
    if (categoryLinks) {
        categoryLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Ativar link clicado
                categoryLinks.forEach(l => l.classList.remove("active"));
                this.classList.add("active");
                
                // Filtrar e exibir produtos
                const category = this.dataset.category;
                let filtered = filterByCategory(category);
                
                // Manter ordenação se existir
                if (sortSelect) {
                    filtered = sortProducts(filtered, sortSelect.value);
                }
                
                displayProducts(filtered, produtosContainer);
            });
        });
    }
    
    // Ordenação
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            const activeCategory = document.querySelector(".category-list a.active")?.dataset.category || "todos";
            let filtered = filterByCategory(activeCategory);
            filtered = sortProducts(filtered, this.value);
            displayProducts(filtered, produtosContainer);
        });
    }
    
    // Inicializar
    loadProducts();
});
