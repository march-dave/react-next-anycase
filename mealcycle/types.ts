export type Medication = 'Ozempic' | 'Mounjaro' | 'Wegovy' | 'Zepbound' | 'Other'

export interface UserProfile {
  name: string
  medication: Medication
  dosageStage: 'Initiation' | 'Titration' | 'Maintenance'
  proteinTarget: number
  currentWeight: number
}

export interface DailyLog {
  day: string
  protein: number
  weight: number
  nausea: number
}
