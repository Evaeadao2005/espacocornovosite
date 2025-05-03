document.addEventListener("DOMContentLoaded", function () {
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    let produtos = [];

    // Carrega produtos
    function loadProducts() {
        fetch('produtos.json')
            .then(response => response.json())
            .then(data => {
                produtos = data;
                if (destaquesContainer) showFeatured(produtos);
                if (produtosContainer) showProducts(produtos);
                initFilters();
            });
    }

    // Mostra produtos em destaque
    function showFeatured(products) {
        const featured = products.filter(p => p.destaque);
        showProducts(featured, destaquesContainer);
    }

    // Mostra produtos
    function showProducts(products, container = produtosContainer) {
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="assets/${product.imagem}" alt="${product.nome}">
                </div>
                <div class="product-info">
                    <h3>${product.nome}</h3>
                    <p>${product.descricao}</p>
                    <a href="https://wa.me/5511987654321?text=Olá, gostaria de saber mais sobre ${encodeURIComponent(product.nome)}" 
                       class="btn whatsapp-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> Pedir pelo WhatsApp
                    </a>
                </div>
            </div>
        `).join('');
    }

    // Inicializa filtros
    function initFilters() {
        const categoryLinks = document.querySelectorAll(".category-list a");
        const sortSelect = document.getElementById("sortBy");

        categoryLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                filterProducts();
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener("change", filterProducts);
        }
    }

    // Filtra produtos
    function filterProducts() {
        const activeCategory = document.querySelector(".category-list a.active").dataset.category;
        const sortBy = document.getElementById("sortBy")?.value || "name-asc";

        let filtered = produtos.filter(p => 
            activeCategory === "todos" || p.categoria === activeCategory
        );

        filtered = sortProducts(filtered, sortBy);
        showProducts(filtered);
    }

    // Ordena produtos
    function sortProducts(products, criterion) {
        return [...products].sort((a, b) => {
            if (criterion === "name-asc") return a.nome.localeCompare(b.nome);
            if (criterion === "name-desc") return b.nome.localeCompare(a.nome);
            return 0;
        });
    }

    // Inicializa busca
    const searchBtn = document.querySelector(".search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const term = prompt("O que você está procurando?");
            if (term) {
                const results = produtos.filter(p => 
                    p.nome.toLowerCase().includes(term.toLowerCase()) || 
                    p.descricao.toLowerCase().includes(term.toLowerCase())
                );
                showProducts(results);
            }
        });
    }

    loadProducts();
});
