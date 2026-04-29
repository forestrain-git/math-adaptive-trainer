import { SkillTagConfig } from '../types';

export const SKILL_TAGS: SkillTagConfig[] = [
  {
    id: 'A1',
    name: '10 以内加减',
    category: 'addition',
    difficulty: 1,
    targetAverageTimeSeconds: 3,
    description: '10 以内加法或减法',
  },
  {
    id: 'A2',
    name: '整十加减',
    category: 'addition',
    difficulty: 1,
    targetAverageTimeSeconds: 3,
    description: '整十数相加或相减',
  },
  {
    id: 'A3',
    name: '两位数加一位数不进位',
    category: 'addition',
    difficulty: 2,
    targetAverageTimeSeconds: 5,
    description: '两位数加一位数，个位相加不产生进位',
  },
  {
    id: 'A4',
    name: '两位数加一位数进位',
    category: 'addition',
    difficulty: 3,
    targetAverageTimeSeconds: 6,
    description: '两位数加一位数，个位相加产生进位',
  },
  {
    id: 'A5',
    name: '两位数加两位数不进位',
    category: 'addition',
    difficulty: 2,
    targetAverageTimeSeconds: 6,
    description: '两位数加两位数，各位相加均不进位',
  },
  {
    id: 'A6',
    name: '两位数加两位数进位',
    category: 'addition',
    difficulty: 4,
    targetAverageTimeSeconds: 8,
    description: '两位数加两位数，至少一位产生进位',
  },
  {
    id: 'S1',
    name: '两位数减一位数不退位',
    category: 'subtraction',
    difficulty: 2,
    targetAverageTimeSeconds: 5,
    description: '两位数减一位数，个位够减不退位',
  },
  {
    id: 'S2',
    name: '两位数减一位数退位',
    category: 'subtraction',
    difficulty: 3,
    targetAverageTimeSeconds: 6,
    description: '两位数减一位数，个位不够减需退位',
  },
  {
    id: 'S3',
    name: '两位数减两位数不退位',
    category: 'subtraction',
    difficulty: 2,
    targetAverageTimeSeconds: 6,
    description: '两位数减两位数，各位够减不退位',
  },
  {
    id: 'S4',
    name: '两位数减两位数退位',
    category: 'subtraction',
    difficulty: 4,
    targetAverageTimeSeconds: 8,
    description: '两位数减两位数，至少一位需退位',
  },
];

export const ALL_SKILL_TAG_IDS = SKILL_TAGS.map(t => t.id);

export function getSkillTagConfig(id: string): SkillTagConfig | undefined {
  return SKILL_TAGS.find(t => t.id === id);
}

export function getTargetTime(skillTag: string): number {
  const config = getSkillTagConfig(skillTag);
  return config?.targetAverageTimeSeconds ?? 5;
}
