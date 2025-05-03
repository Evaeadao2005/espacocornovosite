document.addEventListener("DOMContentLoaded", function () {
    // Elementos globais
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const categoriaSelect = document.getElementById("categoria");
    const buscaInput = document.getElementById("busca");
    const cartCount = document.querySelector(".cart-count");
    
    // Estado da aplicação
    let produtos = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let compareItems = [];

    // Inicialização
    updateCartCount();
    loadProducts();
    initProductsPage();
    initEventListeners();

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

    // Inicializa a página de produtos
    function initProductsPage() {
        if (!document.getElementById("produtos")) return;

        // Controles de visualização
        const viewButtons = document.querySelectorAll(".view-btn");
        const productsGrid = document.querySelector(".products-grid");
        
        viewButtons.forEach(button => {
            button.addEventListener("click", () => {
                viewButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                
                if (button.classList.contains("grid-view")) {
                    productsGrid.classList.remove("list-view");
                } else {
                    productsGrid.classList.add("list-view");
                }
            });
        });

        // Filtro de preço
        const priceSlider = document.getElementById("priceRange");
        const maxPriceDisplay = document.getElementById("maxPrice");
        
        if (priceSlider && maxPriceDisplay) {
            priceSlider.addEventListener("input", () => {
                const maxPrice = priceSlider.value;
                maxPriceDisplay.textContent = `R$ ${maxPrice}`;
                filtrarProdutos();
            });
        }

        // Filtro de categoria
        const categoryLinks = document.querySelectorAll(".category-list a");
        
        categoryLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                if (categoriaSelect) {
                    categoriaSelect.value = link.dataset.category;
                }
                filtrarProdutos();
            });
        });

        // Filtro de destaques
        const featuredCheckbox = document.getElementById("featuredOnly");
        
        if (featuredCheckbox) {
            featuredCheckbox.addEventListener("change", filtrarProdutos);
        }

        // Sistema de comparação
        const compareList = document.getElementById("compareList");
        const compareBtn = document.getElementById("compareBtn");
        
        window.addToCompare = function(productId) {
            if (compareItems.includes(productId)) {
                compareItems = compareItems.filter(id => id !== productId);
            } else {
                if (compareItems.length >= 3) {
                    showToast("Você pode comparar no máximo 3 produtos");
                    return;
                }
                compareItems.push(productId);
            }
            
            updateCompareList();
        };
        
        function updateCompareList() {
            compareList.innerHTML = "";
            
            if (compareItems.length === 0) {
                compareBtn.disabled = true;
                return;
            }
            
            compareBtn.disabled = false;
            
            compareItems.forEach(productId => {
                const product = produtos.find(p => p.id === productId);
                if (product) {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        ${product.nome}
                        <span class="remove-compare" onclick="addToCompare(${productId})">
                            <i class="fas fa-times"></i>
                        </span>
                    `;
                    compareList.appendChild(li);
                }
            });
        }
        
        compareBtn.addEventListener("click", () => {
            showToast(`Comparando ${compareItems.length} produtos...`);
            // Implementar lógica de comparação aqui
        });

        // Busca avançada
        const searchBtn = document.querySelector(".search-btn");
        const searchOverlay = document.querySelector(".search-overlay");
        const closeSearch = document.querySelector(".close-search");
        
        if (searchBtn && searchOverlay && closeSearch) {
            searchBtn.addEventListener("click", () => {
                searchOverlay.classList.add("show");
            });
            
            closeSearch.addEventListener("click", () => {
                searchOverlay.classList.remove("show");
            });
        }

        // Ordenação
        const sortBy = document.getElementById("sortBy");
        
        if (sortBy) {
            sortBy.addEventListener("change", () => {
                filtrarProdutos();
            });
        }
    }

    // Inicializa event listeners
    function initEventListeners() {
        if (categoriaSelect) {
            categoriaSelect.addEventListener("change", filtrarProdutos);
        }
        
        if (buscaInput) {
            buscaInput.addEventListener("input", filtrarProdutos);
        }
    }

    // Filtra os produtos
    function filtrarProdutos() {
        const categoria = categoriaSelect ? categoriaSelect.value : "todos";
        const termoBusca = buscaInput ? buscaInput.value.toLowerCase() : "";
        const maxPrice = document.getElementById("priceRange") ? document.getElementById("priceRange").value : 500;
        const featuredOnly = document.getElementById("featuredOnly") ? document.getElementById("featuredOnly").checked : false;
        const sortBy = document.getElementById("sortBy") ? document.getElementById("sortBy").value : "relevance";

        let produtosFiltrados = produtos.filter(produto => {
            const correspondeCategoria = categoria === "todos" || produto.categoria === categoria;
            const correspondeBusca = produto.nome.toLowerCase().includes(termoBusca) || 
                                   produto.descricao.toLowerCase().includes(termoBusca);
            const correspondePreco = produto.preco <= maxPrice;
            const correspondeDestaque = !featuredOnly || produto.destaque;
            
            return correspondeCategoria && correspondeBusca && correspondePreco && correspondeDestaque;
        });

        // Ordenação
        produtosFiltrados = ordenarProdutos(produtosFiltrados, sortBy);

        if (produtosContainer) exibirProdutos(produtosFiltrados, produtosContainer);
    }

    // Ordena produtos
    function ordenarProdutos(produtos, criterio) {
        switch(criterio) {
            case "price-asc":
                return [...produtos].sort((a, b) => a.preco - b.preco);
            case "price-desc":
                return [...produtos].sort((a, b) => b.preco - a.preco);
            case "name-asc":
                return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
            case "name-desc":
                return [...produtos].sort((a, b) => b.nome.localeCompare(a.nome));
            default:
                return produtos;
        }
    }

    // Exibe os produtos
    function exibirProdutos(produtos, container) {
        if (!container) return;
        
        container.innerHTML = produtos.map(produto => `
            <div class="product-card">
                ${produto.destaque ? '<span class="product-badge">Destaque</span>' : ''}
                <div class="product-image">
                    <img src="assets/${produto.imagem}" alt="${produto.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-category">${formatCategoria(produto.categoria)}</span>
                    <h3 class="product-title">${produto.nome}</h3>
                    <p class="product-description">${produto.descricao}</p>
                    <div class="product-price">${formatPrice(produto.preco)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${produto.id})">Comprar</button>
                        <button class="btn btn-secondary" onclick="viewDetails(${produto.id})">Detalhes</button>
                        <button class="btn-icon compare-btn" onclick="addToCompare(${produto.id})" title="Comparar">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    </div>
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

    // Formata categoria para exibição
    function formatCategoria(categoria) {
        const categorias = {
            "parede": "Tinta para Parede",
            "madeira": "Tinta para Madeira",
            "metal": "Tinta para Metal"
        };
        return categorias[categoria] || categoria;
    }

    // Formata preço
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    // Adiciona ao carrinho (disponível globalmente)
    window.addToCart = function(productId) {
        const product = produtos.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showToast(`${product.nome} adicionado ao carrinho`);
        }
    };

    // Atualiza contador do carrinho
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? "flex" : "none";
        }
    }

    // Visualizar detalhes (disponível globalmente)
    window.viewDetails = function(productId) {
        // Na implementação real, redirecionaria para página de detalhes
        const product = produtos.find(p => p.id === productId);
        if (product) {
            showToast(`Abrindo detalhes de ${product.nome}...`);
            // window.location.href = `detalhes.html?id=${productId}`;
        }
    };

    // Mostra notificação
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add("show");
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});

// Adiciona estilos dinâmicos para o toast
const toastStyles = document.createElement("style");
toastStyles.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.toast.show {
    opacity: 1;
}
`;
document.head.appendChild(toastStyles);

// Adiciona estilos dinâmicos para o botão de comparação
const compareBtnStyles = document.createElement("style");
compareBtnStyles.textContent = `
.compare-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    margin-left: 10px;
}

.compare-btn:hover {
    color: var(--secondary-color);
    transform: rotate(90deg);
}
`;
document.head.appendChild(compareBtnStyles);
