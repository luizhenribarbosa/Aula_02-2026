// Tema Claro/Escuro
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Verificar preferência salva ou usar preferência do sistema
const preferedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Aplicar tema ao carregar
if (preferedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
} else {
    document.body.classList.remove('dark-theme');
    themeToggle.textContent = '🌙';
}

// Alternar tema ao clicar
themeToggle.addEventListener('click', () => {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    
    // Salvar preferência
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Atualizar ícone
    themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
});

// Detectar mudança de preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.textContent = '🌙';
        }
    }
});
