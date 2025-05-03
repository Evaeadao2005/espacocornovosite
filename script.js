document.addEventListener("DOMContentLoaded", function () {
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const searchBtn = document.querySelector(".search-btn");
    const searchOverlay = document.querySelector(".search-overlay");
    const closeSearch = document.querySelector(".close-search");

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
            <div class="product-card">
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
});
