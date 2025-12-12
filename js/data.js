// Данные резюме загружаются из data.js
let resumeData = {};

// Загружаем данные из JS файла
function loadResumeData() {
    try {
        // Данные уже должны быть доступны через window.resumeData из data.js
        if (typeof window !== 'undefined' && window.resumeData) {
            resumeData = window.resumeData;
            return resumeData;
        }
        // Если данные еще не загружены, возвращаем fallback
        console.warn('Данные из data.js еще не загружены, используем fallback');
        return getFallbackData();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Fallback данные на случай ошибки
        return getFallbackData();
    }
}

// Fallback данные (на случай если data.js не загрузится)
function getFallbackData() {
    return {
        personal: {
            name: "Якунин Алексей",
            email: "yakunina1111@gmail.com",
            phone: "+7 (999) 6021478",
            location: "Санкт-Петербург"
        },
        position: {
            title: "SENIOR PYTHON | GOLANG DEVELOPER"
        },
        about: "Разрабатываю и поддерживаю внутренние инструменты, инфраструктурные сервисы и микросистемы под production и development.",
        experience: [],
        skills: { technical: [], categories: {} },
        languages: [],
        education: [],
        certificates: []
    };
}

// Инициализация данных при загрузке страницы
(function() {
    try {
        // Ждем загрузки data.js скрипта
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeData();
            });
        } else {
            // DOM уже загружен, но data.js может еще загружаться
            // Используем небольшую задержку для гарантии загрузки data.js
            setTimeout(initializeData, 10);
        }
    } catch (error) {
        console.error('Критическая ошибка загрузки данных:', error);
    }
    
    function initializeData() {
        const data = loadResumeData();
        resumeData = data;
        
        // Убеждаемся, что данные доступны глобально
        if (!window.resumeData) {
            window.resumeData = data;
        }
        
        // Уведомляем другие скрипты о готовности данных
        const event = new CustomEvent('resumeDataLoaded', { detail: data });
        window.dispatchEvent(event);
        
        // Вызываем initApp если он уже определен
        if (window.initApp && typeof window.initApp === 'function') {
            window.initApp(data);
        }
    }
})();

// Экспортируем для использования в других скриптах
window.loadResumeData = loadResumeData;
