const API_URL = 'http://localhost:3000/api';

const formProduto = document.getElementById('formProduto');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

const urlParams = new URLSearchParams(window.location.search);
const editarId = urlParams.get('id');

// Se for edição, carregar dados e ajustar título/botão
document.addEventListener('DOMContentLoaded', async () => {
    if (editarId) {
        try {
            const resp = await fetch(`${API_URL}/produtos/${editarId}`);
            if (!resp.ok) throw new Error('Produto não encontrado');
            const produto = await resp.json();

            document.querySelector('.form-wrapper h2').textContent = 'Editar Produto';
            formProduto.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';

            document.getElementById('nome').value = produto.nome || '';
            document.getElementById('price').value = produto.preco || '';
            document.getElementById('categoria').value = produto.categoria || '';
            document.getElementById('descricao').value = produto.descricao || '';
        } catch (err) {
            console.error('Erro ao carregar produto para edição:', err);
            mostrarErro('Não foi possível carregar o produto para edição.');
        }
    }
});

formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value.trim(),
        preco: parseFloat(document.getElementById('price').value),
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value.trim()
    };

    // Validação básica
    if (!formData.nome || isNaN(formData.preco) || !formData.categoria || !formData.descricao) {
        mostrarErro('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (formData.preco <= 0) {
        mostrarErro('O preço deve ser maior que zero.');
        return;
    }

    try {
        // Se estiver editando, usar PUT, caso contrário POST
        const method = editarId ? 'PUT' : 'POST';
        const url = editarId ? `${API_URL}/produtos/${editarId}` : `${API_URL}/produtos`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Mostrar mensagem de sucesso
            errorMessage.style.display = 'none';
            formProduto.style.display = 'none';
            successMessage.style.display = 'block';

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = '../produtos/produtos.html';
            }, 2000);
        } else {
            const error = await response.json();
            mostrarErro(error.erro || 'Erro ao salvar o produto.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarErro('Erro ao conectar ao servidor. Verifique a URL da API.');
    }
});

function mostrarErro(mensagem) {
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    errorText.textContent = mensagem;
    
    // Scroll até a mensagem de erro
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
