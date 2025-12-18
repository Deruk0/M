
export type Language = 'ru' | 'en';

export enum EducationLevel {
  NONE = 'NONE',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  MBA = 'MBA'
}

export type JobCategory = 'service' | 'business' | 'tech' | 'medical';

export interface Course {
  id: string;
  title: string; // Russian (default)
  titleEn: string; // English
  cost: number;
  salaryMultiplier: number; // 0.1 = +10% salary
  description: string;
  descriptionEn: string;
  durationMonths: number;
}

export interface Job {
  id: string;
  title: string;
  titleEn: string;
  category: JobCategory;
  salary: number; // Monthly
  reqEducation: EducationLevel;
  reqExpYears: number; // Years in specific category
}

export interface Stock {
  symbol: string;
  name: string;
  nameEn: string;
  type: 'stock' | 'crypto'; // New field
  price: number;
  owned: number;
  averageCost: number; // Average buy price to calculate profit/loss
  history: number[];
  volatility: number; // 0.05 = 5% swing
  trend: number; // slight bias
  dividendYield: number; // Annual dividend percentage (0.04 = 4%)
}

export interface PlayerState {
  age: number; // Keep internally for logic if needed, but won't display
  gameMonth: number; // 0 to 240 (20 years)
  cash: number;
  
  // Banking System
  debt: number;
  creditScore: number; // 300 to 850
  creditLimit: number;
  loanRate: number; // Annual interest rate for loans (e.g. 0.15 for 15%)
  
  deposit: number;
  depositRate: number; // Annual interest rate for savings (e.g. 0.05 for 5%)

  netWorth: number;
  education: EducationLevel;
  courses: string[]; // IDs of completed courses
  activeCourse: { id: string; monthsLeft: number; type: 'edu' | 'course' } | null; // Currently studying
  experience: Record<JobCategory, number>;
  currentJob: Job | null;
  workIntensity: 'relaxed' | 'normal' | 'hard'; // New mechanic
  stocks: Stock[];
  history: { month: number; netWorth: number }[];
  isGameOver: boolean;
  messages: LogMessage[];
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'danger' | 'warning';
  date: string;
}

export interface GameEvent {
  description: string;
  cashImpact: number;
  marketImpact: 'bull' | 'bear' | 'neutral';
}
