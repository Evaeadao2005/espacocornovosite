document.addEventListener("DOMContentLoaded", function () {
    // Elementos globais
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const searchBtn = document.querySelector(".search-btn");
    const searchOverlay = document.querySelector(".search-overlay");
    const closeSearch = document.querySelector(".close-search");
    const categoryLinks = document.querySelectorAll(".category-list a");
    const sortSelect = document.getElementById("sortBy");
    const contactForm = document.getElementById("contactForm");
    
    let produtos = [];
    
    // Carrega os produtos
    function loadProducts() {
        fetch('produtos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar produtos');
                }
                return response.json();
            })
            .then(data => {
                produtos = data;
                
                // Exibe os produtos conforme a página
                if (destaquesContainer) {
                    exibirDestaques(produtos, destaquesContainer);
                }
                
                if (produtosContainer) {
                    exibirProdutos(produtos, produtosContainer);
                    setupCategoryFilters();
                    setupSorting();
                }
            })
            .catch(error => {
                console.error("Erro ao carregar produtos:", error);
                if (produtosContainer) {
                    produtosContainer.innerHTML = `
                        <div class="error-message">
                            <p>Não foi possível carregar os produtos no momento. Por favor, tente novamente mais tarde.</p>
                        </div>
                    `;
                }
            });
    }
    
    // Exibe os produtos
    function exibirProdutos(produtos, container) {
        if (!container) return;
        
        if (produtos.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Nenhum produto encontrado nesta categoria.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = produtos.map((produto, index) => `
            <div class="product-card fade-in ${index > 3 ? 'delay-' + (index % 3 + 1) : ''}" 
                 data-category="${produto.categoria}" 
                 data-id="${produto.id}"
                 tabindex="0">
                <div class="product-image">
                    <img src="assets/${produto.imagem}" alt="${produto.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <a href="https://wa.me/551112345678?text=Olá, gostaria de saber mais sobre ${encodeURIComponent(produto.nome)}" 
                       class="btn whatsapp-btn"
                       aria-label="Pedir ${produto.nome} pelo WhatsApp">
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
        if (!categoryLinks || !produtosContainer) return;
        
        categoryLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                
                // Remove a classe active de todos os links
                categoryLinks.forEach(l => {
                    l.classList.remove("active");
                    l.setAttribute("aria-current", "false");
                });
                
                // Adiciona a classe active ao link clicado
                this.classList.add("active");
                this.setAttribute("aria-current", "true");
                
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
                
                // Rola para a seção de produtos
                produtosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }
    
    // Configura a ordenação
    function setupSorting() {
        if (!sortSelect || !produtosContainer) return;
        
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
    
    // Validação do formulário de contato
    function setupContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");
            let isValid = true;
            
            // Limpa mensagens de erro anteriores
            document.querySelectorAll(".error-text").forEach(el => el.remove());
            
            // Validação do nome
            if (!name.value.trim()) {
                showError(name, "Por favor, insira seu nome");
                isValid = false;
            }
            
            // Validação do email
            if (!email.value.trim()) {
                showError(email, "Por favor, insira seu email");
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, "Por favor, insira um email válido");
                isValid = false;
            }
            
            // Validação da mensagem
            if (!message.value.trim()) {
                showError(message, "Por favor, insira sua mensagem");
                isValid = false;
            }
            
            // Se tudo estiver válido, pode enviar
            if (isValid) {
                // Simulação de envio
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                // Simula um delay de envio
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
                    
                    // Limpa o formulário
                    contactForm.reset();
                    
                    // Mostra mensagem de sucesso
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <p><i class="fas fa-check-circle"></i> Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.</p>
                    `;
                    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                    
                    // Rola para a mensagem de sucesso
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                    // Reseta o botão após alguns segundos
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Mostra mensagem de erro
    function showError(input, message) {
        const errorText = document.createElement('p');
        errorText.className = 'error-text';
        errorText.textContent = message;
        errorText.style.color = 'var(--accent-color)';
        errorText.style.marginTop = '5px';
        errorText.style.fontSize = '0.8rem';
        input.parentNode.appendChild(errorText);
        input.focus();
    }
    
    // Valida email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Inicialização
    loadProducts();
    setupContactForm();
    
    // Event listeners para pesquisa
    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener("click", () => {
            searchOverlay.classList.add("show");
            document.querySelector('.search-input')?.focus();
        });
        
        closeSearch.addEventListener("click", () => {
            searchOverlay.classList.remove("show");
        });
        
        // Fecha ao pressionar ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && searchOverlay.classList.contains("show")) {
                searchOverlay.classList.remove("show");
            }
        });
    }
    
    // Adiciona classe de carregamento ao body
    document.body.classList.add('loaded');
});