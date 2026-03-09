
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { analyzeGamePatterns, AnalyzeGamePatternsOutput } from '@/ai/flows/analyze-game-patterns';
import { GameRound } from '@/lib/aviator-utils';
import { BrainCircuit, Loader2, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatternAnalysisProps {
  history: GameRound[];
}

export function PatternAnalysis({ history }: PatternAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeGamePatternsOutput | null>(null);

  const handleAnalyze = async () => {
    if (history.length < 5) return;
    setLoading(true);
    try {
      const result = await analyzeGamePatterns({
        historicalGameData: history.map(r => ({ crashMultiplier: r.crashMultiplier }))
      });
      setAnalysis(result);
    } catch (e) {
      console.error('Analysis failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-accent" />
            <CardTitle className="font-headline text-xl">AI Pattern Analyst</CardTitle>
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || history.length < 5}
            variant="outline"
            className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Analyze Patterns
          </Button>
        </div>
        <CardDescription>
          Identify trends and safe zones based on your logged history using deep learning analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && !loading && (
          <div className="py-12 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-white/10">
            {history.length < 5 
              ? "Need more data (min 5 rounds) to perform AI analysis." 
              : "Click 'Analyze Patterns' to generate deep insights."}
          </div>
        )}

        {loading && (
          <div className="py-12 flex flex-col items-center gap-4 text-accent animate-pulse">
            <BrainCircuit className="h-12 w-12" />
            <p className="font-headline">AI is processing data patterns...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-accent">
                  <BarChart3 className="h-4 w-4" /> Common Multipliers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.commonCrashMultipliers.map((m, i) => (
                    <Badge key={i} variant="secondary" className="bg-secondary/50 text-base py-1 px-3">
                      {m.toFixed(2)}x
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase text-green-400">
                  <ShieldCheck className="h-4 w-4" /> Strategic Safe Zones
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.safeZones.map((z, i) => (
                    <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20 text-base py-1 px-3">
                      {z}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/20 rounded-lg border border-white/5">
              <h4 className="text-sm font-semibold uppercase mb-2 text-muted-foreground">Statistical Trends</h4>
              <p className="text-sm leading-relaxed text-foreground/90 font-body">
                {analysis.statisticalTrends}
              </p>
            </div>
            
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tighter italic">
              * AI analysis is based purely on provided historical data. Future results are never guaranteed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
