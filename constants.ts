
import { EducationLevel, Job, Stock, Course, JobCategory, Language } from './types';

export const MAX_YEARS = 10;
export const MAX_MONTHS = MAX_YEARS * 12;
export const STARTING_AGE_MONTHS = 18 * 12;

// --- TRANSLATIONS ---

export const EDUCATION_TITLES: Record<Language, Record<EducationLevel, string>> = {
  ru: {
    [EducationLevel.NONE]: 'Без образования',
    [EducationLevel.HIGH_SCHOOL]: 'Среднее общее',
    [EducationLevel.BACHELOR]: 'Бакалавр',
    [EducationLevel.MASTER]: 'Магистр',
    [EducationLevel.MBA]: 'MBA'
  },
  en: {
    [EducationLevel.NONE]: 'No Education',
    [EducationLevel.HIGH_SCHOOL]: 'High School',
    [EducationLevel.BACHELOR]: 'Bachelor',
    [EducationLevel.MASTER]: 'Master',
    [EducationLevel.MBA]: 'MBA'
  }
};

export const CATEGORY_NAMES: Record<Language, Record<JobCategory, string>> = {
  ru: {
    service: 'Сфера услуг',
    business: 'Бизнес и Финансы',
    tech: 'IT и Разработка',
    medical: 'Медицина'
  },
  en: {
    service: 'Service Industry',
    business: 'Business & Finance',
    tech: 'Tech & IT',
    medical: 'Healthcare'
  }
};

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.overview': { ru: 'Сводка', en: 'Overview' },
  'nav.education': { ru: 'Образование', en: 'Education' },
  'nav.jobs': { ru: 'Карьера', en: 'Career' },
  'nav.market': { ru: 'Рынки', en: 'Markets' },
  'nav.bank': { ru: 'Банк', en: 'Bank' },
  'nav.time': { ru: 'Время', en: 'Time' },
  'nav.year': { ru: 'Г.', en: 'Y' },
  'nav.month': { ru: 'М.', en: 'M' },
  
  // Header
  'header.cash': { ru: 'Наличные', en: 'Cash' },
  'header.next_month': { ru: 'След. месяц', en: 'Next Month' },
  'header.game_over': { ru: 'Конец', en: 'Game Over' },
  'header.loading': { ru: '...', en: '...' },

  // Overview
  'overview.net_worth': { ru: 'Чистый капитал', en: 'Net Worth' },
  'overview.income': { ru: 'Текущий доход', en: 'Current Income' },
  'overview.per_month': { ru: '/мес', en: '/mo' },
  'overview.debt': { ru: 'Текущий долг', en: 'Current Debt' },
  'overview.history': { ru: 'История капитала', en: 'Net Worth History' },
  'overview.exp': { ru: 'Трудовой стаж', en: 'Work Experience' },
  'overview.years': { ru: 'лет', en: 'yrs' },
  'overview.logs': { ru: 'Журнал событий', en: 'Event Log' },
  'overview.intensity.relaxed': { ru: 'Режим: Вполсилы (-20%)', en: 'Mode: Relaxed (-20%)' },
  'overview.intensity.hard': { ru: 'Режим: На износ (+20%)', en: 'Mode: Hardcore (+20%)' },

  // Education
  'edu.degrees': { ru: 'Академические степени', en: 'Academic Degrees' },
  'edu.degrees_desc': { ru: 'Необходимы для доступа к руководящим должностям. Получаются последовательно.', en: 'Required for senior positions. Must be obtained sequentially.' },
  'edu.courses': { ru: 'Курсы повышения квалификации', en: 'Professional Courses' },
  'edu.courses_desc': { ru: 'Краткосрочные курсы, навсегда увеличивающие базовый доход.', en: 'Short-term courses that permanently boost your base income.' },
  'edu.cost': { ru: 'Стоимость', en: 'Cost' },
  'edu.duration': { ru: 'Срок', en: 'Duration' },
  'edu.start': { ru: 'Начать', en: 'Start' },
  'edu.buy': { ru: 'Купить', en: 'Buy' },
  'edu.owned': { ru: 'Получено', en: 'Owned' },
  'edu.months': { ru: 'мес.', en: 'mo.' },

  // Jobs
  'jobs.your_job': { ru: 'Текущая должность', en: 'Current Position' },
  'jobs.industry': { ru: 'Индустрия', en: 'Industry' },
  'jobs.intensity': { ru: 'Интенсивность', en: 'Work Intensity' },
  'jobs.quit': { ru: 'Уволиться', en: 'Quit Job' },
  'jobs.unemployed': { ru: 'Вы безработный', en: 'Unemployed' },
  'jobs.apply': { ru: 'Устроиться', en: 'Apply' },
  'jobs.unavailable': { ru: 'Недоступно', en: 'Locked' },
  'jobs.req_edu': { ru: 'Треб. образование', en: 'Req. Education' },
  'jobs.req_exp': { ru: 'Треб. опыт', en: 'Req. Experience' },
  'jobs.mode_relaxed': { ru: 'Расслабленно', en: 'Relaxed' },
  'jobs.mode_normal': { ru: 'Стандарт', en: 'Standard' },
  'jobs.mode_hard': { ru: 'На износ', en: 'Hardcore' },
  'jobs.details_relaxed': { ru: 'Доход -20%, Опыт x0.5, Без стресса', en: 'Income -20%, XP x0.5, No Stress' },
  'jobs.details_normal': { ru: 'Стандартный доход и опыт', en: 'Standard Income & XP' },
  'jobs.details_hard': { ru: 'Доход +20%, Опыт x1.5, Риск!', en: 'Income +20%, XP x1.5, Risk!' },

  // Market
  'market.liquidity': { ru: 'Ликвидность', en: 'Liquidity' },
  'market.portfolio': { ru: 'Портфель', en: 'Portfolio' },
  'market.trend': { ru: 'Тренд рынка', en: 'Market Trend' },
  'market.stocks': { ru: 'Акции', en: 'Stocks' },
  'market.crypto': { ru: 'Крипта', en: 'Crypto' },
  'market.owned': { ru: 'Счет', en: 'Owned' },
  'market.avg': { ru: 'Ср.Цена', en: 'Avg.Cost' },
  'market.buy_max': { ru: 'МАКС', en: 'MAX' },
  'market.sell_all': { ru: 'ПРОДАТЬ', en: 'SELL' },
  'market.trade': { ru: 'Торговать', en: 'Trade' },
  'market.my_assets': { ru: 'Ваши активы', en: 'Your Assets' },

  // Trade Modal
  'trade.title': { ru: 'Торговля', en: 'Trading' },
  'trade.buy': { ru: 'Купить', en: 'Buy' },
  'trade.sell': { ru: 'Продать', en: 'Sell' },
  'trade.amount': { ru: 'Сумма ($)', en: 'Amount ($)' },
  'trade.quantity': { ru: 'Количество', en: 'Quantity' },
  'trade.est_qty': { ru: 'Примерно:', en: 'Approx:' },
  'trade.max': { ru: 'Макс', en: 'Max' },
  'trade.confirm': { ru: 'Подтвердить', en: 'Confirm' },
  'trade.cancel': { ru: 'Отмена', en: 'Cancel' },

  // Bank
  'bank.credit_dept': { ru: 'Кредитный департамент', en: 'Credit Department' },
  'bank.score': { ru: 'Кредитный скоринг', en: 'Credit Score' },
  'bank.limit': { ru: 'Кредитный лимит', en: 'Credit Limit' },
  'bank.take_loan': { ru: 'Взять кредит', en: 'Take Loan' },
  'bank.repay': { ru: 'Погасить долг', en: 'Repay Debt' },
  'bank.all': { ru: 'Всё', en: 'All' },
  'bank.deposit_dept': { ru: 'Инвестиционный банк', en: 'Investment Bank' },
  'bank.savings': { ru: 'Сберегательный счет', en: 'Savings Account' },
  'bank.deposit_add': { ru: 'Пополнить вклад', en: 'Deposit Funds' },
  'bank.deposit_withdraw': { ru: 'Снять средства', en: 'Withdraw Funds' },
  'bank.from_cash': { ru: 'Из наличных', en: 'From Cash' },
  'bank.to_hand': { ru: 'На руки', en: 'To Cash' },
  'bank.advice': { ru: 'Совет', en: 'Tip' },
  'bank.advice_text': { 
    ru: 'Держите рейтинг выше 750 для лучших ставок. Сложный процент на вкладе — ваш друг.', 
    en: 'Keep your score above 750 for best rates. Compound interest is your friend.' 
  },

  // Game End
  'end.title': { ru: 'Финал игры', en: 'Game Over' },
  'end.subtitle': { ru: 'Ваш итоговый капитал:', en: 'Final Net Worth:' },

  // Settings
  'settings.title': { ru: 'Настройки', en: 'Settings' },
  'settings.lang': { ru: 'Язык / Language', en: 'Language' },
  'settings.reset': { ru: 'Сбросить прогресс', en: 'Reset Progress' },
  
  // Admin
  'admin.title': { ru: 'Панель администратора', en: 'Admin Panel' },
  'admin.locked': { ru: 'Доступ ограничен', en: 'Restricted Access' },
  'admin.enter_pin': { ru: 'Введите PIN', en: 'Enter PIN' },
  'admin.unlock': { ru: 'Открыть', en: 'Unlock' },
  'admin.add_cash': { ru: 'Добавить денег', en: 'Add Cash' },
  'admin.set_score': { ru: 'Кредитный рейтинг', en: 'Credit Score' },
  'admin.set_edu': { ru: 'Образование', en: 'Education' },
  'admin.set_job': { ru: 'Должность', en: 'Job' },
  'admin.cheat_activated': { ru: 'Чит активирован', en: 'Cheat Activated' },
  'admin.access_granted': { ru: 'Режим бога включен', en: 'God Mode Enabled' },
  'admin.wrong_pin': { ru: 'Неверный PIN', en: 'Wrong PIN' },
};

