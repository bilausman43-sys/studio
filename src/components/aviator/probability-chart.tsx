
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { calculateCrashProbability, GameRound } from '@/lib/aviator-utils';
import { Info } from 'lucide-react';

interface ProbabilityChartProps {
  history: GameRound[];
}

export function ProbabilityChart({ history }: ProbabilityChartProps) {
  const data = useMemo(() => calculateCrashProbability(history), [history]);

  if (history.length < 5) {
    return (
      <Card className="glass-panel flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <Info className="h-10 w-10 text-muted-foreground mb-4" />
        <CardTitle className="font-headline mb-2">Insufficient Data</CardTitle>
        <CardDescription>Log at least 5 rounds to see the probability distribution chart.</CardDescription>
      </Card>
    );
  }

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Survival Probability</CardTitle>
        <CardDescription>Historical likelihood of reaching a specific multiplier.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ChartContainer config={{
            prob: { label: "Survival Probability (%)", color: "hsl(var(--accent))" }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="x" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: 'Multiplier', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  unit="%"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="prob" 
                  stroke="hsl(var(--accent))" 
                  fillOpacity={1} 
                  fill="url(#colorProb)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
