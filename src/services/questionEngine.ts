import { MathQuestion, AnswerRecord, SkillTagId } from '../types';
import { getTargetTime } from '../data/skillTags';

// ==================== 随机数工具 ====================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ==================== 按技能标签生成题目 ====================

function generateA1(): MathQuestion {
  const isAddition = Math.random() < 0.5;
  let operand1: number;
  let operand2: number;
  let answer: number;

  if (isAddition) {
    operand1 = randomInt(1, 9);
    operand2 = randomInt(1, 10 - operand1);
    answer = operand1 + operand2;
  } else {
    operand1 = randomInt(1, 10);
    operand2 = randomInt(1, operand1);
    answer = operand1 - operand2;
  }

  return {
    id: generateId(),
    expression: `${operand1} ${isAddition ? '+' : '-'} ${operand2}`,
    answer,
    skillTag: 'A1',
    difficulty: 1,
    operand1,
    operand2,
    operator: isAddition ? '+' : '-',
  };
}

function generateA2(): MathQuestion {
  const isAddition = Math.random() < 0.5;
  const multiples = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  if (isAddition) {
    const operand1 = randomPick(multiples);
    const maxOperand2 = Math.min(100 - operand1, 90);
    const validMultiples = multiples.filter(m => m <= maxOperand2 && m >= 10);
    const operand2 = randomPick(validMultiples.length > 0 ? validMultiples : [10]);
    return {
      id: generateId(),
      expression: `${operand1} + ${operand2}`,
      answer: operand1 + operand2,
      skillTag: 'A2',
      difficulty: 1,
      operand1,
      operand2,
      operator: '+',
    };
  } else {
    const operand1 = randomPick(multiples);
    const validMultiples = multiples.filter(m => m < operand1);
    const operand2 = randomPick(validMultiples.length > 0 ? validMultiples : [10]);
    return {
      id: generateId(),
      expression: `${operand1} - ${operand2}`,
      answer: operand1 - operand2,
      skillTag: 'A2',
      difficulty: 1,
      operand1,
      operand2,
      operator: '-',
    };
  }
}

function generateA3(): MathQuestion {
  // 两位数加一位数不进位
  let operand1 = randomInt(11, 89);
  const maxOperand2 = Math.min(9, 9 - (operand1 % 10));
  const minOperand2 = 1;
  if (maxOperand2 < minOperand2) {
    // 调整个位使能生成有效的一位数
    operand1 = operand1 - (operand1 % 10) + randomInt(0, 8);
  }
  const operand2 = randomInt(1, Math.min(9, 9 - (operand1 % 10)));
  const answer = operand1 + operand2;

  return {
    id: generateId(),
    expression: `${operand1} + ${operand2}`,
    answer,
    skillTag: 'A3',
    difficulty: 2,
    operand1,
    operand2,
    operator: '+',
  };
}

function generateA4(): MathQuestion {
  // 两位数加一位数进位
  let operand1 = randomInt(11, 89);
  const minOperand2 = Math.max(1, 10 - (operand1 % 10));
  if (minOperand2 > 9) {
    operand1 = operand1 - (operand1 % 10) + randomInt(1, 9);
  }
  const operand2 = randomInt(Math.max(1, 10 - (operand1 % 10)), 9);
  // 确保结果不超过99
  if (operand1 + operand2 > 99) {
    operand1 = 89;
  }

  return {
    id: generateId(),
    expression: `${operand1} + ${operand2}`,
    answer: operand1 + operand2,
    skillTag: 'A4',
    difficulty: 3,
    operand1,
    operand2,
    operator: '+',
  };
}

function generateA5(): MathQuestion {
  // 两位数加两位数不进位
  let operand1 = randomInt(10, 89);
  let operand2 = randomInt(10, 89);

  const maxTens1 = 8 - Math.floor(operand1 / 10);
  const maxOnes1 = 9 - (operand1 % 10);

  // 确保operand2的十位和个位都不进位
  const validTens = Math.min(maxTens1, 8);
  const validOnes = Math.min(maxOnes1, 9);

  if (validTens < 1 || validOnes < 0) {
    operand1 = randomInt(10, 50);
    operand2 = randomInt(10, 40);
  } else {
    const tens2 = randomInt(1, validTens);
    const ones2 = randomInt(0, validOnes);
    operand2 = tens2 * 10 + ones2;
  }

  // 双重检查
  const onesSum = (operand1 % 10) + (operand2 % 10);
  const tensSum = Math.floor(operand1 / 10) + Math.floor(operand2 / 10);

  if (onesSum >= 10 || tensSum >= 10 || operand1 + operand2 > 99) {
    // 重新生成一个简单的不进位组合
    operand1 = randomInt(10, 40);
    operand2 = randomInt(10, 50 - operand1);
    // 确保不进位
    if ((operand1 % 10) + (operand2 % 10) >= 10) {
      operand2 = operand2 - (operand2 % 10);
    }
  }

  return {
    id: generateId(),
    expression: `${operand1} + ${operand2}`,
    answer: operand1 + operand2,
    skillTag: 'A5',
    difficulty: 2,
    operand1,
    operand2,
    operator: '+',
  };
}

