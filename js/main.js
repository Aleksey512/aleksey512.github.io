// ============================================
// Main JavaScript
// ============================================

// Ждем загрузки DOM и данных
document.addEventListener('DOMContentLoaded', async () => {
    // Пытаемся загрузить данные
    let data = window.resumeData;
    
    // Если данные еще не загружены, ждем события
    if (!data || Object.keys(data).length === 0) {
        // Ждем загрузки данных резюме
        window.addEventListener('resumeDataLoaded', (e) => {
            initApp(e.detail);
        });
        
        // Также пытаемся загрузить напрямую из window.resumeData
        // (данные должны быть доступны после загрузки data.js)
        if (window.resumeData && Object.keys(window.resumeData).length > 0) {
            data = window.resumeData;
            initApp(data);
        }
    } else {
        initApp(data);
    }
});

// ============================================
// Инициализация приложения
// ============================================

function initApp(data) {
    if (!data) {
        console.error('Данные не переданы в initApp');
        return;
    }
    
    console.log('Инициализация приложения с данными:', data);
    
    initTheme();
    initNavigation();
    initLoader();
    populateContent(data);
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initCurrentYear();
}

// Делаем функцию доступной глобально
window.initApp = initApp;

// ============================================
// Theme Management
// ============================================

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    
    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Применяем тему
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, themeIcon);
    
    // Обработчик переключения темы
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Скролл эффект для навбара
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Мобильное меню
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Активная ссылка при скролле
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Loader
// ============================================

function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });
}

// ============================================
// Populate Content
// ============================================

function populateContent(data) {
    console.log('Заполнение контента данными:', data);
    
    // Hero section
    if (data.personal?.name) {
        const heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = data.personal.name;
    }
    
    if (data.position?.title) {
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) heroTitle.textContent = data.position.title;
    }
    
    // Hero image
    if (data.personal?.image) {
        const imagePlaceholder = document.querySelector('.image-placeholder');
        if (imagePlaceholder) {
            const img = document.createElement('img');
            img.src = data.personal.image;
            img.alt = data.personal.name || 'Фото';
            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);';
            imagePlaceholder.innerHTML = '';
            imagePlaceholder.appendChild(img);
        }
    }
    
    // Hero description
    if (data.about) {
        const heroDescription = document.getElementById('hero-description');
        if (heroDescription) {
            // Берем первые 2 предложения из about для краткого описания
            const sentences = data.about.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const shortDescription = sentences.slice(0, 2).join('. ') + '.';
            heroDescription.textContent = shortDescription;
        }
    }
    
    // Hero social links
    if (data.social) {
        populateHeroSocial(data.social, data.personal);
    }
    
    // Update meta tags
    updateMetaTags(data);
    
    // About section
    if (data.about) {
        const aboutText = document.getElementById('about-text');
        if (aboutText) {
            // Форматируем текст с переносами строк
            aboutText.innerHTML = formatTextWithLineBreaks(data.about);
        }
    }
    
    // Experience
    if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
        console.log('Заполнение опыта работы:', data.experience);
        populateExperience(data.experience);
    } else {
        console.warn('Опыт работы не найден или пуст');
    }
    
    // Skills
    if (data.skills) {
        console.log('Заполнение навыков:', data.skills);
        populateSkills(data.skills, data);
    } else {
        console.warn('Навыки не найдены');
    }
    
    // Education
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
        console.log('Заполнение образования:', data.education);
        populateEducation(data.education, data.certificates || []);
    } else {
        console.warn('Образование не найдено или пусто');
    }
    
    // Contact
    if (data.personal) {
        populateContact(data.personal);
    }
}

// ============================================
// Experience Timeline
// ============================================