// --- DATA CONSTANTS ---

export const EDUCATION_COSTS = {
  [EducationLevel.HIGH_SCHOOL]: 500,
  [EducationLevel.BACHELOR]: 20000,
  [EducationLevel.MASTER]: 50000,
  [EducationLevel.MBA]: 80000,
};

export const EDUCATION_DURATIONS = {
    [EducationLevel.HIGH_SCHOOL]: 3,
    [EducationLevel.BACHELOR]: 6, 
    [EducationLevel.MASTER]: 4,
    [EducationLevel.MBA]: 5,
};

export const COURSES: Course[] = [
  { 
    id: 'c_soft', 
    title: 'Тренинг Soft Skills', 
    titleEn: 'Soft Skills Training',
    cost: 3000, 
    salaryMultiplier: 0.10,
    description: 'Навыки коммуникации. +10% к доходу.',
    descriptionEn: 'Communication skills. +10% income.',
    durationMonths: 2
  },
  { 
    id: 'c_tech_boot', 
    title: 'IT Буткемп', 
    titleEn: 'IT Bootcamp',
    cost: 8000, 
    salaryMultiplier: 0.15,
    description: 'Интенсив по технологиям. +15% к доходу.',
    descriptionEn: 'Tech intensive. +15% income.',
    durationMonths: 4
  },
  { 
    id: 'c_manage', 
    title: 'Эффективный менеджмент', 
    titleEn: 'Effective Management',
    cost: 15000, 
    salaryMultiplier: 0.20,
    description: 'Управление командой. +20% к доходу.',
    descriptionEn: 'Team leadership. +20% income.',
    durationMonths: 5
  },
  { 
    id: 'c_invest', 
    title: 'Финансовая грамотность', 
    titleEn: 'Financial Literacy',
    cost: 25000, 
    salaryMultiplier: 0.25,
    description: 'Умение управлять капиталом. +25% к доходу.',
    descriptionEn: 'Capital management. +25% income.',
    durationMonths: 6
  }
];