function generateA6(): MathQuestion {
  // 两位数加两位数进位
  let operand1 = randomInt(10, 89);
  let operand2 = randomInt(10, 89);

  const ones1 = operand1 % 10;
  const ones2 = operand2 % 10;
  const tens1 = Math.floor(operand1 / 10);
  const tens2 = Math.floor(operand2 / 10);

  const hasOnesCarry = ones1 + ones2 >= 10;
  const hasTensCarry = tens1 + tens2 >= 10;

  if (!hasOnesCarry && !hasTensCarry) {
    // 强制产生进位：调整个位
    const newOnes2 = randomInt(10 - ones1, 9);
    operand2 = tens2 * 10 + newOnes2;
  }

  // 确保结果不超过100
  if (operand1 + operand2 > 100) {
    operand1 = randomInt(10, 50);
    operand2 = randomInt(10, Math.min(50, 100 - operand1));
    // 确保至少有一位进位
    if ((operand1 % 10) + (operand2 % 10) < 10 && Math.floor(operand1 / 10) + Math.floor(operand2 / 10) < 10) {
      operand2 = operand2 + (10 - (operand1 % 10));
    }
  }

  return {
    id: generateId(),
    expression: `${operand1} + ${operand2}`,
    answer: operand1 + operand2,
    skillTag: 'A6',
    difficulty: 4,
    operand1,
    operand2,
    operator: '+',
  };
}

function generateS1(): MathQuestion {
  // 两位数减一位数不退位
  const operand1 = randomInt(11, 99);
  const maxOperand2 = Math.min(9, operand1 % 10);
  const operand2 = randomInt(0, maxOperand2);

  return {
    id: generateId(),
    expression: `${operand1} - ${operand2}`,
    answer: operand1 - operand2,
    skillTag: 'S1',
    difficulty: 2,
    operand1,
    operand2,
    operator: '-',
  };
}

function generateS2(): MathQuestion {
  // 两位数减一位数退位
  const operand1 = randomInt(11, 99);
  const minOperand2 = (operand1 % 10) + 1;
  if (minOperand2 > 9) {
    // 个位是9，无法退位，调整个位
    const adjustedOperand1 = operand1 - (operand1 % 10) + randomInt(1, 8);
    const operand2 = randomInt((adjustedOperand1 % 10) + 1, 9);
    return {
      id: generateId(),
      expression: `${adjustedOperand1} - ${operand2}`,
      answer: adjustedOperand1 - operand2,
      skillTag: 'S2',
      difficulty: 3,
      operand1: adjustedOperand1,
      operand2,
      operator: '-',
    };
  }
  const operand2 = randomInt(minOperand2, 9);

  return {
    id: generateId(),
    expression: `${operand1} - ${operand2}`,
    answer: operand1 - operand2,
    skillTag: 'S2',
    difficulty: 3,
    operand1,
    operand2,
    operator: '-',
  };
}

function generateS3(): MathQuestion {
  // 两位数减两位数不退位
  let operand1 = randomInt(20, 99);
  let operand2 = randomInt(10, 89);

  // 确保 operand2 < operand1
  if (operand2 >= operand1) {
    operand2 = randomInt(10, operand1 - 1);
  }

  const ones1 = operand1 % 10;
  const ones2 = operand2 % 10;
  const tens1 = Math.floor(operand1 / 10);
  const tens2 = Math.floor(operand2 / 10);

  // 确保不退位
  if (ones1 < ones2) {
    operand2 = tens2 * 10 + ones1;
  }
  if (tens1 < tens2) {
    operand2 = (tens1 - 1) * 10 + (operand2 % 10);
  }

  // 再次确保 operand2 < operand1 且不退位
  if (operand2 >= operand1 || (operand1 % 10) < (operand2 % 10) || Math.floor(operand1 / 10) < Math.floor(operand2 / 10)) {
    operand1 = randomInt(50, 99);
    const tens2Val = randomInt(1, Math.floor(operand1 / 10) - 1);
    const ones2Val = randomInt(0, operand1 % 10);
    operand2 = tens2Val * 10 + ones2Val;
  }

  return {
    id: generateId(),
    expression: `${operand1} - ${operand2}`,
    answer: operand1 - operand2,
    skillTag: 'S3',
    difficulty: 2,
    operand1,
    operand2,
    operator: '-',
  };
}

