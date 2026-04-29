import { AnswerRecord, MathQuestion } from '../types';
import { generateQuestionBySkillTag } from './questionEngine';

/**
 * Generate error variants for a wrong answer record.
 * Each variant has the same skillTag but different operands from the original and from each other.
 */
export function generateErrorVariants(
  record: AnswerRecord,
  count: number = 2
): MathQuestion[] {
  const variants: MathQuestion[] = [];
  const maxAttempts = 30;
  let attempts = 0;

  // Helper to check if two questions have the same operands (same expression)
  function isSameQuestion(a: MathQuestion, b: MathQuestion): boolean {
    return (
      a.operand1 === b.operand1 &&
      a.operand2 === b.operand2 &&
      a.operator === b.operator
    );
  }

  // Helper to check if a question is already in the variants list
  function isDuplicate(q: MathQuestion): boolean {
    return variants.some(v => isSameQuestion(v, q));
  }

  // Create a pseudo-question from the record for comparison
  const originalQuestion: MathQuestion = {
    id: record.questionId,
    expression: record.expression,
    answer: record.correctAnswer,
    skillTag: record.skillTag,
    difficulty: 1, // placeholder, not used for comparison
    operand1: 0,   // will be parsed from expression
    operand2: 0,
    operator: record.expression.includes('+') ? '+' : '-',
  };

  // Try to parse operands from the expression string
  const exprMatch = record.expression.match(/(\d+)\s*([+\-])\s*(\d+)/);
  if (exprMatch) {
    originalQuestion.operand1 = parseInt(exprMatch[1], 10);
    originalQuestion.operand2 = parseInt(exprMatch[3], 10);
  }

  while (variants.length < count && attempts < maxAttempts) {
    attempts++;

    const candidate = generateQuestionBySkillTag(record.skillTag);
    if (!candidate) {
      continue;
    }

    // Must be different from original
    if (isSameQuestion(candidate, originalQuestion)) {
      continue;
    }

    // Must be different from already generated variants
    if (isDuplicate(candidate)) {
      continue;
    }

    variants.push(candidate);
  }

  return variants;
}
