// Данные резюме
const resumeData = {
  personal: {
    name: "Якунин Алексей",
    image: "assets/me.jpeg",
    get age() {
      const startDate = new Date(2001, 6, 19);
      const endDate = new Date();

      let years = endDate.getFullYear() - startDate.getFullYear();
      return years;
    },
    birth_date: "19 июня 2001",
    phone: "+7 (999) 602-14-78",
    email: "yakunina1111@gmail.com",
    location: "Санкт-Петербург",
    citizenship: "Россия",
    ready_to_relocate: true,
    ready_to_travel: true,
  },
  position: {
    title: "SENIOR PYTHON | GOLANG DEVELOPER",
    salary: "300 000 ₽ на руки",
    employment: ["полная занятость", "частичная занятость", "проектная работа"],
    schedule: ["полный день", "удаленная работа"],
  },
  experience: [
    {
      company: "FinTech / Blockchain-платформа (NDA)",
      location: "Санкт-Петербург",
      industry: "Информационные технологии, системная интеграция, интернет",
      period: "Октябрь 2023 — настоящее время",
      get duration() {
        const startDate = new Date(2023, 7, 1); // Октябрь 2023 (месяцы 0-indexed)
        const endDate = new Date();

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();

        if (months < 0) {
          years--;
          months += 12;
        }

        if (endDate.getDate() < startDate.getDate()) {
          months--;
          if (months < 0) {
            years--;
            months = 11;
          }
        }

        let last_digit = (num) => num % 10;

        return `${years} год${last_digit(years) === 1 ? "" : last_digit(years) >= 2 && last_digit(years) <= 4 ? "а" : "ов"} ${months} месяц${last_digit(months) === 1 ? "" : last_digit(months) >= 2 && last_digit(months) <= 4 ? "а" : "ев"}`;
      },
      position: "Senior Backend Engineer (Python, Go)",
      description:
        "Проектирую и развиваю внутренние сервисы и инфраструктурные компоненты для платформы (Kafka, Kubernetes, PostgreSQL).\n\nКонтролирую качество кода и дизайн решений через code review, внедрение DDD-подхода и gRPC-коммуникаций.\n\nОптимизировал отказоустойчивость и latency: p99 < 200 мс, -70% инцидентов OOM, 100% соответствие SLA.\n\nАвтоматизировал CI/CD-процессы (GitLab + Pants Build), снизив ручные операции на 10+ часов/нед.\n\nНаставляю младших разработчиков: провожу ревью, менторю по архитектуре микросервисов и DevOps-практикам.\n\nТехнологии: Python (FastAPI), Go (Gin), Kafka, PostgreSQL, MongoDB, Kubernetes, gRPC, GitLab CI, Grafana, Sentry, Ansible.\nНавыки: проектирование сервисов, эксплуатация production-сред, менторство, контроль качества кода.",
    },
    {
      company: "Институт системного программирования РАН (ИСП РАН)",
      location: "Москва",
      website: "www.ispras.ru/",
      industry: "Образовательные учреждения, Информационные технологии",
      period: "Июль 2022 — Октябрь 2023",
      duration: "1 год 4 месяца",
      position: "MLOps / Backend Engineer (Python)",
      description:
        "Разрабатывал внутренние инструменты и сервисы для деплоя и мониторинга ML-моделей (TorchServe, MLflow).\n\nПроектировал асинхронные backend-сервисы для обработки и оркестрации вычислительных задач (Celery, Redis/RabbitMQ).\n\nУкрепил стабильность продакшена — 10+ моделей Computer Vision, выдерживающих пиковые нагрузки без деградации.\n\nВнедрил CI/CD и систему контроля версий экспериментов, ускорив цикл вывода новых моделей с 5 дней до 1 дня.\n\nТехнологии: Python (FastAPI, Django), Docker, PostgreSQL, Celery, Redis, RabbitMQ, MLflow, Prometheus.\nНавыки: DevOps-практики, инфраструктурная автоматизация, API-дизайн, мониторинг и observability.",
    },
    {
      company: "Орловский государственный университет им. И.С. Тургенева",
      location: "Орел",
      industry: "Образовательные учреждения",
      period: "Июль 2021 — Июль 2022",
      duration: "1 год 1 месяц",
      position: "Backend Engineer (Geospatial & Real-Time Systems)",
      description:
        "Создал внутренний инструмент диспетчеризации с обработкой заявок в реальном времени (WebSocket, Django).\n\nИнтегрировал PostGIS и геоаналитику для контроля и визуализации инфраструктурных данных.\n\nНастроил мониторинг и оповещения (Prometheus, Grafana), сократив MTTR на 40%.\n\nКонтейнеризировал и автоматизировал деплой (Docker, Nginx) для повышения надёжности в эксплуатации.\n\nТехнологии: Python (Django, Channels), PostgreSQL/PostGIS, WebSocket, Docker, Prometheus, Grafana.\nНавыки: разработка систем контроля и поддержки, эксплуатация сервисов, проектирование архитектуры.",
    },
  ],
  education: [
    {
      institution: "Орловский государственный университет им. И.С. Тургенева",
      location: "Орел",
      year: "2021",
      level: "Среднее специальное",
      faculty: "Факультет среднего профессионального образования",
      specialty: "Информационные системы и технологии",
    },
  ],
  certificates: [
    {
      name: "Сертификат об уровне владения английским языком - EFSET",
      link: "https://cert.efset.org/ru/MbpS8L",
      year: "2024",
    },
    {
      name: "Патент для программы <<ВЗУконтроль>>",
      link: "assets/vzupatent.jpeg",
      year: "2022",
    },
  ],
  skills: {
    technical: [
      "Python",
      "Golang",
      "Go",
      "Gin",
      "FastAPI",
      "Django Framework",
      "Docker",
      "Kubernetes",
      "Ansible",
      "CI/CD",
      "Linux",
      "gRPC",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Apache Kafka",
      "RabbitMQ",
      "Grafana",
      "Prometheus",
      "DDD",
      "Clean Architecture",
      "DevOps",
      "QA",
      "Git",
      "Postgres",
      "REST",
      "Django",
      "Kafka",
      "SQL",
      "Управление командой",
    ],
    categories: {
      Backend: [
        "Python",
        "Golang",
        "Go",
        "Gin",
        "FastAPI",
        "Django Framework",
        "gRPC",
        "REST",
      ],
      DevOps: ["Docker", "Kubernetes", "Ansible", "CI/CD", "Linux"],
      Databases: ["PostgreSQL", "Postgres", "MongoDB", "Redis", "SQL"],
      "Message Queues": ["Apache Kafka", "Kafka", "RabbitMQ"],
      Monitoring: ["Grafana", "Prometheus"],
      Architecture: ["DDD", "Clean Architecture"],
      Other: ["DevOps", "QA", "Git", "Управление командой"],
    },
  },
  languages: [
    {
      name: "Русский",
      level: "Родной",
    },
    {
      name: "Английский",
      level: "B1 — Средний",
    },
    {
      name: "Украинский",
      level: "C2 — В совершенстве",
    },
  ],
  about:
    "Разрабатываю и поддерживаю внутренние инструменты, инфраструктурные сервисы и микросистемы под production и development.\n\n5 лет коммерческого опыта: проектирование, автоматизация, CI/CD, observability, оптимизация под highload.\n\nСильные стороны — системное мышление, архитектурная культура и готовность развивать команду через менторинг и код-ревью.\n\nИз неочевидного: изучаю психологию коммуникаций — это помогает выстраивать процессы без «узких мест» в общении. А еще заряжаюсь энергией, играя на гитаре — иногда лучшие решения приходят под риффы Metallica.",
  recommendations: [
    {
      organization:
        "Инжиниринговый центр технологии цифровой среды, Орловский государственный университет им. И. С. Тургенева",
      contact: "Кичкин Борис (к. т. н, доцент, руководитель проекта)",
    },
  ],
  social: {
    github: "aleksey512",
    linkedin: "",
    telegram: "@uakunin",
  },
};

// Экспортируем данные для использования в других скриптах
if (typeof window !== "undefined") {
  window.resumeData = resumeData;
}
