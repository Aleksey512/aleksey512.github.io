/ ============================================
// Animations & Intersection Observer
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initTypingEffect();
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animateElements = document.querySelectorAll(`
        .section-header,
        .about-content,
        .timeline-item,
        .skill-category,
        .education-item,
        .certificate-item,
        .contact-content,
        .highlight-item
    `);
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// Counter Animations
// ============================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+/.test(target);
    
    if (!isNumber) return;
    
    const number = parseInt(target);
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// ============================================
// Parallax Effects
// ============================================

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-gradient');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// Typing Effect (Optional)
// ============================================

function initTypingEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent-primary)';
    
    let index = 0;
    const typingSpeed = 50;
    
    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else {
            // Убираем курсор после завершения
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Запускаем эффект печати только при первом появлении
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                type();
            }
        });
    }, { threshold: 0.5 });
    
    titleObserver.observe(heroTitle);
}

// ============================================
// CSS Animations (добавляем через JS для динамики)
// ============================================

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item.animate-on-scroll {
        opacity: 0;
        transform: translateX(-50px);
    }
    
    .timeline-item:nth-child(even).animate-on-scroll {
        transform: translateX(50px);
    }
    
    .timeline-item.animate-on-scroll.animate-in {
        transform: translateX(0);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .skill-tag {
        animation: fadeInUp 0.3s ease backwards;
    }
    
    .skill-tag:nth-child(1) { animation-delay: 0.1s; }
    .skill-tag:nth-child(2) { animation-delay: 0.2s; }
    .skill-tag:nth-child(3) { animation-delay: 0.3s; }
    .skill-tag:nth-child(4) { animation-delay: 0.4s; }
    .skill-tag:nth-child(5) { animation-delay: 0.5s; }
    .skill-tag:nth-child(n+6) { animation-delay: 0.6s; }
`;
document.head.appendChild(style);
