import { PracticeRecord, PracticeSettings } from './types';

const STORAGE_KEY = 'soroban_practice_records';
const SETTINGS_KEY = 'soroban_practice_settings';

export const saveRecord = (record: PracticeRecord) => {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecords = (): PracticeRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSettings = (settings: PracticeSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = (): PracticeSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) return JSON.parse(data);
  
  return {
    operation: 'multiplication',
    presentationMode: 'single',
    numQuestions: 10,
    multipliers: { digits1: 2, digits2: 2 },
    divisors: { digits1: 4, digits2: 2 },
    addition: { digits: 3, rows: 5, allowNegative: false },
  };
};
