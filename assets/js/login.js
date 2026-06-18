// Configuração da API
const API_URL = 'http://localhost/projetos/list_to_do/banco-dados/login.php'; // Altere para sua URL do backend

// ============ FUNÇÕES DE TEMA ============
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    if (newTheme === 'dark') {
        themeIcon.className = 'bi bi-sun';
        themeText.textContent = 'Modo Claro';
    } else {
        themeIcon.className = 'bi bi-moon-stars';
        themeText.textContent = 'Modo Escuro';
    }
}

// Carregar tema salvo
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (savedTheme === 'dark') {
            themeIcon.className = 'bi bi-sun';
            themeText.textContent = 'Modo Claro';
        }
    }
}

// ============ FUNÇÕES DE SENHA ============
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye');
    }
}

// ============ FUNÇÕES DE ALERTA ============
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    
    // Remove alertas existentes
    alertContainer.innerHTML = '';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alertDiv);

    // Auto-fechar após 5 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert-custom');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}

// ============ FUNÇÕES DE LOADING ============
function setLoading(isLoading) {
    const btn = document.getElementById('loginBtn');
    
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `
            <span class="spinner-container">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </span>
            Entrando...
        `;
    } else {
        btn.disabled = false;
        btn.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i>Entrar`;
    }
}

// ============ FUNÇÃO DE LOGIN ============
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validação básica
    if (!email || !password) {
        showAlert('warning', 'Por favor, preencha todos os campos.');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('warning', 'Por favor, insira um e-mail válido.');
        return;
    }

    // Salvar email se "Lembrar-me" estiver marcado
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    // Mostrar loading
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            // Login bem-sucedido
            showAlert('success', 'Login realizado com sucesso! Redirecionando...');

            // Redirecionar após 1.5 segundos
            setTimeout(() => {
                window.location.href = '/projetos/list_to_do/front-end/Tasks.php'; // ou página principal
            }, 1500);

        } else {
            // Login falhou
            showAlert('danger', data.mensagem || 'E-mail ou senha inválidos.');
            setLoading(false);
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showAlert('danger', 'Erro ao conectar ao servidor. Verifique sua conexão.');
        setLoading(false);
    }
}

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', function() {
    // Carregar tema salvo
    loadSavedTheme();

    // Carregar email lembrado
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }

    // Adicionar efeito de foco nos inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('shadow-sm');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('shadow-sm');
        });
    });
});