export const INITIAL_STOCKS: Stock[] = [
  { 
    symbol: 'TECH', 
    name: 'MacroSoft', 
    nameEn: 'MacroSoft',
    type: 'stock',
    price: 150, 
    owned: 0, 
    averageCost: 0,
    history: [150], 
    volatility: 0.15, 
    trend: 0.005,
    dividendYield: 0.015 
  },
  { 
    symbol: 'AUTO', 
    name: 'TeslaMotors', 
    nameEn: 'TeslaMotors',
    type: 'stock',
    price: 80, 
    owned: 0, 
    averageCost: 0,
    history: [80], 
    volatility: 0.25, 
    trend: 0.002,
    dividendYield: 0.0 
  },
  { 
    symbol: 'FOOD', 
    name: 'BurgerKing', 
    nameEn: 'BurgerKing',
    type: 'stock',
    price: 40, 
    owned: 0, 
    averageCost: 0,
    history: [40], 
    volatility: 0.08, 
    trend: 0.001,
    dividendYield: 0.045 
  },
  { 
    symbol: 'GOLD', 
    name: 'GoldIndex', 
    nameEn: 'GoldIndex',
    type: 'stock',
    price: 200, 
    owned: 0, 
    averageCost: 0,
    history: [200], 
    volatility: 0.05, 
    trend: 0.003,
    dividendYield: 0.0
  },
  // --- CRYPTO ---
  // Type 1: Stable/Mean Reverting
  { 
    symbol: 'ZETA', 
    name: 'ZetaCoin', 
    nameEn: 'ZetaCoin',
    type: 'crypto',
    price: 10, 
    owned: 0, 
    averageCost: 0,
    history: [10], 
    volatility: 0.15, // Low for crypto
    trend: 0.0,
    dividendYield: 0.0
  },
  // Type 2: Classic 1
  { 
    symbol: 'BTC', 
    name: 'BitCash', 
    nameEn: 'BitCash',
    type: 'crypto',
    price: 1200, 
    owned: 0, 
    averageCost: 0,
    history: [1200], 
    volatility: 0.50, 
    trend: 0.005,
    dividendYield: 0.0
  },
  // Type 2: Classic 2
  { 
    symbol: 'LITE', 
    name: 'LiteChain', 
    nameEn: 'LiteChain',
    type: 'crypto',
    price: 150, 
    owned: 0, 
    averageCost: 0,
    history: [150], 
    volatility: 0.60, 
    trend: 0.003,
    dividendYield: 0.0
  },
  // Type 3: Volatile (Pump & Dump)
  { 
    symbol: 'MOON', 
    name: 'RocketToken', 
    nameEn: 'RocketToken',
    type: 'crypto',
    price: 2.00, 
    owned: 0, 
    averageCost: 0,
    history: [2.00], 
    volatility: 1.0, 
    trend: 0.0,
    dividendYield: 0.0
  },
];

