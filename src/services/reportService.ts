import {
  AnswerRecord,
  DailySession,
  ErrorType,
  ParentDailyReport,
  SkillMastery,
  SkillTagId,
} from '../types';
import { SKILL_TAGS } from '../data/skillTags';
import { generateTomorrowSuggestion } from './adaptiveEngine';

// ==================== Wrong Question Explanation ====================

export function generateWrongQuestionExplanation(record: AnswerRecord): string {
  const operator = record.expression.includes('+') ? '加' : '减';

  // SkillTag-specific explanations
  const skillExplanations: Record<string, string> = {
    A1: `这是基础的 10 以内${operator}法，${record.expression} = ${record.correctAnswer}。`,
    A2: `${record.expression} = ${record.correctAnswer}，整十数${operator}法注意末尾的 0。`,
    A3: `个位和个位相加，十位不变。${record.expression} = ${record.correctAnswer}。`,
    A4: `个位相加满 10 要向十位进 1。${record.expression} = ${record.correctAnswer}。`,
    A5: `两位数加两位数，个位和个位相加，十位和十位相加。${record.expression} = ${record.correctAnswer}。`,
    A6: `注意进位！个位相加满 10 要向十位进 1。${record.expression} = ${record.correctAnswer}。`,
    S1: `个位够减，直接减。${record.expression} = ${record.correctAnswer}。`,
    S2: `个位不够减，要从十位借 1 当 10。${record.expression} = ${record.correctAnswer}。`,
    S3: `两位数减两位数，个位和个位相减，十位和十位相减。${record.expression} = ${record.correctAnswer}。`,
    S4: `个位不够减，要从十位借 1 当 10。${record.expression} = ${record.correctAnswer}。`,
  };

  let explanation = skillExplanations[record.skillTag] ??
    `${record.expression} = ${record.correctAnswer}，再仔细算一遍哦。`;

  // Append error-type specific hint
  if (record.errorType === 'carry_error') {
    explanation += ' 注意进位！个位相加满 10 要进 1。';
  } else if (record.errorType === 'borrow_error') {
    explanation += ' 注意退位！个位不够减要从十位借 1。';
  } else if (record.errorType === 'calculation_error') {
    explanation += ' 计算时要细心，可以列竖式帮助检查。';
  } else if (record.errorType === 'slow_answer') {
    explanation += ' 可以多加练习，提高计算速度。';
  }

  return explanation;
}

// ==================== Main Error Types ====================

export function getMainErrorTypes(
  records: AnswerRecord[]
): { type: ErrorType; count: number }[] {
  const counts = new Map<ErrorType, number>();

  for (const record of records) {
    if (record.errorType !== null) {
      counts.set(record.errorType, (counts.get(record.errorType) ?? 0) + 1);
    }
  }

  const sorted = Array.from(counts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, 3);
}

// ==================== Skill Name Formatting ====================

export function formatSkillName(skillTag: SkillTagId): string {
  const config = SKILL_TAGS.find(t => t.id === skillTag);
  return config?.name ?? skillTag;
}

// ==================== Parent Daily Report ====================

export function generateParentDailyReport(
  session: DailySession,
  records: AnswerRecord[],
  _masteriesBefore: SkillMastery[],
  masteriesAfter: SkillMastery[]
): ParentDailyReport {
  const mainErrorTypes = getMainErrorTypes(records);
  const tomorrowSuggestion = generateTomorrowSuggestion(records, masteriesAfter);

  // Determine parent focus based on stats and error types
  const parentFocusParts: string[] = [];

  if (session.accuracy < 0.6) {
    parentFocusParts.push('今天正确率偏低，建议关注孩子是否理解题目。');
  }

  if (session.averageTimeSeconds > 10) {
    parentFocusParts.push('答题速度偏慢，建议加强基础练习。');
  }

  const hasCarryError = mainErrorTypes.some(e => e.type === 'carry_error');
  const hasBorrowError = mainErrorTypes.some(e => e.type === 'borrow_error');

  if (hasCarryError) {
    parentFocusParts.push('进位计算出错较多，建议复习进位规则。');
  }

  if (hasBorrowError) {
    parentFocusParts.push('退位计算出错较多，建议复习借位方法。');
  }

  const parentFocus =
    parentFocusParts.length > 0
      ? parentFocusParts.join('')
      : '今天整体表现不错，继续保持！';

  return {
    sessionId: session.id,
    date: session.date,
    totalQuestions: session.totalQuestions,
    correctCount: session.correctCount,
    accuracy: session.accuracy,
    totalTimeSeconds: session.totalTimeSeconds,
    averageTimeSeconds: session.averageTimeSeconds,
    strongSkills: session.strongSkillTags,
    weakSkills: session.weakSkillTags,
    mainErrorTypes,
    tomorrowSuggestion,
    parentFocus,
    localDataNotice: '当前报告来自本设备浏览器 IndexedDB。换设备不会自动同步。',
  };
}
