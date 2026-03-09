
"use client";

import { useState, useEffect } from 'react';
import type { GameRound } from '@/lib/aviator-utils';

const STORAGE_KEY = 'aviator_insights_rounds';

export function useAviatorData() {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRounds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored rounds', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
    }
  }, [rounds, isLoaded]);

  const addRound = (multiplier: number) => {
    const newRound: GameRound = {
      id: Math.random().toString(36).substring(7),
      crashMultiplier: multiplier,
      timestamp: Date.now(),
    };
    setRounds(prev => [newRound, ...prev]);
  };

  const deleteRound = (id: string) => {
    setRounds(prev => prev.filter(r => r.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm('Clear all historical data?')) {
      setRounds([]);
    }
  };

  return { rounds, addRound, deleteRound, clearHistory, isLoaded };
}
