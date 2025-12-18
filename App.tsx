
import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, TrendingUp, Landmark, GraduationCap, FastForward, Trophy, Hourglass, 
  CheckCircle2, Lock, Star, Zap, Coffee, ArrowUpRight, ArrowDownRight, Coins, 
  LineChart, AlertTriangle, PiggyBank, Gauge, Settings, X, Globe, ShieldAlert, 
  RotateCcw, Medal, Award, HelpCircle, Dices, Spade, Club, Heart, Diamond, ArrowLeft, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { Stock, Job, EducationLevel, Course, JobCategory, Language, PlayerState } from './types';
import { JOBS, MAX_MONTHS, EDUCATION_COSTS, MAX_YEARS, COURSES, EDUCATION_DURATIONS, CATEGORY_NAMES } from './constants';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { useGame } from './hooks/useGame';

// Helper formatters
const formatMoney = (val: number) => `$${val.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}`;
const formatMoneyDecimal = (val: number) => `$${val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const getYearNum = (month: number) => Math.floor(month / 12) + 1;
const getMonthNum = (month: number) => (month % 12) + 1;
const formatAxisNumber = (value: number) => {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${Math.round(value)}`;
};

// --- SUB-COMPONENTS ---

const OverviewTab = ({ state, helpers, showCharts }: { state: PlayerState, helpers: any, showCharts: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title={helpers.t('header.cash')} className="border-l-4 border-l-emerald-500">
          <div className="text-2xl font-bold text-white">{formatMoney(state.cash)}</div>
        </Card>
        <Card title={helpers.t('overview.net_worth')} className="border-l-4 border-l-purple-500">
           <div className="text-2xl font-bold text-white">{formatMoney(state.netWorth)}</div>
        </Card>
        <Card title={helpers.t('overview.income')} className="border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-white">
            {formatMoney(helpers.calculateTotalSalary(state.currentJob, state.courses, state.workIntensity))} 
            <span className="text-sm text-gray-400">{helpers.t('overview.per_month')}</span>
          </div>
          {state.currentJob && state.workIntensity !== 'normal' && (
             <div className={`text-xs mt-1 ${state.workIntensity === 'hard' ? 'text-emerald-400' : 'text-yellow-400'}`}>
               {state.workIntensity === 'hard' ? helpers.t('overview.intensity.hard') : helpers.t('overview.intensity.relaxed')}
             </div>
          )}
        </Card>
        <Card title={helpers.t('overview.debt')} className="border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-400">{formatMoney(state.debt)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
            <Card title={helpers.t('overview.history')}>
                <div className="h-64 w-full min-w-0 bg-gray-900/20 rounded flex items-center justify-center overflow-hidden" style={{ height: '256px', minHeight: '256px' }}>
                    {showCharts ? (
                      <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={state.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                          <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis dataKey="month" hide />
                          <YAxis 
                            stroke="#9ca3af" 
                            tickFormatter={formatAxisNumber} 
                            fontSize={10} 
                            width={40} 
                            domain={['dataMin', 'dataMax']} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }}
                            formatter={(value: number) => [formatMoney(value), helpers.t('overview.net_worth')]}
                            labelFormatter={(label) => `${helpers.t('nav.month')} ${label}`}
                          />
                          <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNetWorth)" />
                      </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="animate-pulse text-gray-600 font-mono text-xs uppercase tracking-widest">{helpers.t('header.loading')}</div>
                    )}
                </div>
            </Card>
        </div>
        <div>
            <Card title={helpers.t('overview.exp')} className="h-[300px]">
                <div className="space-y-4 max-h-full overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(state.experience).map(([cat, years]) => (
                        <div key={cat} className="flex flex-col">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">{helpers.getCatName(cat as JobCategory)}</span>
                                <span className="font-bold text-white">{Math.floor(years as number)} {helpers.t('overview.years')}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((years as number) * 10, 100)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>

      <Card title={helpers.t('overview.logs')} className="h-64 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {state.messages.map(msg => (
            <div key={msg.id} className={`p-2 rounded border-l-2 text-sm ${
              msg.type === 'success' ? 'bg-emerald-900/30 border-emerald-500' :
              msg.type === 'danger' ? 'bg-red-900/30 border-red-500' :
              msg.type === 'warning' ? 'bg-yellow-900/30 border-yellow-500' :
              'bg-gray-700/30 border-blue-500'
            }`}>
              <span className="text-gray-400 text-xs mr-2">[{msg.date}]</span>
              {msg.text}
            </div>
          ))}
        </div>
      </Card>
    </div>
);

