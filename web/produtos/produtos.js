const API_URL = 'http://localhost:3000/api';

const produtosContainer = document.getElementById('produtosContainer');
const loadingMessage = document.getElementById('loadingMessage');
const emptyMessage = document.getElementById('emptyMessage');

// Carregar produtos ao abrir a página
document.addEventListener('DOMContentLoaded', carregarProdutos);

async function carregarProdutos() {
    try {
        loadingMessage.style.display = 'block';
        emptyMessage.style.display = 'none';
        produtosContainer.innerHTML = '';

        const response = await fetch(`${API_URL}/produtos`);

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const produtos = await response.json();

        loadingMessage.style.display = 'none';

        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        // Renderizar cada produto
        produtos.forEach(produto => {
            const produtoCard = criarCartaoProduto(produto);
            produtosContainer.appendChild(produtoCard);
        });

    } catch (erro) {
        console.error('Erro:', erro);
        loadingMessage.innerHTML = '<p>Erro ao carregar produtos. Verifique a conexão com o servidor.</p>';
    }
}

function criarCartaoProduto(produto) {
    const div = document.createElement('div');
    div.className = 'produto-card';
    
    // Formatar preço - garantir que é um número válido
    let preco = 0;
    if (typeof produto.preco === 'number') {
        preco = produto.preco;
    } else if (typeof produto.preco === 'string') {
        preco = parseFloat(produto.preco);
    }
    
    const precoFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);

    div.innerHTML = `
        <h3>${produto.nome}</h3>
        <span class="categoria-badge">${produto.categoria}</span>
        <div class="produto-preco">${precoFormatado}</div>
        <p class="produto-descricao">${produto.descricao}</p>
        <button class="btn-deletar" data-id="${produto.id}">🗑️ Apagar</button>
    `;

    // Adicionar evento ao botão de deletar
    const btnDeletar = div.querySelector('.btn-deletar');
    btnDeletar.addEventListener('click', () => deletarProduto(produto.id));

    return div;
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja apagar este produto?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao deletar produto');
        }

        alert('Produto deletado com sucesso!');
        carregarProdutos();
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao deletar o produto: ' + erro.message);
    }
}
