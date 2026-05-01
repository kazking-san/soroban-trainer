import { PracticeSettings, Question } from './types';

const getRandomDigitString = (digits: number, noZeroStart = true): string => {
  let res = '';
  for (let i = 0; i < digits; i++) {
    if (i === 0 && noZeroStart) {
      if (digits === 1) {
        res += Math.floor(Math.random() * 9) + 1; // 1-9
      } else {
        res += Math.floor(Math.random() * 9) + 1; // 1-9
      }
    } else {
      res += Math.floor(Math.random() * 10); // 0-9
    }
  }
  return res;
};

export const generateQuestions = (settings: PracticeSettings): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < settings.numQuestions; i++) {
    let answer = 0;
    let expression: string[] = [];

    if (settings.operation === 'multiplication') {
      const a = parseInt(getRandomDigitString(settings.multipliers.digits1));
      const b = parseInt(getRandomDigitString(settings.multipliers.digits2));
      answer = a * b;
      expression = [a.toString(), '×', b.toString()];
    } else if (settings.operation === 'division') {
      const divisorDigits = settings.divisors.digits2;
      const dividendDigits = settings.divisors.digits1;
      const quotientDigits = Math.max(1, dividendDigits - divisorDigits + 1);
      
      let divisor = parseInt(getRandomDigitString(divisorDigits));
      if (divisor === 0) divisor = 1; // 安全のため
      
      let quotient = parseInt(getRandomDigitString(quotientDigits));
      let dividend = quotient * divisor;
      
      // 厳密な被除数桁数への調整試行
      let attempts = 0;
      while (dividend.toString().length !== dividendDigits && dividendDigits > divisorDigits && attempts < 10) {
         quotient = parseInt(getRandomDigitString(quotientDigits));
         dividend = quotient * divisor;
         attempts++;
      }
      
      answer = quotient;
      expression = [dividend.toString(), '÷', divisor.toString()];
    } else if (settings.operation === 'addition') {
      let sum = 0;
      const rows: string[] = [];
      for (let r = 0; r < settings.addition.rows; r++) {
        let num = parseInt(getRandomDigitString(settings.addition.digits));
        if (settings.addition.allowNegative && r > 0 && Math.random() > 0.5) {
            if (sum - num >= 0) {
                num = -num;
            }
        }
        sum += num;
        rows.push(num.toString());
      }
      answer = sum;
      expression = rows;
    }

    questions.push({
      id: `q_${Date.now()}_${i}`,
      expression,
      answer,
    });
  }

  return questions;
};