export const JOBS: Job[] = [
  // --- SERVICE ---
  { id: 'srv_fastfood', title: 'Сотрудник фастфуда', titleEn: 'Fast Food Crew', category: 'service', salary: 1200, reqEducation: EducationLevel.NONE, reqExpYears: 0 },
  { id: 'srv_janitor', title: 'Уборщик', titleEn: 'Cleaner', category: 'service', salary: 1600, reqEducation: EducationLevel.NONE, reqExpYears: 0 },
  { id: 'srv_cashier', title: 'Кассир', titleEn: 'Cashier', category: 'service', salary: 2200, reqEducation: EducationLevel.NONE, reqExpYears: 0 },
  { id: 'srv_handyman', title: 'Грузчик', titleEn: 'Loader', category: 'service', salary: 3000, reqEducation: EducationLevel.NONE, reqExpYears: 0 },

  // --- BUSINESS ---
  { id: 'biz_sec', title: 'Секретарь', titleEn: 'Secretary', category: 'business', salary: 3200, reqEducation: EducationLevel.HIGH_SCHOOL, reqExpYears: 0 },
  { id: 'biz_man', title: 'Менеджер', titleEn: 'Manager', category: 'business', salary: 5000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 1 },
  { id: 'biz_acc', title: 'Главный бухгалтер', titleEn: 'Chief Accountant', category: 'business', salary: 8500, reqEducation: EducationLevel.BACHELOR, reqExpYears: 2.5 },
  { id: 'biz_head', title: 'Нач. фин. отдела', titleEn: 'Head of Finance', category: 'business', salary: 15000, reqEducation: EducationLevel.MASTER, reqExpYears: 4 },
  { id: 'biz_ceo', title: 'Генеральный директор', titleEn: 'CEO', category: 'business', salary: 65000, reqEducation: EducationLevel.MBA, reqExpYears: 6 },

  // --- TECH ---
  { id: 'tech_jun', title: 'Junior Developer', titleEn: 'Junior Developer', category: 'tech', salary: 5000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 0 },
  { id: 'tech_mid', title: 'Middle Developer', titleEn: 'Middle Developer', category: 'tech', salary: 9000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 1 },
  { id: 'tech_sen', title: 'Senior Developer', titleEn: 'Senior Developer', category: 'tech', salary: 16000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 2.5 },
  { id: 'tech_cto', title: 'CTO (Тех. Директор)', titleEn: 'CTO', category: 'tech', salary: 45000, reqEducation: EducationLevel.MBA, reqExpYears: 4 },

  // --- MEDICINE ---
  { id: 'med_ord', title: 'Санитар', titleEn: 'Orderly', category: 'medical', salary: 2500, reqEducation: EducationLevel.HIGH_SCHOOL, reqExpYears: 0 },
  { id: 'med_res', title: 'Резидент', titleEn: 'Resident', category: 'medical', salary: 4000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 0.5 },
  { id: 'med_nurse', title: 'Операционная м/с', titleEn: 'Surgical Nurse', category: 'medical', salary: 6000, reqEducation: EducationLevel.BACHELOR, reqExpYears: 1 },
  { id: 'med_anes', title: 'Анестезиолог', titleEn: 'Anesthesiologist', category: 'medical', salary: 12000, reqEducation: EducationLevel.MASTER, reqExpYears: 2 },
  { id: 'med_asst', title: 'Ассистент хирурга', titleEn: 'Surgical Assistant', category: 'medical', salary: 20000, reqEducation: EducationLevel.MASTER, reqExpYears: 3 },
  { id: 'med_surg', title: 'Ведущий Хирург', titleEn: 'Lead Surgeon', category: 'medical', salary: 48000, reqEducation: EducationLevel.MASTER, reqExpYears: 4 }, 
];