function populateExperience(experiences) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    experiences.forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        // Извлекаем технологии из описания
        const techMatches = exp.description.match(/(?:Технологии|Technologies):\s*([^\.\n]+)/i);
        const technologies = techMatches 
            ? techMatches[1].split(',').map(t => t.trim()).filter(t => t.length > 0)
            : [];
        
        // Форматируем описание, убирая строку с технологиями для отдельного отображения
        let description = exp.description;
        if (techMatches) {
            description = description.replace(techMatches[0], '').trim();
        }
        
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h3 class="timeline-company">${escapeHtml(exp.company || '')}</h3>
                    <p class="timeline-position">${escapeHtml(exp.position || '')}</p>
                    <p class="timeline-period">${escapeHtml(exp.period || '')}</p>
                    ${exp.location ? `<p class="timeline-location">${escapeHtml(exp.location)}</p>` : ''}
                    ${exp.duration ? `<p class="timeline-duration">${escapeHtml(exp.duration)}</p>` : ''}
                </div>
                <div class="timeline-description">${formatDescription(description)}</div>
                ${technologies.length > 0 ? `
                    <div class="timeline-tech">
                        ${technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        timeline.appendChild(item);
    });
}

function formatDescription(text) {
    if (!text) return '';
    // Заменяем двойные переносы строк на параграфы, одинарные на <br>
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    return paragraphs.map(p => {
        const formatted = escapeHtml(p.trim()).replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }).join('');
}

function formatTextWithLineBreaks(text) {
    if (!text) return '';
    // Заменяем двойные переносы строк на параграфы, одинарные на <br>
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    return paragraphs.map(p => {
        const formatted = escapeHtml(p.trim()).replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }).join('');
}

// ============================================
// Skills
// ============================================

function populateSkills(skills, fullData) {
    const skillsContent = document.getElementById('skills-content');
    if (!skillsContent) {
        console.error('Элемент skills-content не найден');
        return;
    }
    
    skillsContent.innerHTML = '';
    
    // Категории навыков
    if (skills && skills.categories && Object.keys(skills.categories).length > 0) {
        Object.entries(skills.categories).forEach(([category, items]) => {
            if (!Array.isArray(items) || items.length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            
            const icon = getCategoryIcon(category);
            
            categoryDiv.innerHTML = `
                <h3 class="skill-category-title">
                    <i class="${icon}"></i>
                    ${escapeHtml(category)}
                </h3>
                <div class="skill-tags">
                    ${items.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                </div>
            `;
            
            skillsContent.appendChild(categoryDiv);
        });
    } else {
        console.warn('Категории навыков не найдены или пусты');
    }
    
    // Языки - используем данные из переданного объекта или глобального
    const languages = (fullData && fullData.languages) || window.resumeData?.languages || [];
    if (languages && Array.isArray(languages) && languages.length > 0) {
        const languagesDiv = document.createElement('div');
        languagesDiv.className = 'skill-category';
        
        languagesDiv.innerHTML = `
            <h3 class="skill-category-title">
                <i class="fas fa-language"></i>
                Языки
            </h3>
            <div class="languages-list">
                ${languages.map(lang => `
                    <div class="language-item">
                        <span class="language-name">${escapeHtml(lang.name)}</span>
                        <span class="language-level">${escapeHtml(lang.level)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        skillsContent.appendChild(languagesDiv);
    }
}

function getCategoryIcon(category) {
    const icons = {
        'Backend': 'fas fa-server',
        'DevOps': 'fas fa-cogs',
        'Databases': 'fas fa-database',
        'Message Queues': 'fas fa-exchange-alt',
        'Monitoring': 'fas fa-chart-line',
        'Architecture': 'fas fa-sitemap',
        'Other': 'fas fa-tools'
    };
    return icons[category] || 'fas fa-code';
}

// ============================================
// Education
// ============================================

function populateEducation(education, certificates) {
    const educationContent = document.getElementById('education-content');
    if (!educationContent) {
        console.error('Элемент education-content не найден');
        return;
    }
    
    educationContent.innerHTML = '';
    
    // Образование
    if (education && Array.isArray(education) && education.length > 0) {
        education.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'education-item';
            
            item.innerHTML = `
                <h3 class="education-institution">${escapeHtml(edu.institution || '')}</h3>
                ${edu.faculty ? `<p class="education-details">${escapeHtml(edu.faculty)}</p>` : ''}
                ${edu.specialty ? `<p class="education-details">${escapeHtml(edu.specialty)}</p>` : ''}
                ${edu.level ? `<p class="education-level">${escapeHtml(edu.level)}</p>` : ''}
                ${edu.location ? `<p class="education-location">${escapeHtml(edu.location)}</p>` : ''}
                ${edu.year ? `<p class="education-year">${escapeHtml(edu.year)}</p>` : ''}
            `;
            
            educationContent.appendChild(item);
        });
    } else {
        console.warn('Образование не найдено или пусто');
    }
    
    // Сертификаты
    if (certificates && Array.isArray(certificates) && certificates.length > 0) {
        certificates.forEach(cert => {
            const item = document.createElement('div');
            item.className = 'certificate-item';
            
            const link = cert.link && cert.link.startsWith('http') 
                ? cert.link 
                : (cert.link ? cert.link : null);
            
            item.innerHTML = `
                <h3 class="certificate-name">
                    ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${escapeHtml(cert.name || '')}</a>` : escapeHtml(cert.name || '')}
                </h3>
                ${cert.year ? `<p class="certificate-year">${escapeHtml(cert.year)}</p>` : ''}
            `;
            
            educationContent.appendChild(item);
        });
    }
}

