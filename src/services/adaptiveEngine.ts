import {
  AnswerRecord,
  SkillTagId,
  SkillPerformance,
  SkillMastery,
} from '../types';
import { SKILL_TAGS, getTargetTime } from '../data/skillTags';

// ==================== Skill Performance ====================

export function calculateSkillPerformance(
  records: AnswerRecord[]
): Map<SkillTagId, SkillPerformance> {
  const result = new Map<SkillTagId, SkillPerformance>();

  // Group records by skillTag
  const bySkill = new Map<SkillTagId, AnswerRecord[]>();
  for (const record of records) {
    const list = bySkill.get(record.skillTag) ?? [];
    list.push(record);
    bySkill.set(record.skillTag, list);
  }

  for (const [skillTag, skillRecords] of bySkill) {
    const totalAttempts = skillRecords.length;
    const correctCount = skillRecords.filter(r => r.isCorrect).length;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;
    const averageTimeSeconds =
      totalAttempts > 0
        ? skillRecords.reduce((sum, r) => sum + r.timeSpentSeconds, 0) / totalAttempts
        : 0;
    const targetTimeSeconds = getTargetTime(skillTag);

    // Calculate max consecutive incorrect answers (ordered by answeredAt)
    const sorted = [...skillRecords].sort(
      (a, b) => new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime()
    );
    let consecutiveErrors = 0;
    let currentStreak = 0;
    for (const r of sorted) {
      if (!r.isCorrect) {
        currentStreak++;
        consecutiveErrors = Math.max(consecutiveErrors, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const isWeak =
      accuracy < 0.7 ||
      averageTimeSeconds > targetTimeSeconds * 1.5 ||
      consecutiveErrors >= 2;

    const isStrong =
      accuracy >= 0.85 &&
      averageTimeSeconds <= targetTimeSeconds * 1.2 &&
      totalAttempts >= 3;

    result.set(skillTag, {
      skillTag,
      totalAttempts,
      correctCount,
      accuracy,
      averageTimeSeconds,
      targetTimeSeconds,
      consecutiveErrors,
      isWeak,
      isStrong,
    });
  }

  return result;
}

export function getWeakSkillTags(records: AnswerRecord[]): SkillTagId[] {
  const perf = calculateSkillPerformance(records);
  const weak: SkillTagId[] = [];
  for (const [skillTag, p] of perf) {
    if (p.isWeak) {
      weak.push(skillTag);
    }
  }
  return weak;
}

export function getStrongSkillTags(records: AnswerRecord[]): SkillTagId[] {
  const perf = calculateSkillPerformance(records);
  const strong: SkillTagId[] = [];
  for (const [skillTag, p] of perf) {
    if (p.isStrong) {
      strong.push(skillTag);
    }
  }
  return strong;
}

// ==================== Skill Mastery Update ====================

export function updateSkillMasteries(
  oldMasteries: SkillMastery[],
  records: AnswerRecord[]
): SkillMastery[] {
  const perfMap = calculateSkillPerformance(records);
  const updatedAt = new Date().toISOString();

  // Start with a copy of old masteries
  const result: SkillMastery[] = oldMasteries.map(m => ({ ...m }));

  for (const [skillTag, perf] of perfMap) {
    const accuracyScore = perf.accuracy * 100;

    let speedScore: number;
    if (perf.averageTimeSeconds <= perf.targetTimeSeconds) {
      speedScore = 100;
    } else {
      speedScore = Math.max(
        0,
        100 -
          ((perf.averageTimeSeconds - perf.targetTimeSeconds) /
            perf.targetTimeSeconds) *
            100
      );
    }

    const todayScore = accuracyScore * 0.7 + speedScore * 0.3;

    const existing = result.find(m => m.skillTag === skillTag);
    const oldScore = existing?.masteryScore ?? 0;
    const newScore = Math.round(oldScore * 0.8 + todayScore * 0.2);
    const clampedScore = Math.max(0, Math.min(100, newScore));

    if (existing) {
      existing.masteryScore = clampedScore;
      existing.updatedAt = updatedAt;
    } else {
      result.push({
        skillTag,
        masteryScore: clampedScore,
        updatedAt,
      });
    }
  }

  return result;
}

// ==================== Tomorrow Suggestion ====================

export function generateTomorrowSuggestion(
  records: AnswerRecord[],
  _masteries: SkillMastery[]
): string {
  const weakSkills = getWeakSkillTags(records);

  if (weakSkills.length === 0) {
    return '今天表现很好！建议明天保持正常训练量。';
  }

  const messages: string[] = [];

  if (weakSkills.includes('A1')) {
    messages.push('10 以内加减法需要加强，建议每天额外练习 10-20 道基础题。');
  }

  if (weakSkills.includes('A3') || weakSkills.includes('A4')) {
    messages.push('两位数加一位数需要练习，建议关注进位规则。');
  }

  if (weakSkills.includes('S2') || weakSkills.includes('S4')) {
    messages.push('退位减法需要加强，建议复习借位方法。');
  }

  if (weakSkills.includes('A5') || weakSkills.includes('A6')) {
    messages.push('两位数加法需要更多练习，建议分步计算。');
  }

  // If multiple weak skills and no specific message matched for all of them
  if (weakSkills.length >= 2) {
    const weakNames = weakSkills
      .map(id => SKILL_TAGS.find(t => t.id === id)?.name ?? id)
      .join('、');
    messages.push(`建议明天重点练习 ${weakNames}，每次练习 10 题即可。`);
  }

  // If only one weak skill and no specific message matched
  if (weakSkills.length === 1 && messages.length === 0) {
    const name = SKILL_TAGS.find(t => t.id === weakSkills[0])?.name ?? weakSkills[0];
    messages.push(`建议明天重点练习 ${name}，每次练习 10 题即可。`);
  }

  return messages.join('\n');
}
