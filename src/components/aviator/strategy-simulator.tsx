
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { simulateStrategy, GameRound, SimulationResult } from '@/lib/aviator-utils';
import { TrendingUp, TrendingDown, RefreshCw, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategySimulatorProps {
  history: GameRound[];
}

export function StrategySimulator({ history }: StrategySimulatorProps) {
  const [betAmount, setBetAmount] = useState('10');
  const [targetMultiplier, setTargetMultiplier] = useState('1.5');
  const [initialBalance, setInitialBalance] = useState('100');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    const res = simulateStrategy(
      history,
      parseFloat(betAmount),
      parseFloat(targetMultiplier),
      parseFloat(initialBalance)
    );
    setResult(res);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-accent" />
          <CardTitle className="font-headline text-lg">Strategy Simulator</CardTitle>
        </div>
        <CardDescription>Test hypothetical bets against your collected history.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Initial Balance</Label>
            <Input 
              type="number" 
              value={initialBalance} 
              onChange={e => setInitialBalance(e.target.value)} 
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Bet Amount</Label>
            <Input 
              type="number" 
              value={betAmount} 
              onChange={e => setBetAmount(e.target.value)} 
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Target Cashout (x)</Label>
            <Input 
              type="number" 
              step="0.1"
              value={targetMultiplier} 
              onChange={e => setTargetMultiplier(e.target.value)} 
              className="bg-secondary/50"
            />
          </div>
        </div>

        <Button onClick={handleSimulate} disabled={history.length === 0} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold">
          <RefreshCw className="mr-2 h-4 w-4" />
          Run Simulation
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Final Balance" value={`$${result.finalBalance.toFixed(2)}`} />
              <StatCard label="Net Profit" value={`$${result.netProfit.toFixed(2)}`} color={result.netProfit >= 0 ? 'text-green-400' : 'text-red-400'} />
              <StatCard label="Win Rate" value={`${((result.wins / result.totalBets) * 100).toFixed(1)}%`} />
              <StatCard label="Total Bets" value={result.totalBets.toString()} />
            </div>

            <div className="max-h-[200px] overflow-auto rounded-lg border border-white/5 bg-black/20">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-secondary/80 backdrop-blur-md">
                  <tr>
                    <th className="p-2 text-left font-medium">Round Multiplier</th>
                    <th className="p-2 text-left font-medium">Result</th>
                    <th className="p-2 text-right font-medium">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rounds.map((r, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="p-2">{r.multiplier.toFixed(2)}x</td>
                      <td className="p-2">
                        {r.won ? (
                          <span className="flex items-center gap-1 text-green-400"><TrendingUp className="h-3 w-3" /> Win</span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400"><TrendingDown className="h-3 w-3" /> Loss</span>
                        )}
                      </td>
                      <td className={cn("p-2 text-right font-mono", r.profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                        {r.profit >= 0 ? '+' : ''}{r.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-white/5">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={cn("text-lg font-bold font-headline mt-1", color)}>{value}</p>
    </div>
  );
}
