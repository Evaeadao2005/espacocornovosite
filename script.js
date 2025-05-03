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
                    <a href="https://wa.me/551112345678?text=Olá, gostaria de saber mais sobre ${encodeURIComponent(produto.nome)}" class="btn whatsapp-btn" target="_blank">
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

    // Filtra produtos por categoria
    function filtrarPorCategoria(categoria) {
        if (categoria === "todos") {
            return produtos;
        }
        return produtos.filter(produto => produto.categoria === categoria);
    }

    // Ordena produtos
    function ordenarProdutos(produtos, criterio) {
        const produtosOrdenados = [...produtos];
        switch (criterio) {
            case "name-asc":
                return produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
            case "name-desc":
                return produtosOrdenados.sort((a, b) => b.nome.localeCompare(a.nome));
            default:
                return produtosOrdenados;
        }
    }

    // Inicialização
    loadProducts();

    // Event listeners
    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener("click", () => {
            searchOverlay.classList.add("show");
        });
        
        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("show");
        });
    }

    // Filtros de categoria
    if (categoryLinks) {
        categoryLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                
                // Remove a classe active de todos os links
                categoryLinks.forEach(l => l.classList.remove("active"));
                
                // Adiciona a classe active ao link clicado
                link.classList.add("active");
                
                // Obtém a categoria
                const categoria = link.getAttribute("data-category");
                
                // Filtra os produtos
                const produtosFiltrados = filtrarPorCategoria(categoria);
                
                // Ordena os produtos (pega o valor atual do select)
                const ordenacao = sortSelect ? sortSelect.value : "name-asc";
                const produtosOrdenados = ordenarProdutos(produtosFiltrados, ordenacao);
                
                // Exibe os produtos
                exibirProdutos(produtosOrdenados, produtosContainer);
            });
        });
    }

    // Ordenação
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            // Obtém a categoria ativa
            const categoriaAtiva = document.querySelector(".category-list a.active")?.getAttribute("data-category") || "todos";
            
            // Filtra os produtos
            const produtosFiltrados = filtrarPorCategoria(categoriaAtiva);
            
            // Ordena os produtos
            const produtosOrdenados = ordenarProdutos(produtosFiltrados, sortSelect.value);
            
            // Exibe os produtos
            exibirProdutos(produtosOrdenados, produtosContainer);
        });
    }
});
