
export interface GameRound {
  id: string;
  crashMultiplier: number;
  timestamp: number;
}

export interface SimulationResult {
  initialBalance: number;
  finalBalance: number;
  totalBets: number;
  wins: number;
  losses: number;
  netProfit: number;
  rounds: {
    multiplier: number;
    betAmount: number;
    cashoutAt: number;
    profit: number;
    won: boolean;
  }[];
}

export function calculateCrashProbability(history: GameRound[]): { x: number; prob: number }[] {
  if (history.length === 0) return [];

  const maxMultiplier = Math.max(...history.map(r => r.crashMultiplier), 10);
  const data: { x: number; prob: number }[] = [];
  
  // Create buckets from 1.0 to maxMultiplier
  for (let i = 1.0; i <= Math.min(maxMultiplier, 20); i += 0.5) {
    const survived = history.filter(r => r.crashMultiplier >= i).length;
    const prob = (survived / history.length) * 100;
    data.push({ x: Number(i.toFixed(1)), prob: Number(prob.toFixed(1)) });
  }

  return data;
}

export function simulateStrategy(
  history: GameRound[],
  betAmount: number,
  targetMultiplier: number,
  initialBalance: number
): SimulationResult {
  let balance = initialBalance;
  let wins = 0;
  let losses = 0;
  const rounds: SimulationResult['rounds'] = [];

  history.forEach(round => {
    const currentBet = Math.min(betAmount, balance);
    if (currentBet <= 0) return;

    balance -= currentBet;
    const won = round.crashMultiplier >= targetMultiplier;
    const profit = won ? currentBet * targetMultiplier : 0;
    balance += profit;

    if (won) wins++;
    else losses++;

    rounds.push({
      multiplier: round.crashMultiplier,
      betAmount: currentBet,
      cashoutAt: targetMultiplier,
      profit: profit - currentBet,
      won,
    });
  });

  return {
    initialBalance,
    finalBalance: balance,
    totalBets: rounds.length,
    wins,
    losses,
    netProfit: balance - initialBalance,
    rounds,
  };
}
