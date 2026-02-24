export type Medication = 'Ozempic' | 'Mounjaro' | 'Wegovy' | 'Zepbound' | 'Saxenda';

export type DosageStage = 'Initiation' | 'Titration' | 'Maintenance';

export interface UserProfile {
  name: string;
  medication: Medication;
  dosageStage: DosageStage;
  proteinTarget: number;
  currentWeight: number;
}

export interface DailyLog {
  day: string;
  protein: number;
  weight: number;
  symptomFree: boolean;
}

export interface Meal {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  protein: number;
  calories: number;
}
