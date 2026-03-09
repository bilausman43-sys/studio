
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameRound } from '@/lib/aviator-utils';
import { History, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  rounds: GameRound[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryList({ rounds, onDelete, onClear }: HistoryListProps) {
  return (
    <Card className="glass-panel">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-accent" />
          <CardTitle className="font-headline text-lg">History</CardTitle>
        </div>
        {rounds.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {rounds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic text-sm">
            No rounds logged yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
            {rounds.map((round) => (
              <div 
                key={round.id} 
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-white/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono text-lg font-bold text-accent">
                    {round.crashMultiplier.toFixed(2)}x
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(round.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(round.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