const EducationTab = ({ state, actions, helpers }: { state: PlayerState, actions: any, helpers: any }) => {
    const levels = [EducationLevel.NONE, EducationLevel.HIGH_SCHOOL, EducationLevel.BACHELOR, EducationLevel.MASTER, EducationLevel.MBA];
    const currentLevelIdx = levels.indexOf(state.education);
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card title={helpers.t('edu.degrees')}>
             <div className="text-xs text-gray-400 mb-6">{helpers.t('edu.degrees_desc')}</div>
             <div className="space-y-4 relative pl-2">
                 <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-gray-700 z-0"></div>
                 {levels.slice(1).map((lvl, idx) => {
                     const realIdx = idx + 1; 
                     const isOwned = currentLevelIdx >= realIdx;
                     const isNext = currentLevelIdx === realIdx - 1;
                     const isLocked = currentLevelIdx < realIdx - 1;
                     const isStudying = state.activeCourse?.id === lvl;
                     return (
                         <div key={lvl} className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border bg-gray-900 transition-all ${
                             isOwned ? 'border-emerald-500/50 bg-emerald-900/10' : 
                             isStudying ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' :
                             isNext ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-gray-800 opacity-60'
                         }`}>
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 ${
                                 isOwned ? 'bg-emerald-500 border-gray-900 text-white' : 
                                 isStudying ? 'bg-yellow-500 border-gray-900 text-black animate-pulse' :
                                 isNext ? 'bg-blue-600 border-gray-900 text-white' : 'bg-gray-800 border-gray-900 text-gray-500'
                             }`}>
                                 {isOwned ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={20} /> : <GraduationCap size={24} />}
                             </div>
                             <div className="flex-1">
                                 <div className="font-bold text-base">{helpers.getEduTitle(lvl)}</div>
                                 {!isOwned && (
                                     <div className="text-xs text-gray-400 mt-1">
                                         {helpers.t('edu.cost')}: <span className="text-white">{formatMoney(EDUCATION_COSTS[lvl])}</span> • {helpers.t('edu.duration')}: {EDUCATION_DURATIONS[lvl]} {helpers.t('edu.months')}
                                     </div>
                                 )}
                                 {isOwned && <div className="text-xs text-emerald-400 mt-1">{helpers.t('edu.owned')}</div>}
                             </div>
                             {!isOwned && !isLocked && !isStudying && (
                                 <Button size="sm" onClick={() => actions.startEducation(lvl)} disabled={!!state.activeCourse || state.cash < EDUCATION_COSTS[lvl]}>
                                     {helpers.t('edu.start')}
                                 </Button>
                             )}
                             {isStudying && (
                                 <div className="text-sm font-bold font-mono text-yellow-500 whitespace-nowrap bg-yellow-900/20 px-2 py-1 rounded">
                                     {state.activeCourse?.monthsLeft} {helpers.t('edu.months')}
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
          </Card>

          <Card title={helpers.t('edu.courses')}>
             <div className="text-xs text-gray-400 mb-6">{helpers.t('edu.courses_desc')}</div>
             <div className="space-y-3">
               {COURSES.map(course => {
                  const isOwned = state.courses.includes(course.id);
                  const isStudying = state.activeCourse?.id === course.id;
                  
                  return (
                    <div key={course.id} className="p-4 bg-gray-900 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between md:items-center gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-base">{helpers.getCourseTitle(course)}</span>
                                {isOwned && <span className="text-[10px] bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{helpers.t('edu.owned')}</span>}
                            </div>
                            <div className="text-sm text-emerald-400 font-mono mt-1">{helpers.getCourseDesc(course)}</div>
                            <div className="text-xs text-gray-500 mt-1">{formatMoney(course.cost)} • {course.durationMonths} {helpers.t('edu.months')}</div>
                        </div>
                        
                        {!isOwned && !isStudying && (
                            <Button size="sm" variant="secondary" onClick={() => actions.buyCourse(course)} disabled={!!state.activeCourse || state.cash < course.cost}>
                                {helpers.t('edu.buy')}
                            </Button>
                        )}
                        {isStudying && (
                             <span className="text-sm font-mono text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded text-center">{state.activeCourse?.monthsLeft} {helpers.t('edu.months')}</span>
                        )}
                    </div>
                  )
               })}
             </div>
          </Card>
        </div>
    );
};

const JobsTab = ({ state, actions, helpers }: { state: PlayerState, actions: any, helpers: any }) => {
    const levels = [EducationLevel.NONE, EducationLevel.HIGH_SCHOOL, EducationLevel.BACHELOR, EducationLevel.MASTER, EducationLevel.MBA];
    const currentLevelIdx = levels.indexOf(state.education);
    return (
        <div className="space-y-6">
            {state.currentJob ? (
                <Card title={helpers.t('jobs.your_job')} className="border-l-4 border-l-emerald-500 bg-emerald-900/5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{helpers.getJobTitle(state.currentJob)}</h2>
                            <div className="text-sm text-gray-400 mt-1">{helpers.t('jobs.industry')}: {helpers.getCatName(state.currentJob.category)}</div>
                            <div className="text-xl font-mono text-emerald-400 mt-2 font-bold">{formatMoney(helpers.calculateTotalSalary(state.currentJob, state.courses, state.workIntensity))} <span className="text-sm text-gray-500 font-sans font-normal">{helpers.t('overview.per_month')}</span></div>
                        </div>

                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 w-full md:w-auto">
                            <div className="text-xs text-gray-400 mb-2 uppercase font-bold text-center">{helpers.t('jobs.intensity')}</div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => actions.setWorkIntensity('relaxed')}
                                    className={`flex-1 px-3 py-2 rounded text-xs flex flex-col items-center gap-1 transition-colors ${state.workIntensity === 'relaxed' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Coffee size={16} />
                                    <span>{helpers.t('jobs.mode_relaxed')}</span>
                                </button>
                                <button 
                                    onClick={() => actions.setWorkIntensity('normal')}
                                    className={`flex-1 px-3 py-2 rounded text-xs flex flex-col items-center gap-1 transition-colors ${state.workIntensity === 'normal' ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Briefcase size={16} />
                                    <span>{helpers.t('jobs.mode_normal')}</span>
                                </button>
                                <button 
                                    onClick={() => actions.setWorkIntensity('hard')}
                                    className={`flex-1 px-3 py-2 rounded text-xs flex flex-col items-center gap-1 transition-colors ${state.workIntensity === 'hard' ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Zap size={16} />
                                    <span>{helpers.t('jobs.mode_hard')}</span>
                                </button>
                            </div>
                            <div className="mt-2 text-[10px] text-center min-h-[1.25rem] font-medium">
                                {state.workIntensity === 'relaxed' && <span className="text-blue-300">{helpers.t('jobs.details_relaxed')}</span>}
                                {state.workIntensity === 'normal' && <span className="text-gray-400">{helpers.t('jobs.details_normal')}</span>}
                                {state.workIntensity === 'hard' && <span className="text-orange-400">{helpers.t('jobs.details_hard')}</span>}
                            </div>
                        </div>
                        <Button variant="danger" onClick={actions.quitJob} className="h-full">{helpers.t('jobs.quit')}</Button>
                    </div>
                </Card>
            ) : (
                <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700">
                    <div className="text-center py-8">
                        <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">{helpers.t('jobs.unemployed')}</h3>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(Object.keys(CATEGORY_NAMES.ru) as JobCategory[]).map(cat => {
                    const jobsInCat = JOBS.filter(j => j.category === cat).sort((a,b) => a.reqExpYears - b.reqExpYears);
                    const myExp = state.experience[cat] || 0;
                    return (
                        <Card key={cat} title={helpers.getCatName(cat)} className="h-full flex flex-col">
                            <div className="mb-4 flex items-center justify-between text-xs bg-gray-900 p-2 rounded border border-gray-700">
                                <span className="text-gray-400">{helpers.t('overview.exp')}:</span>
                                <span className="font-bold text-blue-400">{Math.floor(myExp)} {helpers.t('overview.years')}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                                {jobsInCat.map(job => {
                                    const isCurrent = state.currentJob?.id === job.id;
                                    const reqLvlIdx = levels.indexOf(job.reqEducation);
                                    const hasEdu = currentLevelIdx >= reqLvlIdx;
                                    const hasExp = myExp >= job.reqExpYears;
                                    const canApply = hasEdu && hasExp;
                                    return (
                                        <div key={job.id} className={`p-3 rounded border relative overflow-hidden ${isCurrent ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 bg-gray-900'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-sm text-gray-200">{helpers.getJobTitle(job)}</div>
                                                <div className="text-emerald-400 text-xs font-mono">{formatMoney(job.salary)}</div>
                                            </div>
                                            <div className="text-[10px] space-y-1 mb-2">
                                                <div className={hasEdu ? "text-gray-500" : "text-red-400 flex items-center gap-1"}>
                                                    {!hasEdu && <Lock size={10}/>} {helpers.getEduTitle(job.reqEducation)}
                                                </div>
                                                <div className={hasExp ? "text-gray-500" : "text-red-400 flex items-center gap-1"}>
                                                    {!hasExp && <Lock size={10}/>} {job.reqExpYears} {helpers.t('overview.years')}
                                                </div>
                                            </div>
                                            {!isCurrent && (
                                                <Button size="sm" variant={canApply ? "secondary" : "ghost"} className="w-full py-1 text-xs" onClick={() => actions.applyForJob(job)} disabled={!canApply}>
                                                    {canApply ? helpers.t('jobs.apply') : helpers.t('jobs.unavailable')}
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

const MarketTab = ({ state, showCharts, marketSubTab, setMarketSubTab, handleOpenTrade, helpers }: any) => {
    const marketTrend = state.stocks.filter((s: Stock) => {
      const prev = s.history[s.history.length - 2] || s.history[0];
      return s.price >= prev;
    }).length > state.stocks.length / 2 ? 'bull' : 'bear';

    const filteredStocks = state.stocks.filter((s: Stock) => s.type === marketSubTab);
    const myAssets = state.stocks.filter((s: Stock) => s.owned > 0);

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{helpers.t('market.liquidity')}</div>
              <div className="text-2xl font-mono text-white font-bold">{formatMoney(state.cash)}</div>
           </Card>
           <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{helpers.t('market.portfolio')}</div>
              <div className="text-2xl font-mono text-blue-400 font-bold">
                {formatMoney(state.stocks.reduce((acc: number, s: Stock) => acc + (s.price * s.owned), 0))}
              </div>
           </Card>
           <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
               <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{helpers.t('market.trend')}</div>
               <div className={`text-2xl font-bold flex items-center gap-2 ${marketTrend === 'bull' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {marketTrend === 'bull' ? 'BULLISH' : 'BEARISH'}
                  {marketTrend === 'bull' ? <ArrowUpRight size={24}/> : <ArrowDownRight size={24}/>}
               </div>
           </Card>
        </div>

        {myAssets.length > 0 && (
            <Card title={helpers.t('market.my_assets')} className="border-l-4 border-l-indigo-500 bg-indigo-900/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myAssets.map((stock: Stock) => {
                        const profit = (stock.price - stock.averageCost) * stock.owned;
                        const isProfit = profit >= 0;
                        return (
                            <div key={stock.symbol} className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-sm text-white">{helpers.getStockName(stock)}</div>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">{stock.symbol}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {formatMoneyDecimal(stock.price)} x {stock.owned % 1 === 0 ? stock.owned : stock.owned.toFixed(4)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">{formatMoney(stock.price * stock.owned)}</div>
                                    <div className={`text-[10px] ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isProfit ? '+' : ''}{formatMoney(profit)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        )}

        <div className="flex gap-4 border-b border-gray-800 pb-2">
            <button onClick={() => setMarketSubTab('stock')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors font-bold ${marketSubTab === 'stock' ? 'bg-gray-800 text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <LineChart size={20} /> {helpers.t('market.stocks')}
            </button>
            <button onClick={() => setMarketSubTab('crypto')} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors font-bold ${marketSubTab === 'crypto' ? 'bg-gray-800 text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <Coins size={20} /> {helpers.t('market.crypto')}
            </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredStocks.map((stock: Stock) => {
            const currentPrice = stock.price;
            const prevPrice = stock.history[stock.history.length - 2] || stock.history[0];
            const isUp = currentPrice >= prevPrice;
            const percentChange = ((currentPrice - prevPrice) / prevPrice) * 100;
            const profitLoss = (currentPrice - stock.averageCost) * stock.owned;
            const isProfit = profitLoss >= 0;
            const chartColor = stock.type === 'crypto' ? (isUp ? '#a855f7' : '#ef4444') : (isUp ? '#10b981' : '#ef4444');

            return (
              <div key={`${stock.symbol}-${marketSubTab}`} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors flex flex-col min-w-0">
                 <div className="p-4 pb-2 flex justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold border bg-gray-800 border-gray-700 text-gray-400">
                            {stock.type === 'crypto' ? <Coins size={20} /> : stock.symbol[0]}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-white">{helpers.getStockName(stock)}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{stock.symbol}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-mono font-bold text-white">{formatMoneyDecimal(currentPrice)}</div>
                        <div className={`text-[10px] font-bold flex justify-end items-center ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(percentChange).toFixed(2)}%
                        </div>
                    </div>
                 </div>

                 <div className="h-24 w-full bg-gray-950/20 relative flex items-center justify-center" style={{ height: '96px', minHeight: '96px' }}>
                    {showCharts ? (
                      <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                          <AreaChart data={stock.history.slice(-20).map((p, i) => ({ i, p }))} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                          <defs>
                              <linearGradient id={`grad${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={chartColor} stopOpacity={0.2}/>
                              <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <YAxis 
                            domain={['dataMin', 'dataMax']} 
                            orientation="right"
                            tick={{fontSize: 9, fill: '#6b7280'}}
                            width={35}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value: number) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value.toFixed(0)}
                          />
                          <Area type="monotone" dataKey="p" stroke={chartColor} strokeWidth={2} fill={`url(#grad${stock.symbol})`} animationDuration={300} />
                           {stock.averageCost > 0 && <ReferenceLine y={stock.averageCost} stroke="#fbbf24" strokeDasharray="3 3" opacity={0.5} />}
                          </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-[8px] text-gray-800 uppercase font-mono tracking-tighter">{helpers.t('header.loading')}</div>
                    )}
                 </div>

                 <div className="grid grid-cols-3 gap-2 px-4 py-2 border-t border-b border-gray-800 bg-gray-900/50">
                     <div className="text-[9px]">
                         <div className="text-gray-500 uppercase">{helpers.t('market.owned')}</div>
                         <div className="font-mono text-white">{stock.owned % 1 === 0 ? stock.owned : stock.owned.toFixed(4)}</div>
                     </div>
                     <div className="text-[9px]">
                         <div className="text-gray-500 uppercase">{helpers.t('market.avg')}</div>
                         <div className="font-mono text-gray-300">{stock.averageCost > 0 ? formatMoneyDecimal(stock.averageCost) : '-'}</div>
                     </div>
                     <div className="text-[9px] text-right">
                         <div className="text-gray-500 uppercase">P/L</div>
                         <div className={`font-mono font-bold ${stock.owned === 0 ? 'text-gray-500' : isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                             {stock.owned > 0 ? formatMoney(profitLoss) : '-'}
                         </div>
                     </div>
                 </div>

                 <div className="p-2 bg-gray-950">
                    <button onClick={() => handleOpenTrade(stock)} className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2">
                        <ArrowUpRight size={14} />
                        {helpers.t('market.trade')}
                    </button>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
};

const BankTab = ({ state, actions, helpers }: { state: PlayerState, actions: any, helpers: any }) => {
    const scoreColor = state.creditScore >= 750 ? 'text-emerald-400' : state.creditScore >= 600 ? 'text-yellow-400' : 'text-red-400';
    const scorePercent = Math.max(0, Math.min(100, (state.creditScore - 300) / (850 - 300) * 100));
    
    return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <Card title={helpers.t('bank.credit_dept')} className="border-l-4 border-l-red-500">
         <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-700">
               <div>
                 <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">{helpers.t('bank.score')}</div>
                 <div className={`text-4xl font-bold mt-1 ${scoreColor}`}>{state.creditScore}</div>
                 <div className="text-xs text-gray-500 mt-1">300 - 850</div>
               </div>
               <div className="relative w-20 h-20">
                   <div className="w-full h-full rounded-full border-4 border-gray-700"></div>
                   <div 
                    className={`absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-transparent border-l-transparent transition-all duration-1000 ${scoreColor === 'text-emerald-400' ? 'border-emerald-500' : scoreColor === 'text-yellow-400' ? 'border-yellow-500' : 'border-red-500'}`} 
                    style={{ transform: `rotate(${45 + (scorePercent * 1.8)}deg)` }}
                   ></div>
                   <Gauge className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600" size={24} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">{helpers.t('overview.debt')}</div>
                    <div className="text-xl font-bold text-white">{formatMoney(state.debt)}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">{helpers.t('bank.limit')}</div>
                    <div className="text-xl font-bold text-white">{formatMoney(state.creditLimit)}</div>
                </div>
            </div>

             <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                 <div className="text-xs text-gray-400 mb-2 font-bold uppercase">{helpers.t('bank.take_loan')}</div>
                 <div className="flex gap-2 mb-2">
                     <Button size="sm" variant="secondary" onClick={() => actions.takeLoan(1000)} disabled={state.debt >= state.creditLimit}>+ $1k</Button>
                     <Button size="sm" variant="secondary" onClick={() => actions.takeLoan(5000)} disabled={state.debt >= state.creditLimit}>+ $5k</Button>
                     <Button size="sm" variant="secondary" onClick={() => actions.takeLoan(10000)} disabled={state.debt >= state.creditLimit}>+ $10k</Button>
                 </div>
                 <div className="text-[10px] text-gray-500">
                     Rate: {(state.loanRate * 100).toFixed(1)}% / yr
                 </div>
             </div>

             <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                 <div className="text-xs text-gray-400 mb-2 font-bold uppercase">{helpers.t('bank.repay')}</div>
                 <div className="flex gap-2">
                     <Button size="sm" variant="primary" onClick={() => actions.repayDebt(1000)} disabled={state.debt <= 0}>- $1k</Button>
                     <Button size="sm" variant="primary" onClick={() => actions.repayDebt(5000)} disabled={state.debt <= 0}>- $5k</Button>
                     <Button size="sm" variant="primary" onClick={() => actions.repayDebt(state.debt)} disabled={state.debt <= 0}>{helpers.t('bank.all')}</Button>
                 </div>
             </div>
         </div>
       </Card>

       <Card title={helpers.t('bank.deposit_dept')} className="border-l-4 border-l-blue-500">
          <div className="space-y-6">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                  <div>
                      <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">{helpers.t('bank.savings')}</div>
                      <div className="text-3xl font-bold text-blue-400 mt-1">{formatMoney(state.deposit)}</div>
                      <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                          <TrendingUp size={12} />
                          +{(state.depositRate * 100).toFixed(2)}% APY
                      </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                      <PiggyBank size={24} />
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-xs text-gray-400 mb-2 font-bold uppercase">{helpers.t('bank.deposit_add')}</div>
                      <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => actions.depositCash(1000)} disabled={state.cash < 1000}>+$1k</Button>
                          <Button size="sm" variant="secondary" onClick={() => actions.depositCash(5000)} disabled={state.cash < 5000}>+$5k</Button>
                          <Button size="sm" variant="secondary" onClick={() => actions.depositCash(state.cash)} disabled={state.cash <= 0}>{helpers.t('bank.all')}</Button>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{helpers.t('bank.from_cash')}</div>
                  </div>

                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-xs text-gray-400 mb-2 font-bold uppercase">{helpers.t('bank.deposit_withdraw')}</div>
                      <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="primary" onClick={() => actions.withdrawDeposit(1000)} disabled={state.deposit < 1000}>-$1k</Button>
                          <Button size="sm" variant="primary" onClick={() => actions.withdrawDeposit(5000)} disabled={state.deposit < 5000}>-$5k</Button>
                          <Button size="sm" variant="primary" onClick={() => actions.withdrawDeposit(state.deposit)} disabled={state.deposit <= 0}>{helpers.t('bank.all')}</Button>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{helpers.t('bank.to_hand')}</div>
                  </div>
              </div>
              
              <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg flex gap-3">
                  <div className="shrink-0 mt-0.5"><div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">i</div></div>
                  <div>
                      <div className="text-xs font-bold text-blue-300 mb-0.5">{helpers.t('bank.advice')}</div>
                      <div className="text-[10px] text-gray-400 leading-relaxed">{helpers.t('bank.advice_text')}</div>
                  </div>
              </div>
          </div>
       </Card>
    </div>
    );
};

// --- CASINO GAMES ---

const SlotsGame = ({ cash, t, actions }: any) => {
    const [bet, setBet] = useState(100);
    const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
    const [spinning, setSpinning] = useState(false);
    const [winEffect, setWinEffect] = useState<string | null>(null);

    // Symbols and Weights (visual only, logic handles outcome)
    const symbols = ['🍒', '🍋', '🍇', '💎', '7️⃣'];

    const PAYTABLE = [
        { combination: '7️⃣ 7️⃣ 7️⃣', multiplier: 100, label: 'JACKPOT' },
        { combination: '💎 💎 💎', multiplier: 50, label: 'MEGA WIN' },
        { combination: '🍇 🍇 🍇', multiplier: 20, label: 'BIG WIN' },
        { combination: '🍋 🍋 🍋', multiplier: 10, label: 'Nice!' },
        { combination: '🍒 🍒 🍒', multiplier: 5, label: 'Tasty' },
        { combination: '🍒 🍒 ?', multiplier: 2, label: 'Small Win' },
    ];

    const spin = async () => {
        if (!actions.gambleBet(bet)) return;
        setSpinning(true);
        setWinEffect(null);
        
        let spins = 0;
        const interval = setInterval(() => {
            setReels(prev => [
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)],
                symbols[Math.floor(Math.random() * symbols.length)]
            ]);
            spins++;
            if (spins > 20) {
                clearInterval(interval);
                finalizeSpin();
            }
        }, 80);
    };

    const finalizeSpin = () => {
        // Determine outcome
        const finalReels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setReels(finalReels);
        setSpinning(false);

        let mult = 0;
        let winLabel = "";

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
            if (finalReels[0] === '7️⃣') { mult = 100; winLabel = "JACKPOT"; }
            else if (finalReels[0] === '💎') { mult = 50; winLabel = "MEGA WIN"; }
            else if (finalReels[0] === '🍇') { mult = 20; winLabel = "BIG WIN"; }
            else if (finalReels[0] === '🍋') { mult = 10; winLabel = "Nice!"; }
            else if (finalReels[0] === '🍒') { mult = 5; winLabel = "Tasty"; }
        } else if ((finalReels[0] === '🍒' && finalReels[1] === '🍒') || (finalReels[0] === '🍒' && finalReels[2] === '🍒') || (finalReels[1] === '🍒' && finalReels[2] === '🍒')) {
             // Basic 2 cherries check (simplified)
             mult = 2; winLabel = "Small Win";
        }

        if (mult > 0) {
            setWinEffect(winLabel);
            actions.gambleWin(bet * mult, t('casino.slots'));
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start justify-center w-full">
            {/* Slot Machine */}
            <div className="flex-1 w-full max-w-2xl bg-gradient-to-b from-gray-800 to-black p-8 rounded-[3rem] border-[8px] border-yellow-600 shadow-2xl relative">
                {/* Title Plate */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-600 px-8 py-2 rounded-full border-4 border-yellow-400 shadow-lg z-10">
                    <h3 className="text-2xl font-black text-black tracking-widest uppercase text-shadow">Super Slots</h3>
                </div>

                {/* Reels Container */}
                <div className="bg-white p-6 rounded-2xl border-4 border-gray-700 flex gap-4 justify-center items-center shadow-inner mt-6 overflow-hidden relative">
                     {/* Decorative line */}
                     <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/30 z-0"></div>

                     {reels.map((s, i) => (
                        <div key={i} className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 rounded-lg flex items-center justify-center text-6xl md:text-7xl border-2 border-gray-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 relative overflow-hidden">
                             {/* REMOVED blur-sm for crisp spinning */}
                             <div className={`transition-transform duration-100 ${spinning ? 'scale-110' : ''}`}>
                                {s}
                             </div>
                        </div>
                    ))}
                </div>

                {/* Win Display */}
                <div className="h-16 flex items-center justify-center mt-4 mb-2">
                    {winEffect ? (
                        <div className="text-4xl font-black text-yellow-400 animate-bounce drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
                            {winEffect}!
                        </div>
                    ) : (
                        <div className="text-gray-600 font-mono text-sm">GOOD LUCK</div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3">
                         <span className="text-gray-400 font-bold uppercase text-sm">{t('casino.bet')}</span>
                         <input 
                            type="number" 
                            value={bet} 
                            onChange={e => setBet(Number(e.target.value))} 
                            className="w-32 bg-black border-2 border-gray-600 rounded-lg px-4 py-2 text-xl font-mono text-yellow-500 text-center focus:border-yellow-500 outline-none" 
                            min="10" 
                         />
                    </div>
                    <Button onClick={spin} disabled={spinning} className="w-full md:w-auto px-12 py-4 text-xl font-black bg-gradient-to-b from-red-500 to-red-700 border-b-4 border-red-900 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] active:translate-y-1 active:shadow-none transition-all">
                        {spinning ? '...' : 'SPIN'}
                    </Button>
                </div>
            </div>

            {/* Paytable Side Panel */}
            <div className="w-full xl:w-80 bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-xl">
                 <div className="flex items-center gap-2 mb-4 text-yellow-500 border-b border-gray-800 pb-2">
                     <Info size={20} />
                     <h4 className="font-bold uppercase tracking-wider">Paytable</h4>
                 </div>
                 <div className="space-y-3">
                     {PAYTABLE.map((row, idx) => (
                         <div key={idx} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                             <div className="text-xl tracking-widest">{row.combination}</div>
                             <div className="text-right">
                                 <div className="font-bold text-emerald-400">x{row.multiplier}</div>
                                 <div className="text-[10px] text-gray-500 uppercase">{row.label}</div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

const HorseRaceGame = ({ cash, t, actions }: any) => {
    const [bet, setBet] = useState(100);
    const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
    const [racing, setRacing] = useState(false);
    const [progress, setProgress] = useState([0, 0, 0, 0]);
    const [winner, setWinner] = useState<number | null>(null);
    const [frame, setFrame] = useState(0);

    // UPDATED ODDS LOGIC: 
    // High odds = Low base speed + High Variance (Risky)
    // Low odds = High base speed + Low Variance (Reliable)
    const horses = [
        { id: 0, color: '#ef4444', name: 'Red Rocket', odds: 2.0, baseSpeed: 1.8, variance: 0.8 }, 
        { id: 1, color: '#3b82f6', name: 'Blue Bolt', odds: 4.0, baseSpeed: 1.5, variance: 1.5 },   
        { id: 2, color: '#10b981', name: 'Green Giant', odds: 8.0, baseSpeed: 1.2, variance: 2.5 }, 
        { id: 3, color: '#eab308', name: 'Golden Boy', odds: 12.0, baseSpeed: 0.9, variance: 4.0 }, // Wildcard
    ];

    const startRace = () => {
        if (selectedHorse === null) return;
        if (!actions.gambleBet(bet)) return;

        setRacing(true);
        setWinner(null);
        setProgress([0, 0, 0, 0]);
        setFrame(0);

        const interval = setInterval(() => {
            setFrame(f => f + 1);
            setProgress(prev => {
                const next = prev.map((p, i) => {
                    // Logic: Base Speed + (Random * Variance)
                    // High variance allows a slow horse to occasionally sprint fast
                    const burst = Math.random() * horses[i].variance;
                    const move = horses[i].baseSpeed + burst;
                    return p + move;
                });
                
                const winIdx = next.findIndex(p => p >= 100);
                
                if (winIdx !== -1) {
                    clearInterval(interval);
                    setRacing(false);
                    setWinner(winIdx);
                    if (winIdx === selectedHorse) {
                        actions.gambleWin(Math.floor(bet * horses[selectedHorse].odds), t('casino.horses'));
                    }
                    return next.map((p, i) => i === winIdx ? 100 : p);
                }
                return next;
            });
        }, 50);
    };

    return (
        <Card title={t('casino.horses')} className="border-l-4 border-l-amber-500 max-w-4xl mx-auto">
            {/* Race Track */}
            <div className="bg-[#2d3b2d] p-4 rounded-xl border-4 border-[#3f2e22] shadow-inner mb-6 relative overflow-hidden">
                {/* Grass texture/Finish Line */}
                <div className="absolute top-0 bottom-0 right-16 w-4 bg-[repeating-linear-gradient(45deg,white,white_10px,black_10px,black_20px)] opacity-60 z-0"></div>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="space-y-6 relative z-10 py-2">
                    {horses.map(horse => (
                        <div key={horse.id} className="relative h-20 border-b border-white/10 last:border-0 flex items-center">
                            <div 
                                className="absolute transition-all duration-100 ease-linear flex items-center" 
                                style={{ left: `calc(${Math.min(90, progress[horse.id])}% - 2rem)` }}
                            >
                                <div className={`transform transition-transform ${winner === horse.id ? 'scale-125' : ''}`}>
                                    {/* Identical Emoji Horse with Color Distinction */}
                                    <div className="relative">
                                         <div className="text-5xl transform -scale-x-100 drop-shadow-md" style={{ filter: `drop-shadow(0 0 4px ${horse.color})` }}>
                                            🐎
                                         </div>
                                         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full opacity-80" style={{ backgroundColor: horse.color }}></div>
                                    </div>
                                </div>
                                <div className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm mt-1 whitespace-nowrap text-center font-bold ml-2">
                                    {horse.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <div className="text-center mb-4 font-bold text-gray-400 uppercase tracking-widest">{t('casino.horse_select')}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {horses.map(horse => (
                        <button 
                            key={horse.id} 
                            onClick={() => setSelectedHorse(horse.id)} 
                            disabled={racing}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all group ${selectedHorse === horse.id ? `border-[${horse.color}] bg-gray-800 scale-105 shadow-lg` : 'border-transparent bg-gray-800/50 hover:bg-gray-800'}`}
                            style={selectedHorse === horse.id ? { borderColor: horse.color } : {}}
                        >
                            <div className="text-4xl transform -scale-x-100" style={{ filter: `drop-shadow(0 0 2px ${horse.color})` }}>
                                🐎
                            </div>
                            <span className="font-bold text-sm">{horse.name}</span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${selectedHorse === horse.id ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                x{horse.odds.toFixed(1)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-gray-800 pt-6">
                     <div className="flex items-center gap-3">
                         <span className="font-bold text-gray-400">{t('casino.bet')}</span>
                         <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-32 bg-gray-950 border border-gray-600 rounded-lg px-3 py-2 text-white text-center" min="10" />
                     </div>
                     <Button onClick={startRace} disabled={racing || selectedHorse === null} size="lg" className="w-full sm:w-auto px-12 bg-amber-600 hover:bg-amber-500 text-black font-bold">
                         {t('casino.start_race')}
                     </Button>
                </div>
            </div>
        </Card>
    );
};

const BlackjackGame = ({ cash, t, actions }: any) => {
    const [bet, setBet] = useState(100);
    const [dealerHand, setDealerHand] = useState<number[]>([]);
    const [playerHand, setPlayerHand] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
    const [message, setMessage] = useState('');

    const drawCard = () => Math.floor(Math.random() * 13) + 1;
    
    const calculateScore = (hand: number[]) => {
        let score = 0;
        let aces = 0;
        hand.forEach(card => {
            if (card === 1) aces++;
            else if (card >= 10) score += 10;
            else score += card;
        });
        for (let i = 0; i < aces; i++) {
            if (score + 11 <= 21) score += 11;
            else score += 1;
        }
        return score;
    };

    const startGame = () => {
        if (!actions.gambleBet(bet)) return;
        setPlayerHand([drawCard(), drawCard()]);
        setDealerHand([drawCard()]);
        setGameState('playing');
        setMessage('');
    };

    const hit = () => {
        const newHand = [...playerHand, drawCard()];
        setPlayerHand(newHand);
        if (calculateScore(newHand) > 21) {
            setGameState('finished');
            setMessage(t('casino.lose'));
        }
    };

    const stand = async () => {
        let dHand = [...dealerHand];
        while (calculateScore(dHand) < 17) {
            dHand.push(drawCard());
            setDealerHand([...dHand]);
            await new Promise(r => setTimeout(r, 600));
        }
        
        const pScore = calculateScore(playerHand);
        const dScore = calculateScore(dHand);
        
        setGameState('finished');
        if (dScore > 21 || pScore > dScore) {
            setMessage(t('casino.win'));
            actions.gambleWin(bet * 2, t('casino.blackjack'));
        } else if (dScore === pScore) {
            setMessage(t('casino.draw'));
            actions.gambleWin(bet, t('casino.blackjack')); // Return bet
        } else {
            setMessage(t('casino.lose'));
        }
    };

    const renderCard = (val: number, hidden = false) => {
        if (hidden) return (
            <div className="w-24 h-36 bg-red-900 rounded-lg border-2 border-white shadow-xl flex items-center justify-center bg-[repeating-linear-gradient(45deg,maroon,maroon_10px,red_10px,red_20px)]">
                <div className="w-16 h-24 border-2 border-red-950/50 rounded"></div>
            </div>
        );

        let display = val.toString();
        if (val === 1) display = 'A';
        if (val === 11) display = 'J';
        if (val === 12) display = 'Q';
        if (val === 13) display = 'K';
        
        // Deterministic suit based on value for visual stability
        const suits = [<Spade size={24} fill="currentColor"/>, <Club size={24} fill="currentColor"/>, <Heart size={24} fill="currentColor"/>, <Diamond size={24} fill="currentColor"/>];
        const suitIdx = (val * 7) % 4; // pseudo random but consistent
        const isRed = suitIdx >= 2;
        const suit = suits[suitIdx];

        return (
            <div className={`w-24 h-36 bg-white rounded-lg shadow-xl relative flex flex-col justify-between p-2 select-none transform hover:-translate-y-2 transition-transform duration-300 ${isRed ? 'text-red-600' : 'text-black'}`}>
                <div className="font-bold text-xl leading-none text-left">{display}<br/><div className="scale-75 origin-top-left">{suit}</div></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-20">{suit}</div>
                <div className="font-bold text-xl leading-none text-right rotate-180">{display}<br/><div className="scale-75 origin-top-left">{suit}</div></div>
            </div>
        );
    };

    return (
        <Card title={t('casino.blackjack')} className="border-l-4 border-l-gray-500 max-w-5xl mx-auto">
            {/* Table Area */}
            <div className="relative min-h-[500px] bg-[#0f381e] rounded-3xl border-[12px] border-[#2d1b0e] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] flex flex-col justify-between p-10 overflow-hidden mb-6">
                 {/* Table Texture/Logo */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a4c2d] font-serif italic text-6xl opacity-40 whitespace-nowrap pointer-events-none">
                     Blackjack Pays 3 to 2
                 </div>

                 {/* Dealer Area */}
                 <div className="flex flex-col items-center">
                      <div className="mb-2 text-[#4ade80] text-sm uppercase tracking-widest font-bold opacity-70">Dealer - {dealerHand.length > 0 && gameState !== 'playing' ? calculateScore(dealerHand) : '?'}</div>
                      <div className="flex justify-center gap-4">
                         {dealerHand.length === 0 ? <div className="w-24 h-36 border-2 border-dashed border-white/20 rounded-lg"></div> : dealerHand.map((c, i) => renderCard(c))}
                         {gameState === 'playing' && renderCard(0, true)}
                      </div>
                 </div>

                 {/* Message Overlay */}
                 {message && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-12 py-6 rounded-2xl border border-white/20 z-20 animate-in fade-in zoom-in duration-300">
                         <div className={`text-4xl font-black uppercase tracking-wider text-center ${message === t('casino.lose') ? 'text-red-500' : message === t('casino.win') ? 'text-yellow-400' : 'text-blue-400'}`}>
                             {message}
                         </div>
                     </div>
                 )}

                 {/* Player Area */}
                 <div className="flex flex-col items-center">
                     <div className="flex justify-center gap-4 mb-2">
                         {playerHand.length === 0 ? (
                             <>
                                <div className="w-24 h-36 border-2 border-dashed border-white/20 rounded-lg"></div>
                                <div className="w-24 h-36 border-2 border-dashed border-white/20 rounded-lg"></div>
                             </>
                         ) : playerHand.map((c, i) => renderCard(c))}
                     </div>
                     <div className="mt-2 text-[#4ade80] text-sm uppercase tracking-widest font-bold opacity-70">Player - {calculateScore(playerHand)}</div>
                 </div>
            </div>

            {/* Controls */}
            {gameState === 'betting' ? (
                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-bold uppercase">{t('casino.bet')}</span>
                        <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-40 bg-gray-950 border border-gray-600 rounded-lg px-4 py-3 text-white text-xl text-center" min="10" />
                    </div>
                    <Button onClick={startGame} size="lg" className="w-full md:w-96 py-4 text-lg font-bold">
                        {t('casino.bj_deal')}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-4 max-w-2xl mx-auto">
                    <Button onClick={hit} disabled={gameState === 'finished'} className="flex-1 py-6 text-xl font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/50">
                        {t('casino.bj_hit')}
                    </Button>
                    <Button onClick={stand} disabled={gameState === 'finished'} className="flex-1 py-6 text-xl font-bold bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/50">
                        {t('casino.bj_stand')}
                    </Button>
                    {gameState === 'finished' && (
                        <Button onClick={() => setGameState('betting')} className="flex-1 py-6 text-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50">
                            {t('end.restart')}
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};

const CasinoTab = ({ state, actions, helpers }: any) => {
    const [activeGame, setActiveGame] = useState<'slots' | 'horses' | 'blackjack' | null>(null);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-2xl shadow-xl border border-purple-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-4">
                     {activeGame && (
                        <button onClick={() => setActiveGame(null)} className="p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
                            <ArrowLeft size={24} className="text-white" />
                        </button>
                     )}
                     <div>
                         <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Dices size={32} /> {helpers.t('casino.title')}</h2>
                         <div className="text-purple-300 mt-1">{helpers.t('casino.payout')} 98.5%</div>
                     </div>
                 </div>
                 <div className="text-right">
                     <div className="text-sm text-gray-400 uppercase font-bold">{helpers.t('header.cash')}</div>
                     <div className="text-3xl font-mono font-bold text-emerald-400">{formatMoney(state.cash)}</div>
                 </div>
            </div>

            {!activeGame && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => setActiveGame('slots')} className="group relative overflow-hidden bg-gray-900 rounded-3xl border border-gray-700 hover:border-pink-500 transition-all text-left shadow-2xl h-96 flex flex-col">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                            <Dices size={200} className="text-pink-500 rotate-12"/>
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-end relative z-10">
                            <div className="w-16 h-16 bg-pink-900/50 rounded-2xl flex items-center justify-center mb-6 text-pink-500 border border-pink-500/20 shadow-lg group-hover:scale-110 transition-transform">
                                <Dices size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide group-hover:text-pink-400 transition-colors">{helpers.t('casino.slots')}</h3>
                            <div className="text-gray-400 text-sm leading-relaxed max-w-[80%]">Spin the reels and hit the Jackpot! Multiple paylines and huge multipliers await.</div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-pink-600 to-purple-600 w-0 group-hover:w-full transition-all duration-500"></div>
                    </button>

                    <button onClick={() => setActiveGame('horses')} className="group relative overflow-hidden bg-gray-900 rounded-3xl border border-gray-700 hover:border-amber-500 transition-all text-left shadow-2xl h-96 flex flex-col">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                            <Trophy size={200} className="text-amber-500 -rotate-12"/>
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-end relative z-10">
                            <div className="w-16 h-16 bg-amber-900/50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 border border-amber-500/20 shadow-lg group-hover:scale-110 transition-transform">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide group-hover:text-amber-400 transition-colors">{helpers.t('casino.horses')}</h3>
                            <div className="text-gray-400 text-sm leading-relaxed max-w-[80%]">The track is hot! Pick your winner and watch them sprint to the finish line. High risk, high reward.</div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-amber-600 to-orange-600 w-0 group-hover:w-full transition-all duration-500"></div>
                    </button>

                    <button onClick={() => setActiveGame('blackjack')} className="group relative overflow-hidden bg-gray-900 rounded-3xl border border-gray-700 hover:border-emerald-500 transition-all text-left shadow-2xl h-96 flex flex-col">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                            <Spade size={200} className="text-emerald-500 rotate-45"/>
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-end relative z-10">
                            <div className="w-16 h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 border border-emerald-500/20 shadow-lg group-hover:scale-110 transition-transform">
                                <Spade size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide group-hover:text-emerald-400 transition-colors">{helpers.t('casino.blackjack')}</h3>
                            <div className="text-gray-400 text-sm leading-relaxed max-w-[80%]">Classic Blackjack. Beat the dealer to 21 without busting. Strategy meets luck on the felt.</div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600 w-0 group-hover:w-full transition-all duration-500"></div>
                    </button>
                </div>
            )}

            {activeGame && (
                <div className="w-full">
                    {activeGame === 'slots' && <SlotsGame cash={state.cash} t={helpers.t} actions={actions} />}
                    {activeGame === 'horses' && <HorseRaceGame cash={state.cash} t={helpers.t} actions={actions} />}
                    {activeGame === 'blackjack' && <BlackjackGame cash={state.cash} t={helpers.t} actions={actions} />}
                </div>
            )}
        </div>
    );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'jobs' | 'market' | 'bank' | 'casino'>('overview');
  const [marketSubTab, setMarketSubTab] = useState<'stock' | 'crypto'>('stock');
  const [showCharts, setShowCharts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  
  // Trade Modal State
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');

  // Admin State
  const [adminPin, setAdminPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Hook
  const { state, actions, helpers, isLoading } = useGame(language);

  // Delay chart rendering
  useEffect(() => {
    setShowCharts(false);
    const timer = setTimeout(() => setShowCharts(true), 150);
    return () => clearTimeout(timer);
  }, [activeTab, marketSubTab, state.isGameOver]);


  // --- ADMIN LOGIC ---
  const unlockAdmin = () => {
    if (adminPin === '2406') {
      setIsAdmin(true);
      setAdminPin('');
    } else {
      alert(helpers.t('admin.wrong_pin'));
      setAdminPin('');
    }
  };

  const handleOpenTrade = (stock: Stock) => {
    setSelectedStock(stock);
    setTradeMode('buy');
    setTradeAmount('');
  };

  const handleExecuteTrade = () => {
    if (!selectedStock) return;
    const value = parseFloat(tradeAmount);
    if (isNaN(value) || value <= 0) return;
    const quantity = value / selectedStock.price;

    if (tradeMode === 'buy') {
        if (state.cash >= value) {
            actions.buyStock(selectedStock.symbol, quantity);
            setSelectedStock(null);
        }
    } else {
        const ownedValue = selectedStock.owned * selectedStock.price;
        if (value <= ownedValue + 0.01) {
            actions.sellStock(selectedStock.symbol, quantity);
            setSelectedStock(null);
        }
    }
  };

  const handleMaxTrade = () => {
    if (!selectedStock) return;
    if (tradeMode === 'buy') {
        setTradeAmount(Math.floor(state.cash).toString());
    } else {
        setTradeAmount((selectedStock.owned * selectedStock.price).toFixed(2));
    }
  };

  // --- GAME OVER RENDER ---
  const renderGameOver = () => {
      // Ranking logic inside component for display
      const getRank = (netWorth: number) => {
          if (netWorth < 0) return { key: 'rank.bankrupt', color: 'text-red-500', icon: AlertTriangle };
          if (netWorth < 50000) return { key: 'rank.survivor', color: 'text-gray-400', icon: Coffee };
          if (netWorth < 200000) return { key: 'rank.worker', color: 'text-blue-400', icon: Briefcase };
          if (netWorth < 500000) return { key: 'rank.manager', color: 'text-indigo-400', icon: Star };
          if (netWorth < 1000000) return { key: 'rank.rich', color: 'text-emerald-400', icon: Medal };
          if (netWorth < 5000000) return { key: 'rank.millionaire', color: 'text-yellow-400', icon: Trophy };
          if (netWorth < 20000000) return { key: 'rank.tycoon', color: 'text-purple-400', icon: Award };
          return { key: 'rank.legend', color: 'text-amber-300', icon: Globe };
      };

      const rank = getRank(state.netWorth);
      const RankIcon = rank.icon;

      return (
        <div className="fixed inset-0 bg-gray-950 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-500 overflow-y-auto">
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <div className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 to-gray-800 border-b md:border-b-0 md:border-r border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                    <div className="mb-6">
                        <div className={`w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 ${rank.color.replace('text', 'border')} shadow-lg shadow-black/50 mb-4 mx-auto`}>
                            <RankIcon size={48} className={rank.color} />
                        </div>
                        <h2 className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">{helpers.t('rank.label')}</h2>
                        <h1 className={`text-2xl font-bold ${rank.color}`}>{helpers.t(rank.key)}</h1>
                    </div>
                    <div className="space-y-1 mb-8">
                        <div className="text-gray-400 text-sm uppercase font-semibold">{helpers.t('end.subtitle')}</div>
                        <div className="text-4xl lg:text-5xl font-mono font-bold text-white tracking-tight">{formatMoney(state.netWorth)}</div>
                    </div>
                    <Button size="lg" onClick={() => window.location.reload()} className="w-full max-w-xs group relative overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500"/> 
                            {helpers.t('end.restart')}
                        </span>
                        <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Button>
                </div>
                {/* Stats Right Side */}
                <div className="w-full md:w-3/5 p-8 bg-gray-950 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <LineChart className="text-blue-500" /> {helpers.t('end.stats_title')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">{helpers.t('edu.degrees')}</div>
                            <div className="text-white font-semibold truncate flex items-center gap-2">
                                <GraduationCap size={16} className="text-purple-400"/>
                                {helpers.getEduTitle(state.education)}
                            </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">{helpers.t('jobs.your_job')}</div>
                            <div className="text-white font-semibold truncate flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-400"/>
                                {state.currentJob ? helpers.getJobTitle(state.currentJob) : helpers.t('jobs.unemployed')}
                            </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">{helpers.t('bank.score')}</div>
                            <div className="text-white font-semibold flex items-center gap-2">
                                <Gauge size={16} className={state.creditScore >= 700 ? 'text-emerald-400' : 'text-yellow-400'}/>
                                {state.creditScore}
                            </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">{helpers.t('market.my_assets')}</div>
                            <div className="text-white font-semibold flex items-center gap-2">
                                <Landmark size={16} className="text-amber-400"/>
                                {formatMoney(state.stocks.reduce((acc: number, s: Stock) => acc + (s.price * s.owned), 0) + state.deposit)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[200px] bg-gray-900/50 rounded-xl border border-gray-800 p-4 relative flex flex-col">
                        <div className="text-xs text-gray-500 uppercase mb-4">{helpers.t('overview.history')}</div>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={state.history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorNetWorthEnd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="month" hide />
                                    <YAxis stroke="#6b7280" tickFormatter={formatAxisNumber} fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} formatter={(val: number) => [formatMoney(val), '']} labelFormatter={() => ''} />
                                    <Area type="monotone" dataKey="netWorth" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorthEnd)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* GLOBAL STYLES FOR INPUT SPINNER */}
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col md:h-full shrink-0 z-20">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-900/50">
             <Trophy size={24} className="text-white" />
          </div>
          <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">ZeroMoney</h1>
              <div className="text-xs text-gray-500 mt-1 font-mono">{MAX_YEARS} {helpers.t('overview.years')}</div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {(['overview', 'education', 'jobs', 'market', 'bank', 'casino'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {tab === 'overview' && <TrendingUp size={20} />}
                {tab === 'education' && <GraduationCap size={20} />}
                {tab === 'jobs' && <Briefcase size={20} />}
                {tab === 'market' && <LineChart size={20} />}
                {tab === 'bank' && <Landmark size={20} />}
                {tab === 'casino' && <Dices size={20} />}
                <span className="font-medium">{helpers.t(`nav.${tab}`)}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-3">
             <div className="flex items-center justify-between px-2 text-sm text-gray-400">
                 <div className="flex items-center gap-2"><Hourglass size={16}/> {helpers.t('nav.time')}</div>
                 <div className="font-mono text-white">
                    {helpers.t('nav.year')}{getYearNum(state.gameMonth)} {helpers.t('nav.month')}{getMonthNum(state.gameMonth)}
                 </div>
             </div>
             <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(state.gameMonth / MAX_MONTHS) * 100}%` }}></div>
             </div>
             
             <div className="mt-4 space-y-3">
                 <Button 
                    onClick={actions.nextMonth} 
                    disabled={state.isGameOver || isLoading} 
                    className="w-full justify-center py-4 text-lg font-bold shadow-emerald-500/20 shadow-lg" 
                    variant={state.isGameOver ? 'ghost' : 'primary'}
                 >
                    {isLoading ? helpers.t('header.loading') : state.isGameOver ? helpers.t('header.game_over') : <><FastForward size={20}/> {helpers.t('header.next_month')}</>}
                 </Button>
                 
                 <div className="grid grid-cols-2 gap-2">
                     <Button onClick={() => setShowSettings(true)} variant="ghost" className="w-full justify-center bg-gray-800/50 hover:bg-gray-800">
                        <Settings size={18} />
                     </Button>
                     <Button onClick={() => setShowHelp(true)} variant="ghost" className="w-full justify-center bg-gray-800/50 hover:bg-gray-800">
                        <HelpCircle size={18} />
                     </Button>
                 </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          {activeTab === 'overview' && <OverviewTab state={state} helpers={helpers} showCharts={showCharts} />}
          {activeTab === 'education' && <EducationTab state={state} actions={actions} helpers={helpers} />}
          {activeTab === 'jobs' && <JobsTab state={state} actions={actions} helpers={helpers} />}
          {activeTab === 'market' && <MarketTab state={state} showCharts={showCharts} marketSubTab={marketSubTab} setMarketSubTab={setMarketSubTab} handleOpenTrade={handleOpenTrade} helpers={helpers} />}
          {activeTab === 'bank' && <BankTab state={state} actions={actions} helpers={helpers} />}
          {activeTab === 'casino' && <CasinoTab state={state} actions={actions} helpers={helpers} />}
        </div>
      </main>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden transform transition-all">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{helpers.t('trade.title')}: {helpers.getStockName(selectedStock)}</h3>
                        <div className="text-emerald-400 font-mono mt-1">{formatMoneyDecimal(selectedStock.price)}</div>
                    </div>
                    <button onClick={() => setSelectedStock(null)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setTradeMode('buy')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${tradeMode === 'buy' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{helpers.t('trade.buy')}</button>
                        <button onClick={() => setTradeMode('sell')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${tradeMode === 'sell' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{helpers.t('trade.sell')}</button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">{helpers.t('trade.amount')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input 
                                type="number" 
                                value={tradeAmount} 
                                onChange={(e) => setTradeAmount(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-8 pr-16 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                            <button onClick={handleMaxTrade} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-blue-300 font-bold uppercase">{helpers.t('trade.max')}</button>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm p-3 bg-gray-800/50 rounded border border-gray-700/50">
                        <span className="text-gray-400">{helpers.t('trade.est_qty')}</span>
                        <span className="font-mono text-white">
                            {((parseFloat(tradeAmount) || 0) / selectedStock.price).toFixed(4)}
                        </span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{helpers.t('header.cash')}: {formatMoney(state.cash)}</span>
                        <span>{helpers.t('edu.owned')}: {selectedStock.owned.toFixed(4)}</span>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 flex gap-3">
                    <Button onClick={() => setSelectedStock(null)} variant="ghost" className="flex-1">{helpers.t('trade.cancel')}</Button>
                    <Button onClick={handleExecuteTrade} variant={tradeMode === 'buy' ? 'primary' : 'danger'} className="flex-1" disabled={!parseFloat(tradeAmount) || parseFloat(tradeAmount) <= 0}>
                        {tradeMode === 'buy' ? helpers.t('trade.buy') : helpers.t('trade.sell')}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
             <div className="bg-gray-900 rounded-xl w-full max-w-sm border border-gray-700 shadow-2xl">
                 <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                     <h3 className="font-bold flex items-center gap-2"><Settings size={18}/> {helpers.t('settings.title')}</h3>
                     <button onClick={() => setShowSettings(false)}><X size={20}/></button>
                 </div>
                 <div className="p-4 space-y-4">
                     <div>
                         <label className="block text-xs text-gray-400 uppercase font-bold mb-2">{helpers.t('settings.lang')}</label>
                         <div className="flex gap-2">
                             <button onClick={() => setLanguage('ru')} className={`flex-1 py-2 rounded border transition-colors ${language === 'ru' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>Русский</button>
                             <button onClick={() => setLanguage('en')} className={`flex-1 py-2 rounded border transition-colors ${language === 'en' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>English</button>
                         </div>
                     </div>
                     <hr className="border-gray-800" />
                     <div>
                         <label className="block text-xs text-gray-400 uppercase font-bold mb-2">{helpers.t('admin.title')}</label>
                         {!isAdmin ? (
                             <div className="flex gap-2">
                                 <input 
                                    type="password" 
                                    placeholder={helpers.t('admin.enter_pin')}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm outline-none focus:border-blue-500"
                                    value={adminPin}
                                    onChange={(e) => setAdminPin(e.target.value)}
                                 />
                                 <Button size="sm" onClick={unlockAdmin}>{helpers.t('admin.unlock')}</Button>
                             </div>
                         ) : (
                             <div className="space-y-3 p-3 bg-red-900/10 border border-red-500/20 rounded">
                                 <div className="text-xs text-red-400 font-bold flex items-center gap-1"><ShieldAlert size={12}/> {helpers.t('admin.access_granted')}</div>
                                 <div className="grid grid-cols-2 gap-2">
                                     <Button size="sm" variant="danger" onClick={() => actions.adminAddCash(10000)}>+10k $</Button>
                                     <Button size="sm" variant="danger" onClick={() => actions.adminAddCash(1000000)}>+1m $</Button>
                                 </div>
                                 <div>
                                     <label className="text-[10px] text-gray-400 block mb-1">{helpers.t('admin.set_score')}</label>
                                     <input type="range" min="300" max="850" value={state.creditScore} onChange={(e) => actions.adminSetScore(parseInt(e.target.value))} className="w-full accent-red-500" />
                                 </div>
                                 <select className="w-full bg-gray-800 text-xs p-1 rounded" onChange={(e) => actions.adminSetEdu(e.target.value as EducationLevel)} value={state.education}>
                                     {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                                 </select>
                                  <select className="w-full bg-gray-800 text-xs p-1 rounded" onChange={(e) => actions.adminSetJob(e.target.value)} value={state.currentJob?.id || ''}>
                                     <option value="">No Job</option>
                                     {JOBS.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                 </select>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                    <h3 className="font-bold flex items-center gap-2 text-xl"><HelpCircle size={24} className="text-blue-400"/> {helpers.t('help.title')}</h3>
                    <button onClick={() => setShowHelp(false)} className="hover:text-white text-gray-400"><X size={24}/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400 font-bold text-center text-lg">{helpers.t('help.goal')}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><Briefcase size={16}/> {helpers.t('help.income_title')}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{helpers.t('help.income_text')}</p>
                        </div>
                        <div>
                            <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><LineChart size={16}/> {helpers.t('help.market_title')}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{helpers.t('help.market_text')}</p>
                        </div>
                        <div>
                            <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><Landmark size={16}/> {helpers.t('help.bank_title')}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{helpers.t('help.bank_text')}</p>
                        </div>
                        <div>
                            <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2"><Zap size={16}/> {helpers.t('help.intensity_title')}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{helpers.t('help.intensity_text')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-800 text-center">
                     <Button onClick={() => setShowHelp(false)} className="w-full">OK</Button>
                </div>
            </div>
        </div>
      )}

      {/* Game Over Screen */}
      {state.isGameOver && renderGameOver()}
    </div>
  );
}