function generateS4(): MathQuestion {
  // 两位数减两位数退位：至少有一位需要退位，结果为正
  let operand1: number;
  let operand2: number;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    operand1 = randomInt(20, 99);
    operand2 = randomInt(10, operand1 - 1);
    attempts++;
  } while (
    attempts < maxAttempts &&
    (operand1 % 10) >= (operand2 % 10) &&
    Math.floor(operand1 / 10) >= Math.floor(operand2 / 10)
  );

  return {
    id: generateId(),
    expression: `${operand1} - ${operand2}`,
    answer: operand1 - operand2,
    skillTag: 'S4',
    difficulty: 4,
    operand1,
    operand2,
    operator: '-',
  };
}

const GENERATORS: Record<SkillTagId, () => MathQuestion> = {
  A1: generateA1,
  A2: generateA2,
  A3: generateA3,
  A4: generateA4,
  A5: generateA5,
  A6: generateA6,
  S1: generateS1,
  S2: generateS2,
  S3: generateS3,
  S4: generateS4,
};

// ==================== 公开函数 ====================

export function generateQuestionBySkillTag(skillTag: SkillTagId): MathQuestion {
  const generator = GENERATORS[skillTag];
  if (!generator) {
    throw new Error(`Unknown skill tag: ${skillTag}`);
  }
  return generator();
}

export function generateQuestionsBySkillTag(skillTag: SkillTagId, count: number): MathQuestion[] {
  const questions: MathQuestion[] = [];
  const seen = new Set<string>();
  const maxAttempts = 50;
  let attempts = 0;

  while (questions.length < count && attempts < maxAttempts * count) {
    const q = generateQuestionBySkillTag(skillTag);
    const key = `${q.operand1},${q.operand2},${q.operator}`;

    if (!seen.has(key)) {
      seen.add(key);
      questions.push(q);
    }
    attempts++;
  }

  return questions;
}

export function generateInitialTrainingBlock(): MathQuestion[] {
  const distribution: Record<SkillTagId, number> = {
    A1: 4,
    A2: 4,
    A3: 2,
    A4: 2,
    A5: 2,
    A6: 2,
    S1: 2,
    S2: 2,
    S3: 2,
    S4: 3,
  };

  const questions: MathQuestion[] = [];
  for (const [skillTag, count] of Object.entries(distribution)) {
    questions.push(...generateQuestionsBySkillTag(skillTag as SkillTagId, count));
  }

  return shuffleArray(questions);
}

export function generateNextTrainingBlock(answeredRecords: AnswerRecord[], blockIndex: number): MathQuestion[] {
  if (blockIndex < 2 || blockIndex > 4) {
    throw new Error('blockIndex must be 2, 3, or 4');
  }

  const weakSkills = analyzeCurrentWeakSkills(answeredRecords);
  const allSkillIds: SkillTagId[] = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'S1', 'S2', 'S3', 'S4'];
  const strongSkills = allSkillIds.filter(id => !weakSkills.includes(id));
  const distribution = buildSkillDistributionForNextBlock(weakSkills, strongSkills, blockIndex);

  const questions: MathQuestion[] = [];
  for (const { skillTag, count } of distribution) {
    questions.push(...generateQuestionsBySkillTag(skillTag, count));
  }

  return shuffleArray(questions);
}

export function analyzeCurrentWeakSkills(answeredRecords: AnswerRecord[]): SkillTagId[] {
  const allSkillIds: SkillTagId[] = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'S1', 'S2', 'S3', 'S4'];
  const weakSkills: SkillTagId[] = [];

  for (const skillTag of allSkillIds) {
    const records = answeredRecords.filter(r => r.skillTag === skillTag);
    if (records.length === 0) continue;

    const targetTime = getTargetTime(skillTag);
    const correctCount = records.filter(r => r.isCorrect).length;
    const accuracy = correctCount / records.length;
    const totalTime = records.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
    const averageTime = totalTime / records.length;

    // 检查连续错误（按答题顺序）
    const sortedRecords = [...records].sort(
      (a, b) => new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime()
    );
    let consecutiveErrors = 0;
    let maxConsecutiveErrors = 0;
    for (const r of sortedRecords) {
      if (!r.isCorrect) {
        consecutiveErrors++;
        maxConsecutiveErrors = Math.max(maxConsecutiveErrors, consecutiveErrors);
      } else {
        consecutiveErrors = 0;
      }
    }

    const isWeak =
      accuracy < 0.7 ||
      averageTime > targetTime * 1.5 ||
      maxConsecutiveErrors >= 2;

    if (isWeak) {
      weakSkills.push(skillTag);
    }
  }

  return weakSkills;
}

