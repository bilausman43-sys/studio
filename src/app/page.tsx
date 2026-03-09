
"use client";

import { useAviatorData } from '@/hooks/use-aviator-data';
import { RoundInput } from '@/components/aviator/round-input';
import { ProbabilityChart } from '@/components/aviator/probability-chart';
import { StrategySimulator } from '@/components/aviator/strategy-simulator';
import { PatternAnalysis } from '@/components/aviator/pattern-analysis';
import { HistoryList } from '@/components/aviator/history-list';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  PlaneTakeoff, 
  ExternalLink, 
  LayoutDashboard, 
  BarChart2, 
  History as HistoryIcon,
  HelpCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { rounds, addRound, deleteRound, clearHistory, isLoaded } = useAviatorData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PlaneTakeoff className="h-10 w-10 text-accent animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <PlaneTakeoff className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold tracking-tight text-white">
                AVIATOR<span className="text-accent">INSIGHTS</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Analytics Terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="default" className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold shadow-[0_0_20px_rgba(82,160,255,0.3)]">
              <a href="https://royal.casino" target="_blank" rel="noopener noreferrer">
                Launch Royal.Casino
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Input */}
          <div className="lg:col-span-4 space-y-6">
            <section className="animate-in fade-in slide-in-from-left duration-500">
              <RoundInput onAdd={addRound} />
            </section>

            <section className="animate-in fade-in slide-in-from-left duration-500 delay-150">
              <HistoryList 
                rounds={rounds} 
                onDelete={deleteRound} 
                onClear={clearHistory} 
              />
            </section>

            <Card className="glass-panel p-4 bg-accent/5 border-accent/20">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-accent mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">How to use?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Manually log the crash multiplier for each round in your game. 
                    Aviator Insights will use this data to generate a survival probability curve 
                    and suggest "safe zones" for your betting strategy.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Visuals & Analysis */}
          <div className="lg:col-span-8 space-y-8">
            {/* Probability Overview */}
            <section className="animate-in fade-in slide-in-from-right duration-500">
              <ProbabilityChart history={rounds} />
            </section>

            {/* Pattern Analysis */}
            <section className="animate-in fade-in slide-in-from-right duration-500 delay-150">
              <PatternAnalysis history={rounds} />
            </section>

            {/* Simulation */}
            <section className="animate-in fade-in slide-in-from-right duration-500 delay-300">
              <StrategySimulator history={rounds} />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aviator Insights. Professional Analysis Tools.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase font-bold text-red-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Not for Gambling Advice
            </span>
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <span className="text-[10px] uppercase font-bold text-accent">Analytical Purposes Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple Card helper for small bits
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-card text-card-foreground shadow-sm", className)}>
      {children}
    </div>
  );
}
