document.addEventListener("DOMContentLoaded", function () {
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const searchBtn = document.querySelector(".search-btn");
    const searchOverlay = document.querySelector(".search-overlay");
    const closeSearch = document.querySelector(".close-search");
    const categoryLinks = document.querySelectorAll(".category-list a");
    const sortSelect = document.getElementById("sortBy");

    let produtos = [];

    // Carrega os produtos
    function loadProducts() {
        fetch('produtos.json')
            .then(response => response.json())
            .then(data => {
                produtos = data;
                if (destaquesContainer) exibirDestaques(produtos, destaquesContainer);
                if (produtosContainer) exibirProdutos(produtos, produtosContainer);
                
                // Adiciona event listeners para as categorias após carregar os produtos
                setupCategoryFilters();
                setupSorting();
            })
            .catch(error => console.error("Erro ao carregar produtos:", error));
    }

    // Exibe os produtos
    function exibirProdutos(produtos, container) {
        if (!container) return;
        
        container.innerHTML = produtos.map(produto => `
            <div class="product-card" data-category="${produto.categoria}">
                <div class="product-image">
                    <img src="assets/${produto.imagem}" alt="${produto.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <a href="https://wa.me/551112345678?text=Olá, gostaria de saber mais sobre ${encodeURIComponent(produto.nome)}" class="btn whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> Pedir pelo WhatsApp
                    </a>
                </div>
            </div>
        `).join('');
    }

    // Exibe os produtos em destaque
    function exibirDestaques(produtos, container) {
        if (!container) return;
        const produtosDestaque = produtos.filter(produto => produto.destaque);
        exibirProdutos(produtosDestaque, container);
    }

    // Configura os filtros de categoria
    function setupCategoryFilters() {
        if (!categoryLinks) return;
        
        categoryLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Remove a classe active de todos os links
                categoryLinks.forEach(l => l.classList.remove("active"));
                
                // Adiciona a classe active ao link clicado
                this.classList.add("active");
                
                // Obtém a categoria
                const categoria = this.getAttribute("data-category");
                
                // Filtra os produtos
                let produtosFiltrados = categoria === "todos" 
                    ? produtos 
                    : produtos.filter(produto => produto.categoria === categoria);
                
                // Ordena os produtos se houver seleção de ordenação
                if (sortSelect) {
                    produtosFiltrados = sortProducts(produtosFiltrados, sortSelect.value);
                }
                
                // Exibe os produtos filtrados
                exibirProdutos(produtosFiltrados, produtosContainer);
            });
        });
    }

    // Configura a ordenação
    function setupSorting() {
        if (!sortSelect) return;
        
        sortSelect.addEventListener("change", function() {
            // Obtém a categoria ativa
            const categoriaAtiva = document.querySelector(".category-list a.active")?.getAttribute("data-category") || "todos";
            
            // Filtra os produtos
            let produtosFiltrados = categoriaAtiva === "todos" 
                ? produtos 
                : produtos.filter(produto => produto.categoria === categoriaAtiva);
            
            // Ordena os produtos
            produtosFiltrados = sortProducts(produtosFiltrados, this.value);
            
            // Exibe os produtos ordenados
            exibirProdutos(produtosFiltrados, produtosContainer);
        });
    }

    // Função para ordenar produtos
    function sortProducts(produtos, criterio) {
        const produtosOrdenados = [...produtos];
        switch(criterio) {
            case "name-asc":
                return produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
            case "name-desc":
                return produtosOrdenados.sort((a, b) => b.nome.localeCompare(a.nome));
            case "price-asc":
                return produtosOrdenados.sort((a, b) => (a.preco || 0) - (b.preco || 0));
            case "price-desc":
                return produtosOrdenados.sort((a, b) => (b.preco || 0) - (a.preco || 0));
            default:
                return produtosOrdenados;
        }
    }

    // Inicialização
    loadProducts();

    // Event listeners para pesquisa (mantido do original)
    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener("click", () => {
            searchOverlay.classList.add("show");
        });
        
        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("show");
        });
    }
});
