
import { useState, useCallback, useEffect } from 'react';
import { PlayerState, Stock, Job, EducationLevel, LogMessage, Course, JobCategory, Language } from '../types';
import { INITIAL_STOCKS, JOBS, MAX_MONTHS, STARTING_AGE_MONTHS, EDUCATION_COSTS, MAX_YEARS, COURSES, EDUCATION_DURATIONS, CATEGORY_NAMES, TRANSLATIONS, EDUCATION_TITLES } from '../constants';
import { generateGameEvent, isAiEnabled } from '../services/geminiService';

export const useGame = (language: Language) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [state, setState] = useState<PlayerState>({
    age: STARTING_AGE_MONTHS,
    gameMonth: 0,
    cash: 5000,
    
    // Banking Defaults
    debt: 0,
    creditScore: 650, 
    creditLimit: 10000,
    loanRate: 0.15,
    deposit: 0,
    depositRate: 0.04,

    netWorth: 5000,
    education: EducationLevel.NONE,
    courses: [],
    activeCourse: null,
    experience: {
      service: 0,
      business: 0,
      tech: 0,
      medical: 0
    },
    currentJob: null,
    workIntensity: 'normal',
    stocks: JSON.parse(JSON.stringify(INITIAL_STOCKS)), 
    history: [{ month: 0, netWorth: 5000 }],
    isGameOver: false,
    messages: []
  });

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  }, [language]);

  const getJobTitle = useCallback((job: Job) => language === 'ru' ? job.title : job.titleEn, [language]);
  const getCourseTitle = useCallback((c: Course) => language === 'ru' ? c.title : c.titleEn, [language]);
  const getCourseDesc = useCallback((c: Course) => language === 'ru' ? c.description : c.descriptionEn, [language]);
  const getStockName = useCallback((s: Stock) => language === 'ru' ? s.name : s.nameEn, [language]);
  const getEduTitle = useCallback((lvl: EducationLevel) => EDUCATION_TITLES[language][lvl], [language]);
  const getCatName = useCallback((cat: JobCategory) => CATEGORY_NAMES[language][cat], [language]);

  // Init welcome message
  useEffect(() => {
    if (state.gameMonth === 0 && state.messages.length === 0) {
       const welcomeText = language === 'ru' 
         ? `Добро пожаловать! Ваша цель: заработать максимум за ${MAX_YEARS} лет.`
         : `Welcome! Your goal is to maximize wealth in ${MAX_YEARS} years.`;
       
       addLog(welcomeText, 'info');

       if (!isAiEnabled()) {
         const warningText = language === 'ru'
            ? "ВНИМАНИЕ: API ключ не найден (.env). ИИ события отключены."
            : "WARNING: API Key missing (.env). AI events disabled.";
         addLog(warningText, 'danger');
       }
    }
  }, []);

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      messages: [{
        id: Math.random().toString(36),
        text,
        type,
        date: `${TRANSLATIONS['nav.year'][language]}${Math.floor(prev.gameMonth / 12) + 1} ${TRANSLATIONS['nav.month'][language]}${(prev.gameMonth % 12) + 1}`
      }, ...prev.messages].slice(0, 50) 
    }));
  };

  const calculateNetWorth = useCallback((cash: number, debt: number, deposit: number, stocks: Stock[]) => {
    const stockValue = stocks.reduce((acc, s) => acc + (s.price * s.owned), 0);
    return cash + deposit - debt + stockValue;
  }, []);

  const calculateTotalSalary = useCallback((job: Job | null, ownedCourseIds: string[], intensity: PlayerState['workIntensity']) => {
    if (!job) return 0;
    let multiplier = 1;
    
    ownedCourseIds.forEach(id => {
      const course = COURSES.find(c => c.id === id);
      if (course) multiplier += course.salaryMultiplier;
    });

    if (intensity === 'relaxed') multiplier -= 0.2;
    if (intensity === 'hard') multiplier += 0.2;

    return Math.floor(job.salary * multiplier);
  }, []);

  const calculateCreditLimit = (salary: number, score: number, netWorth: number) => {
    const scoreMultiplier = Math.max(0.1, (score - 200) / 400); 
    const base = Math.max(5000, (salary * 6) + (Math.max(0, netWorth) * 0.1));
    return Math.floor(base * scoreMultiplier);
  };

  const nextMonth = async () => {
    if (state.isGameOver || isLoading) return;
    setIsLoading(true);

    try {
      const salary = calculateTotalSalary(state.currentJob, state.courses, state.workIntensity);
      const expenses = 800 + (salary * 0.2); 
      
      const rateChange = (Math.random() - 0.5) * 0.005;
      let newDepositRate = Math.max(0.01, Math.min(0.12, state.depositRate + rateChange));
      
      const riskPremium = 0.02 + ((850 - state.creditScore) / 550) * 0.18;
      let newLoanRate = newDepositRate + riskPremium;

      const depositInterest = state.deposit * (state.depositRate / 12);
      const loanInterest = state.debt * (state.loanRate / 12);
      
      let newCash = state.cash + salary - expenses;
      let newDeposit = state.deposit + depositInterest;
      let newDebt = state.debt + loanInterest;

      if (newCash >= loanInterest) {
          newCash -= loanInterest;
          newDebt -= loanInterest; 
      } else {
          addLog(language === 'ru' ? "Пропущена оплата процентов по кредиту! Рейтинг падает." : "Loan interest payment missed! Credit score dropping.", "danger");
      }

      if (newCash < 0) {
         const shortfall = Math.abs(newCash);
         newDebt += shortfall;
         newCash = 0;
         addLog(`${language === 'ru' ? 'Автоматический овердрафт' : 'Automatic overdraft'}: $${shortfall.toFixed(0)}`, "warning");
      }

      let newScore = state.creditScore;
      const utilization = newDebt / Math.max(1, state.creditLimit);
      
      if (utilization > 1.1) newScore -= 10;
      else if (utilization > 0.8) newScore -= 5;
      else if (utilization > 0.3) newScore -= 1;
      else if (newDebt > 0) newScore += 1;
      else newScore += 0.5;
      
      if (Math.random() < 0.1) newScore += (Math.random() - 0.5) * 4;
      newScore = Math.max(300, Math.min(850, Math.floor(newScore)));
      
      const newLimit = calculateCreditLimit(salary, newScore, state.netWorth);

      const currentMonthNum = (state.gameMonth % 12) + 1;
      let totalDividends = 0;
      if (currentMonthNum % 3 === 0) {
        state.stocks.forEach(s => {
          if (s.owned > 0 && s.dividendYield > 0) {
            const divPayout = (s.price * s.dividendYield / 4) * s.owned;
            totalDividends += divPayout;
          }
        });
      }

      if (totalDividends > 0) {
        newCash += totalDividends;
        addLog(`${language === 'ru' ? 'Получены дивиденды' : 'Dividends received'}: $${totalDividends.toFixed(0)}`, "success");
      }

      let activeCourse = state.activeCourse ? { ...state.activeCourse } : null;
      let newCourses = [...state.courses];
      let newEducation = state.education;
      
      if (activeCourse) {
        activeCourse.monthsLeft -= 1;
        if (activeCourse.monthsLeft <= 0) {
          if (activeCourse.type === 'course') {
             const course = COURSES.find(c => c.id === activeCourse?.id);
             if (course) {
               newCourses.push(course.id);
               addLog(`${language === 'ru' ? 'Курс завершен' : 'Course completed'}: ${getCourseTitle(course)}!`, "success");
             }
          } else {
             newEducation = activeCourse.id as EducationLevel;
             addLog(`${language === 'ru' ? 'Получено образование' : 'Degree obtained'}: ${getEduTitle(newEducation)}!`, "success");
          }
          activeCourse = null;
        }
      }

      const newStocks = state.stocks.map(stock => {
        let newPrice = stock.price;

        if (stock.type === 'crypto') {
            if (stock.symbol === 'ZETA') {
                const targetPrice = 10;
                const pullToCenter = (targetPrice - stock.price) * 0.15;
                const noise = (Math.random() - 0.5) * stock.volatility * stock.price;
                newPrice = stock.price + pullToCenter + noise;
            } 
            else if (stock.symbol === 'MOON') {
                const randomVal = Math.random();
                if (randomVal < 0.12) {
                    const multiplier = Math.random() > 0.5 ? (Math.random() * 2 + 1.2) : (Math.random() * 0.5 + 0.1);
                    newPrice = stock.price * multiplier;
                } else {
                    newPrice = stock.price * (1 + (Math.random() - 0.5) * stock.volatility);
                }
                newPrice = Math.max(1.0, newPrice);
            } 
            else {
                const change = (Math.random() - 0.5 + stock.trend) * stock.volatility;
                newPrice = stock.price * (1 + change);
            }
        } else {
            const currentVolatility = stock.volatility * (0.5 + Math.random()); 
            const change = (Math.random() - 0.5 + stock.trend) * currentVolatility;
            newPrice = stock.price * (1 + change);
        }
        
        newPrice = Math.max(0.01, parseFloat(newPrice.toFixed(2))); 
        
        return {
          ...stock,
          price: newPrice,
          history: [...stock.history, newPrice]
        };
      });

      const newNetWorth = calculateNetWorth(newCash, newDebt, newDeposit, newStocks);

      let eventChance = 0.1;
      if (state.workIntensity === 'hard') eventChance = 0.2;

      let eventImpact = 0;
      if (Math.random() < eventChance) {
        if (state.workIntensity === 'hard' && Math.random() < 0.3) {
            eventImpact = -2000;
            const burnOutMsg = language === 'ru' ? "ВЫГОРАНИЕ! Лечение стоит денег." : "BURNOUT! Medical bills applied.";
            addLog(burnOutMsg, "danger");
            setState(prev => ({...prev, workIntensity: 'normal'}));
        } else {
            const courseNames = newCourses.map(id => {
                const c = COURSES.find(co => co.id === id);
                return c ? getCourseTitle(c) : id;
            });
            const evt = await generateGameEvent(
              Math.floor(state.gameMonth / 12) + 1, 
              state.currentJob ? { title: getJobTitle(state.currentJob), category: state.currentJob.category } : null, 
              newNetWorth,
              getEduTitle(newEducation),
              courseNames,
              language
            );
            
            if (evt) {
              eventImpact = evt.cashImpact;
              const evtPrefix = language === 'ru' ? 'СОБЫТИЕ' : 'EVENT';
              addLog(`${evtPrefix}: ${evt.description} ($${evt.cashImpact})`, evt.cashImpact >= 0 ? 'success' : 'danger');
              
              if (evt.marketImpact === 'bull') {
                newStocks.forEach(s => {
                    if (s.type === 'stock') s.price *= (1 + Math.random() * 0.15);
                });
                const bullMsg = language === 'ru' ? "Рынок акций растет на новостях!" : "Bull market triggered by news!";
                addLog(bullMsg, "success");
              } else if (evt.marketImpact === 'bear') {
                 newStocks.forEach(s => {
                    if (s.type === 'stock') s.price *= (1 - Math.random() * 0.10);
                });
                const bearMsg = language === 'ru' ? "Рынок акций падает на новостях!" : "Bear market triggered by news!";
                addLog(bearMsg, "danger");
              }
            }
        }
      }

      newCash += eventImpact;

      const nextMonthIdx = state.gameMonth + 1;
      const isGameOver = nextMonthIdx >= MAX_MONTHS;
      
      let newExperience = { ...state.experience };
      if (state.currentJob) {
        const cat = state.currentJob.category;
        let growth = 1/12;
        if (state.workIntensity === 'hard') growth = 1.5/12;
        if (state.workIntensity === 'relaxed') growth = 0.5/12;

        newExperience[cat] = (newExperience[cat] || 0) + growth;
        
        if (Math.floor(newExperience[cat]) > Math.floor(state.experience[cat])) {
             const expMsg = language === 'ru' 
                ? `Стаж в "${getCatName(cat)}" увеличен до ${Math.floor(newExperience[cat])} лет.`
                : `Experience in "${getCatName(cat)}" increased to ${Math.floor(newExperience[cat])} years.`;
             addLog(expMsg, "info");
        }
      }

      setState(prev => ({
        ...prev,
        gameMonth: nextMonthIdx,
        cash: newCash,
        debt: newDebt,
        deposit: newDeposit,
        depositRate: newDepositRate,
        loanRate: newLoanRate,
        creditScore: newScore,
        creditLimit: newLimit,
        stocks: newStocks,
        courses: newCourses,
        education: newEducation,
        activeCourse,
        experience: newExperience,
        netWorth: newNetWorth,
        history: [...prev.history, { month: nextMonthIdx, netWorth: newNetWorth }],
        isGameOver
      }));

    } catch (e) {
      console.error(e);
      addLog("Error simulating month", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const buyStock = (symbol: string, amount: number) => {
    if (amount <= 0) return;
    const stock = state.stocks.find(s => s.symbol === symbol);
    if (!stock) return;
    
    const cost = stock.price * amount;
    if (state.cash >= cost) {
      setState(prev => {
        const newStocks = prev.stocks.map(s => {
          if (s.symbol === symbol) {
            const oldTotalCost = s.owned * s.averageCost;
            const newTotalOwned = s.owned + amount;
            const newAverageCost = (oldTotalCost + cost) / newTotalOwned;

            return { 
              ...s, 
              owned: newTotalOwned,
              averageCost: newAverageCost
            };
          }
          return s;
        });

        return {
          ...prev,
          cash: prev.cash - cost,
          stocks: newStocks
        };
      });
      addLog(`+${amount.toFixed(4)} ${getStockName(stock)}`, "success");
    } else {
      addLog("$$$ < 0", "danger");
    }
  };

  const sellStock = (symbol: string, amount: number) => {
    if (amount <= 0) return;
    const stock = state.stocks.find(s => s.symbol === symbol);
    if (!stock) return;

    if (stock.owned >= amount - 0.0001) {
      const gain = stock.price * amount;
      const profit = (stock.price - stock.averageCost) * amount;

      setState(prev => ({
        ...prev,
        cash: prev.cash + gain,
        stocks: prev.stocks.map(s => s.symbol === symbol ? { ...s, owned: Math.max(0, s.owned - amount) } : s)
      }));
      
      const type = profit >= 0 ? "success" : "warning";
      addLog(`-${amount.toFixed(4)} ${getStockName(stock)}. P/L: $${profit.toFixed(0)}`, type);
    }
  };

  const applyForJob = (job: Job) => {
    const levels = [EducationLevel.NONE, EducationLevel.HIGH_SCHOOL, EducationLevel.BACHELOR, EducationLevel.MASTER, EducationLevel.MBA];
    const playerLevelIdx = levels.indexOf(state.education);
    const reqLevelIdx = levels.indexOf(job.reqEducation);

    if (playerLevelIdx < reqLevelIdx) {
       addLog(`${t('jobs.req_edu')}: ${getEduTitle(job.reqEducation)}`, "danger");
       return;
    }

    const playerExpInCat = state.experience[job.category] || 0;
    if (playerExpInCat < job.reqExpYears) {
      addLog(`${t('jobs.req_exp')}: ${job.reqExpYears} ${TRANSLATIONS['overview.years'][language]}`, "danger");
      return;
    }

    setState(prev => ({ ...prev, currentJob: job, workIntensity: 'normal' }));
    addLog(`OK: ${getJobTitle(job)}`, "success");
  };

  const quitJob = () => {
    if (state.currentJob) {
      setState(prev => ({ ...prev, currentJob: null, workIntensity: 'normal' }));
    }
  };

  const setWorkIntensity = (intensity: PlayerState['workIntensity']) => {
    setState(prev => ({ ...prev, workIntensity: intensity }));
  };

  const startEducation = (level: EducationLevel) => {
    if (state.activeCourse) return;
    const cost = EDUCATION_COSTS[level];
    if (state.cash >= cost) {
      setState(prev => ({
        ...prev,
        cash: prev.cash - cost,
        activeCourse: { id: level, monthsLeft: EDUCATION_DURATIONS[level], type: 'edu' }
      }));
    }
  };

  const buyCourse = (course: Course) => {
    if (state.activeCourse) return;
    if (state.cash >= course.cost) {
      setState(prev => ({
        ...prev,
        cash: prev.cash - course.cost,
        activeCourse: { id: course.id, monthsLeft: course.durationMonths, type: 'course' }
      }));
    }
  };

  const repayDebt = (amount: number) => {
    if (state.cash >= amount && state.debt > 0) {
      setState(prev => ({
        ...prev,
        cash: prev.cash - amount,
        debt: Math.max(0, prev.debt - amount)
      }));
    }
  };

  const takeLoan = (amount: number) => {
    const maxLoan = state.creditLimit - state.debt;
    if (amount > maxLoan) return;
    setState(prev => ({
      ...prev,
      cash: prev.cash + amount,
      debt: prev.debt + amount
    }));
  };

  const depositCash = (amount: number) => {
      if (amount <= 0) return;
      if (state.cash >= amount) {
          setState(prev => ({
              ...prev,
              cash: prev.cash - amount,
              deposit: prev.deposit + amount
          }));
      }
  };

  const withdrawDeposit = (amount: number) => {
      if (amount <= 0) return;
      if (state.deposit >= amount) {
          setState(prev => ({
              ...prev,
              cash: prev.cash - amount,
              deposit: prev.deposit - amount
          }));
      }
  };

  const gambleBet = (amount: number): boolean => {
    if (state.cash >= amount) {
        setState(prev => ({ ...prev, cash: prev.cash - amount }));
        return true;
    }
    addLog(t('casino.error_funds'), 'danger');
    return false;
  };

  const gambleWin = (amount: number, game: string) => {
      setState(prev => ({ ...prev, cash: prev.cash + amount }));
      addLog(`${t('casino.win')} (${game}): +$${amount}`, 'success');
  };

  // Admin Actions
  const adminAddCash = (amount: number) => {
    setState(prev => ({ ...prev, cash: prev.cash + amount }));
    addLog(`${t('admin.cheat_activated')}: +$${amount}`, 'success');
  };

  const adminSetScore = (val: number) => {
    setState(prev => ({ ...prev, creditScore: Math.min(850, Math.max(300, val)) }));
  };

  const adminSetEdu = (lvl: EducationLevel) => {
    setState(prev => ({ 
        ...prev, 
        education: lvl,
        activeCourse: null 
    }));
    addLog(`${t('admin.cheat_activated')}: Education -> ${lvl}`, 'success');
  };

  const adminSetJob = (jobId: string) => {
    const job = JOBS.find(j => j.id === jobId);
    if (job) {
        setState(prev => ({ ...prev, currentJob: job }));
        addLog(`${t('admin.cheat_activated')}: Job -> ${getJobTitle(job)}`, 'success');
    }
  };

  return {
    state,
    isLoading,
    actions: {
        nextMonth,
        buyStock,
        sellStock,
        applyForJob,
        quitJob,
        setWorkIntensity,
        startEducation,
        buyCourse,
        repayDebt,
        takeLoan,
        depositCash,
        withdrawDeposit,
        gambleBet,
        gambleWin,
        adminAddCash,
        adminSetScore,
        adminSetEdu,
        adminSetJob
    },
    helpers: {
        t,
        getJobTitle,
        getCourseTitle,
        getCourseDesc,
        getStockName,
        getEduTitle,
        getCatName,
        calculateTotalSalary
    }
  };
};
