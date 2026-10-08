export type Goal = { emoji: string; label: string; target: number; dateLabel: string; monthsLeft: string };

// Cycled together by GoalsSection: the thought bubble shows the emoji, the
// card below shows the matching category — same goal, same moment.
export const GOALS: Goal[] = [
  { emoji: "✈️", label: "Viagem", target: 1200, dateLabel: "14 de set. de 2026", monthsLeft: "3 meses para a meta" },
  { emoji: "🏠", label: "Casa própria", target: 50000, dateLabel: "dez. de 2028", monthsLeft: "2 anos para a meta" },
  { emoji: "🎓", label: "Curso", target: 800, dateLabel: "10 de nov. de 2026", monthsLeft: "2 meses para a meta" },
  { emoji: "📱", label: "Celular novo", target: 3000, dateLabel: "jan. de 2027", monthsLeft: "4 meses para a meta" },
];
