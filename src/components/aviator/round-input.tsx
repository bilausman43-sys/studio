
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, PlaneTakeoff } from 'lucide-react';

interface RoundInputProps {
  onAdd: (multiplier: number) => void;
}

export function RoundInput({ onAdd }: RoundInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 1) {
      onAdd(num);
      setValue('');
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-5 w-5 text-accent" />
          <CardTitle className="font-headline text-lg">Log Round Data</CardTitle>
        </div>
        <CardDescription>Enter the crash multiplier of the last round.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            min="1"
            placeholder="e.g. 1.45"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-secondary/50 border-white/5"
          />
          <Button type="submit" className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
