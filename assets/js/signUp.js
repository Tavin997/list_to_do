// assets/js/signUp.js - JavaScript do formulário de cadastro

/**
 * ====================================
 * FUNÇÕES DE TEMA (CLARO/ESCURO)
 * ====================================
 */

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

// Restaurar tema salvo
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

/**
 * ====================================
 * FUNÇÕES DE SENHA
 * ====================================
 */

function togglePassword(fieldId, iconId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(iconId);

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

function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

    // Atualizar lista de requisitos
    document.getElementById('reqLength').innerHTML = requirements.length ? '✓ Mínimo 6 caracteres' : '✗ Mínimo 6 caracteres';
    document.getElementById('reqUppercase').innerHTML = requirements.uppercase ? '✓ Pelo menos uma letra maiúscula' : '✗ Pelo menos uma letra maiúscula';
    document.getElementById('reqLowercase').innerHTML = requirements.lowercase ? '✓ Pelo menos uma letra minúscula' : '✗ Pelo menos uma letra minúscula';
    document.getElementById('reqNumber').innerHTML = requirements.number ? '✓ Pelo menos um número' : '✗ Pelo menos um número';

    document.getElementById('reqLength').className = requirements.length ? 'valid' : 'invalid';
    document.getElementById('reqUppercase').className = requirements.uppercase ? 'valid' : 'invalid';
    document.getElementById('reqLowercase').className = requirements.lowercase ? 'valid' : 'invalid';
    document.getElementById('reqNumber').className = requirements.number ? 'valid' : 'invalid';

    if (requirements.length) strength++;
    if (requirements.uppercase) strength++;
    if (requirements.lowercase) strength++;
    if (requirements.number) strength++;

    // Atualizar barra de força
    const strengthBar = document.getElementById('strengthBar');
    strengthBar.className = 'strength-bar-fill';

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-bar-fill';
    } else if (strength <= 1) {
        strengthBar.classList.add('strength-weak');
    } else if (strength === 2) {
        strengthBar.classList.add('strength-medium');
    } else if (strength === 3) {
        strengthBar.classList.add('strength-strong');
    } else {
        strengthBar.classList.add('strength-very-strong');
    }

    return strength === 4;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * ====================================
 * FUNÇÃO PRINCIPAL - ENVIO DO FORMULÁRIO
 * ====================================
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // ========================================
        // 1. VALIDAÇÕES CLIENT-SIDE
        // ========================================

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('termsCheckbox').checked;

        // Validar nome
        if (name.trim().length < 3) {
            showAlert('danger', 'Por favor, insira seu nome completo (mínimo 3 caracteres)');
            return;
        }

        // Validar email
        if (!validateEmail(email)) {
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('email').classList.add('is-invalid');
            return;
        } else {
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('email').classList.remove('is-invalid');
        }

        // Validar força da senha
        const isStrongPassword = checkPasswordStrength(password);
        if (!isStrongPassword) {
            showAlert('danger', 'Por favor, crie uma senha mais forte atendendo a todos os requisitos');
            return;
        }

        // Validar confirmação de senha
        if (password !== confirmPassword) {
            document.getElementById('confirmError').style.display = 'block';
            document.getElementById('confirmPassword').classList.add('is-invalid');
            return;
        } else {
            document.getElementById('confirmError').style.display = 'none';
            document.getElementById('confirmPassword').classList.remove('is-invalid');
        }

        // Validar termos
        if (!termsAccepted) {
            showAlert('warning', 'Você precisa aceitar os Termos de Serviço e Política de Privacidade');
            return;
        }

        // ========================================
        // 2. PREPARAR DADOS PARA ENVIO
        // ========================================

        const userData = {
            name: name,
            email: email,
            password: password
        };

        // ========================================
        // 3. MOSTRAR LOADING
        // ========================================

        const submitBtn = document.getElementById('submitBtn');
        const btnOriginalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cadastrando...';
        submitBtn.disabled = true;

        try {
            // ========================================
            // 4. ENVIAR PARA O BACKEND VIA FETCH
            // ========================================

            const response = await fetch('https://list-to-do-cijf.onrender.com/banco-dados/cadastroUsuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // ========================================
            // 5. PROCESSAR RESPOSTA DO BACKEND
            // ========================================

            const result = await response.json();

            // Remover loading
            submitBtn.innerHTML = btnOriginalText;
            submitBtn.disabled = false;

            if (result.sucesso) {
                // Cadastro bem-sucedido!
                showAlert('success', '✅ ' + result.mensagem);

                // Limpar formulário
                form.reset();
                document.getElementById('strengthBar').style.width = '0%';
                document.getElementById('strengthBar').className = 'strength-bar-fill';

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = result.redirect || 'login.html';
                }, 2000);

            } else {
                // Erro no cadastro
                showAlert('danger', '❌ ' + result.mensagem);

                // Se o erro for de email, marcar o campo
                if (result.campo === 'email') {
                    document.getElementById('email').classList.add('is-invalid');
                    document.getElementById('emailError').textContent = result.mensagem;
                    document.getElementById('emailError').style.display = 'block';
                }
            }

        } catch (error) {
            // ========================================
            // 6. ERRO NA REQUISIÇÃO
            // ========================================

            console.error('Erro na requisição:', error);
            submitBtn.innerHTML = btnOriginalText;
            submitBtn.disabled = false;

            showAlert('danger', '❌ Erro de conexão com o servidor. Tente novamente.');
        }
    });

    /**
     * ====================================
     * EVENTOS DE VALIDAÇÃO EM TEMPO REAL
     * ====================================
     */

    // Validar força da senha enquanto digita
    document.getElementById('password').addEventListener('input', function() {
        checkPasswordStrength(this.value);
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (confirmPassword && this.value !== confirmPassword) {
            document.getElementById('confirmError').style.display = 'block';
            document.getElementById('confirmPassword').classList.add('is-invalid');
        } else if (confirmPassword) {
            document.getElementById('confirmError').style.display = 'none';
            document.getElementById('confirmPassword').classList.remove('is-invalid');
        }
    });

    // Validar confirmação de senha
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        if (this.value !== password) {
            document.getElementById('confirmError').style.display = 'block';
            this.classList.add('is-invalid');
        } else {
            document.getElementById('confirmError').style.display = 'none';
            this.classList.remove('is-invalid');
        }
    });

    // Validar email em tempo real
    document.getElementById('email').addEventListener('input', function() {
        if (validateEmail(this.value)) {
            document.getElementById('emailError').style.display = 'none';
            this.classList.remove('is-invalid');
        }
    });

    // Efeitos de foco nos inputs
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

/**
 * ====================================
 * FUNÇÃO PARA EXIBIR ALERTAS
 * ====================================
 */

function showAlert(type, message) {
    // Remover alertas anteriores
    const existingAlert = document.querySelector('.alert-custom');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Inserir no topo do formulário
    const form = document.getElementById('registerForm');
    form.insertBefore(alertDiv, form.firstChild);

    // Auto-fechar após 5 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert-custom');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}