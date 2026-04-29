import Dexie from 'dexie';
import type { DailySession, AnswerRecord, SkillMastery } from '../types';
import { ALL_SKILL_TAG_IDS } from '../data/skillTags';

class MathTrainerDB extends Dexie {
  dailySessions!: Dexie.Table<DailySession, string>;
  answerRecords!: Dexie.Table<AnswerRecord, [string, string]>;
  skillMasteries!: Dexie.Table<SkillMastery, string>;

  constructor() {
    super('MathTrainerDB');

    this.version(1).stores({
      dailySessions: 'id',
      answerRecords: '[sessionId+id]',
      skillMasteries: 'skillTag',
    });
  }
}

const db = new MathTrainerDB();

export async function initializeDatabase(): Promise<void> {
  try {
    await db.open();
    await initializeDefaultSkillMasteries();
  } catch (error) {
    console.error('[MathTrainerDB] IndexedDB initialization failed:', error);
    throw error;
  }
}

export async function initializeDefaultSkillMasteries(): Promise<void> {
  const count = await db.skillMasteries.count();
  if (count > 0) {
    return;
  }

  const defaultMasteries: SkillMastery[] = ALL_SKILL_TAG_IDS.map((skillTag) => ({
    skillTag,
    masteryScore: 60,
    updatedAt: new Date().toISOString(),
  }));

  await db.skillMasteries.bulkAdd(defaultMasteries);
}

export async function saveDailySession(session: DailySession): Promise<string> {
  await db.dailySessions.put(session);
  return session.id;
}

export async function saveAnswerRecords(records: AnswerRecord[]): Promise<void> {
  if (records.length === 0) {
    return;
  }
  await db.answerRecords.bulkPut(records);
}

export async function getAnswerRecordsBySessionId(sessionId: string): Promise<AnswerRecord[]> {
  return db.answerRecords
    .where('sessionId')
    .equals(sessionId)
    .sortBy('answeredAt');
}

export async function getDailySessionById(sessionId: string): Promise<DailySession | undefined> {
  return db.dailySessions.get(sessionId);
}

export async function getLatestDailySession(): Promise<DailySession | undefined> {
  const sessions = await db.dailySessions
    .orderBy('createdAt')
    .reverse()
    .limit(1)
    .toArray();
  return sessions[0];
}

export async function getAllSkillMasteries(): Promise<SkillMastery[]> {
  return db.skillMasteries.toArray();
}

export async function updateSkillMasteries(masteries: SkillMastery[]): Promise<void> {
  if (masteries.length === 0) {
    return;
  }
  await db.skillMasteries.bulkPut(masteries);
}

export async function resetAllLocalData(): Promise<void> {
  await db.dailySessions.clear();
  await db.answerRecords.clear();
  await db.skillMasteries.clear();
  await initializeDefaultSkillMasteries();
}

export { db };
