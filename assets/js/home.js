// Animação de scroll
document.addEventListener('DOMContentLoaded', function() {
    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade-in dos elementos ao scroll
    const fadeElements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Navbar active link
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Navbar shrink on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });

    // Contador animado (opcional)
    const stats = document.querySelectorAll('.stat-item h3');
    let animated = false;

    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 40);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                const targets = ['10000', '50000', '98'];
                stats.forEach((stat, index) => {
                    animateCounter(stat, parseInt(targets[index]));
                });
            }
        });
    }, { threshold: 0.5 });

    if (stats.length > 0) {
        statsObserver.observe(stats[0].parentElement);
    }

    // Newsletter form
    const newsletterInput = document.querySelector('.footer .input-group input');
    const newsletterBtn = document.querySelector('.footer .input-group .btn');

    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterInput.value;
            if (email && email.includes('@')) {
                alert('Inscrição realizada com sucesso! 📧');
                newsletterInput.value = '';
            } else {
                alert('Por favor, insira um e-mail válido.');
            }
        });
    }

    // Botões de navegação
    document.querySelector('.hero-buttons .btn-outline-secondary')?.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('#features');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });

    console.log('🚀 Minhas Tarefas - Home carregada com sucesso!');
});

// Função para scroll suave
function scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// Debounce para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Prevenir double click nos botões
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Efeito de hover nos cards com parallax suave
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});