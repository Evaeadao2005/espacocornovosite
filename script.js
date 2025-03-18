document.addEventListener("DOMContentLoaded", function () {
    const produtosContainer = document.getElementById("produtos");
    const destaquesContainer = document.getElementById("destaques");
    const categoriaSelect = document.getElementById("categoria");
    const buscaInput = document.getElementById("busca");

    let produtos = [];

    // Carrega os produtos do arquivo JSON
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
            exibirProdutos(produtos, produtosContainer);
            exibirDestaques(produtos, destaquesContainer);
        });

    // Filtra os produtos
    function filtrarProdutos() {
        const categoria = categoriaSelect.value;
        const termoBusca = buscaInput.value.toLowerCase();

        const produtosFiltrados = produtos.filter(produto => {
            const correspondeCategoria = categoria === "todos" || produto.categoria === categoria;
            const correspondeBusca = produto.nome.toLowerCase().includes(termoBusca);
            return correspondeCategoria && correspondeBusca;
        });

        exibirProdutos(produtosFiltrados, produtosContainer);
    }

    // Exibe os produtos
    function exibirProdutos(produtos, container) {
        container.innerHTML = produtos.map(produto => `
            <div class="produto" data-categoria="${produto.categoria}">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
            </div>
        `).join('');
    }

    // Exibe os produtos em destaque
    function exibirDestaques(produtos, container) {
        const produtosDestaque = produtos.filter(produto => produto.destaque);
        exibirProdutos(produtosDestaque, container);
    }

    // Eventos de filtro
    categoriaSelect.addEventListener("change", filtrarProdutos);
    buscaInput.addEventListener("input", filtrarProdutos);
});
