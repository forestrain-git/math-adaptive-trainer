// ==================== 题型标签 ====================

export type SkillTagId =
  | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6'
  | 'S1' | 'S2' | 'S3' | 'S4';

export interface SkillTagConfig {
  id: SkillTagId;
  name: string;
  category: 'addition' | 'subtraction';
  difficulty: number; // 1-5
  targetAverageTimeSeconds: number;
  description: string;
}

// ==================== 题目 ====================

export interface MathQuestion {
  id: string;
  expression: string;      // 例如 "52 - 27"
  answer: number;
  skillTag: SkillTagId;
  difficulty: number;
  operand1: number;
  operand2: number;
  operator: '+' | '-';
}

// ==================== 答题记录 ====================

export type ErrorType = 'calculation_error' | 'carry_error' | 'borrow_error' | 'slow_answer';

export interface AnswerRecord {
  id: string;
  sessionId: string;
  questionId: string;
  expression: string;
  skillTag: SkillTagId;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  errorType: ErrorType | null;
  answeredAt: string; // ISO 日期字符串
}

// ==================== 训练会话 ====================

export interface DailySession {
  id: string;
  date: string; // YYYY-MM-DD
  totalQuestions: number;
  correctCount: number;
  accuracy: number; // 0-1
  totalTimeSeconds: number;
  averageTimeSeconds: number;
  weakSkillTags: SkillTagId[];
  strongSkillTags: SkillTagId[];
  createdAt: string;
}

// ==================== 掌握度 ====================

export interface SkillMastery {
  skillTag: SkillTagId;
  masteryScore: number; // 0-100
  updatedAt: string;
}

// ==================== 题型表现统计 ====================

export interface SkillPerformance {
  skillTag: SkillTagId;
  totalAttempts: number;
  correctCount: number;
  accuracy: number; // 0-1
  averageTimeSeconds: number;
  targetTimeSeconds: number;
  consecutiveErrors: number;
  isWeak: boolean;
  isStrong: boolean;
}

// ==================== 家长日报 ====================

export interface ParentDailyReport {
  sessionId: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTimeSeconds: number;
  strongSkills: SkillTagId[];
  weakSkills: SkillTagId[];
  mainErrorTypes: { type: ErrorType; count: number }[];
  tomorrowSuggestion: string;
  parentFocus: string;
  localDataNotice: string;
}

// ==================== 题目配置 ====================

export interface QuestionConfig {
  skillTag: SkillTagId;
  count: number;
}
