export type Operation = 'multiplication' | 'division' | 'addition';

export interface PracticeSettings {
  operation: Operation;
  presentationMode: 'single' | 'all';
  numQuestions: number;
  multipliers: {
    digits1: number;
    digits2: number;
  };
  divisors: {
    digits1: number; // dividend
    digits2: number; // divisor
  };
  addition: {
    digits: number;
    rows: number; // 口数
    allowNegative: boolean;
  };
}

export interface Question {
  id: string;
  expression: string[]; // e.g., ['123', '×', '45'] or ['123', '45', '-67'] for addition
  answer: number;
}

export interface PracticeRecord {
  id: string;
  date: string;
  operation: Operation;
  settings: PracticeSettings;
  results: {
    question: Question;
    userAnswer: number | null;
    isCorrect: boolean;
  }[];
  timeMs: number;
}
