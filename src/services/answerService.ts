import { MathQuestion, ErrorType } from '../types';
import { getTargetTime } from '../data/skillTags';

export function checkAnswer(question: MathQuestion, userAnswer: number | null): boolean {
  if (userAnswer === null || userAnswer === undefined) {
    return false;
  }
  return userAnswer === question.answer;
}

export function calculateAnswerTime(startTime: number, endTime: number): number {
  const diff = (endTime - startTime) / 1000;
  return Math.max(diff, 0.1);
}

export function detectBasicErrorType(
  question: MathQuestion,
  userAnswer: number | null,
  timeSpentSeconds: number
): ErrorType | null {
  if (userAnswer === null || userAnswer === undefined) {
    return null;
  }

  const isCorrect = userAnswer === question.answer;
  const targetTime = getTargetTime(question.skillTag);

  if (isCorrect) {
    if (timeSpentSeconds > targetTime * 2) {
      return 'slow_answer';
    }
    return null;
  }

  // 答案错误的情况
  if (question.skillTag === 'A4' || question.skillTag === 'A6') {
    if (userAnswer === question.answer - 10) {
      return 'carry_error';
    }
  }

  if (question.skillTag === 'S2' || question.skillTag === 'S4') {
    if (userAnswer === question.answer + 10) {
      return 'borrow_error';
    }
  }

  return 'calculation_error';
}