export function buildSkillDistributionForNextBlock(
  weakSkills: SkillTagId[],
  strongSkills: SkillTagId[],
  _blockIndex: number
): { skillTag: SkillTagId; count: number }[] {
  const allSkillIds: SkillTagId[] = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'S1', 'S2', 'S3', 'S4'];
  const distribution = new Map<SkillTagId, number>();

  // 初始化所有技能为0
  for (const id of allSkillIds) {
    distribution.set(id, 0);
  }

  // 弱项技能：最多60%（15题），每个最多3题
  const weakSkillsFiltered = weakSkills.filter(w => allSkillIds.includes(w));
  const weakCount = Math.min(15, weakSkillsFiltered.length * 3);

  if (weakSkillsFiltered.length > 0) {
    const baseCount = Math.floor(weakCount / weakSkillsFiltered.length);
    let remainder = weakCount - baseCount * weakSkillsFiltered.length;

    for (const skill of weakSkillsFiltered) {
      let count = baseCount;
      if (remainder > 0) {
        count++;
        remainder--;
      }
      distribution.set(skill, Math.min(count, 3));
    }
  }

  // 强项技能：至少20%（5题）
  const strongCount = Math.max(5, strongSkills.length > 0 ? Math.min(strongSkills.length * 1, 8) : 0);
  if (strongSkills.length > 0) {
    const baseCount = Math.floor(strongCount / strongSkills.length);
    let remainder = strongCount - baseCount * strongSkills.length;

    for (const skill of strongSkills) {
      let count = baseCount;
      if (remainder > 0) {
        count++;
        remainder--;
      }
      const current = distribution.get(skill) ?? 0;
      distribution.set(skill, current + count);
    }
  }

  // 随机复习：从剩余技能中抽取3-5题
  const remainingSkills = allSkillIds.filter(
    id => !weakSkillsFiltered.includes(id) && !strongSkills.includes(id)
  );
  const reviewCount = randomInt(3, 5);
  if (remainingSkills.length > 0) {
    const baseCount = Math.floor(reviewCount / remainingSkills.length);
    let remainder = reviewCount - baseCount * remainingSkills.length;

    for (const skill of remainingSkills) {
      let count = baseCount;
      if (remainder > 0) {
        count++;
        remainder--;
      }
      const current = distribution.get(skill) ?? 0;
      distribution.set(skill, current + count);
    }
  }

  // 如果A1是弱项，不降级，增加A1并减少难题（A6, S4）
  if (weakSkillsFiltered.includes('A1')) {
    const currentA1 = distribution.get('A1') ?? 0;
    if (currentA1 < 3) {
      distribution.set('A1', 3);
      // 减少难题来平衡
      const a6Current = distribution.get('A6') ?? 0;
      const s4Current = distribution.get('S4') ?? 0;
      if (a6Current > 0) {
        distribution.set('A6', a6Current - 1);
      } else if (s4Current > 0) {
        distribution.set('S4', s4Current - 1);
      }
    }
  }

  // 填充剩余槽位，从其他技能均匀分配
  let total = Array.from(distribution.values()).reduce((sum, c) => sum + c, 0);
  let fillIndex = 0;
  while (total < 25) {
    const skill = allSkillIds[fillIndex % allSkillIds.length];
    const current = distribution.get(skill) ?? 0;
    distribution.set(skill, current + 1);
    total++;
    fillIndex++;
  }

  // 如果超出25，从分配最多的技能中减去
  while (total > 25) {
    let maxSkill = allSkillIds[0];
    let maxCount = distribution.get(maxSkill) ?? 0;
    for (const skill of allSkillIds) {
      const count = distribution.get(skill) ?? 0;
      if (count > maxCount) {
        maxCount = count;
        maxSkill = skill;
      }
    }
    if (maxCount > 0) {
      distribution.set(maxSkill, maxCount - 1);
      total--;
    } else {
      break;
    }
  }

  if (total !== 25) {
    throw new Error(`Distribution total must be 25, got ${total}`);
  }

  const result: { skillTag: SkillTagId; count: number }[] = [];
  for (const [skillTag, count] of distribution.entries()) {
    if (count > 0) {
      result.push({ skillTag: skillTag as SkillTagId, count });
    }
  }

  return result;
}
