export interface ExamHistory {

  score: number;

  total: number;

  date?: string;

}

export interface StudentAnalysis {

  predictedScore: number;

  strengths: string[];

  weaknesses: string[];

  studyPlan: string;

  comment: string;

}