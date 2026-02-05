const API_URL = 'http://localhost:3000/api';

const formProduto = document.getElementById('formProduto');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

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
        // Enviar para o servidor
        const response = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            
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
            mostrarErro(error.erro || 'Erro ao cadastrar o produto.');
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