// ============================================
// Hero Social Links
// ============================================

function populateHeroSocial(social, personal) {
    const heroSocial = document.querySelector('.hero-social');
    if (!heroSocial) return;
    
    heroSocial.innerHTML = '';
    
    if (social.github) {
        const link = document.createElement('a');
        link.href = `https://github.com/${social.github}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'GitHub');
        link.innerHTML = '<i class="fab fa-github"></i>';
        heroSocial.appendChild(link);
    }
    
    if (personal?.email) {
        const link = document.createElement('a');
        link.href = `mailto:${personal.email}`;
        link.setAttribute('aria-label', 'Email');
        link.innerHTML = '<i class="fas fa-envelope"></i>';
        heroSocial.appendChild(link);
    }
    
    if (personal?.phone) {
        const link = document.createElement('a');
        link.href = `tel:${personal.phone.replace(/\s/g, '')}`;
        link.setAttribute('aria-label', 'Телефон');
        link.innerHTML = '<i class="fas fa-phone"></i>';
        heroSocial.appendChild(link);
    }
    
    if (social.telegram) {
        const telegramUsername = social.telegram.startsWith('@') ? social.telegram.slice(1) : social.telegram;
        const link = document.createElement('a');
        link.href = `https://t.me/${telegramUsername}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Telegram');
        link.innerHTML = '<i class="fab fa-telegram"></i>';
        heroSocial.appendChild(link);
    }
    
    if (social.linkedin) {
        const link = document.createElement('a');
        link.href = social.linkedin.startsWith('http') ? social.linkedin : `https://linkedin.com/in/${social.linkedin}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'LinkedIn');
        link.innerHTML = '<i class="fab fa-linkedin"></i>';
        heroSocial.appendChild(link);
    }
}

// ============================================
// Contact
// ============================================

function populateContact(personal) {
    const contactItems = document.getElementById('contact-items');
    if (!contactItems) return;
    
    contactItems.innerHTML = '';
    
    if (personal.email) {
        const item = createContactItem('fas fa-envelope', 'Email', personal.email, `mailto:${personal.email}`);
        contactItems.appendChild(item);
    }
    
    if (personal.phone) {
        const item = createContactItem('fas fa-phone', 'Телефон', personal.phone, `tel:${personal.phone.replace(/\s/g, '')}`);
        contactItems.appendChild(item);
    }
    
    if (personal.location) {
        const item = createContactItem('fas fa-map-marker-alt', 'Локация', personal.location);
        contactItems.appendChild(item);
    }
}

function createContactItem(icon, label, value, link = null) {
    const item = document.createElement('div');
    item.className = 'contact-item';
    
    const content = `
        <i class="${icon}"></i>
        <div class="contact-item-content">
            <div class="contact-item-label">${escapeHtml(label)}</div>
            ${link ? 
                `<a href="${link}" class="contact-item-value">${escapeHtml(value)}</a>` :
                `<div class="contact-item-value">${escapeHtml(value)}</div>`
            }
        </div>
    `;
    
    item.innerHTML = content;
    return item;
}

// ============================================
// Contact Form
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // В реальном проекте здесь был бы запрос на сервер
        // Для GitHub Pages используем mailto
        const mailtoLink = `mailto:yakunina1111@gmail.com?subject=Сообщение от ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + '\n\nОт: ' + formData.email)}`;
        window.location.href = mailtoLink;
        
        // Показываем уведомление
        showNotification('Спасибо! Открывается почтовый клиент...');
        
        // Очищаем форму
        form.reset();
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--accent-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Back to Top
// ============================================

function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Current Year
// ============================================

function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Meta Tags
// ============================================

function updateMetaTags(data) {
    // Update title
    if (data.personal?.name && data.position?.title) {
        document.title = `${data.personal.name} | ${data.position.title}`;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && data.about) {
        const shortAbout = data.about.split(/[.!?]+/)[0] + '.';
        metaDescription.setAttribute('content', shortAbout);
    }
    
    // Update og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && data.personal?.name && data.position?.title) {
        ogTitle.setAttribute('content', `${data.personal.name} - ${data.position.title}`);
    }
    
    // Update og:description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && data.about) {
        const shortAbout = data.about.split(/[.!?]+/)[0] + '.';
        ogDescription.setAttribute('content', shortAbout);
    }
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Данные уже доступны через window.resumeData из data.js
