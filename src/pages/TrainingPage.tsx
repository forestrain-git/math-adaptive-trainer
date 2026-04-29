import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathQuestion, AnswerRecord } from '../types';
import {
  generateInitialTrainingBlock,
  generateNextTrainingBlock,
} from '../services/questionEngine';
import { checkAnswer, calculateAnswerTime, detectBasicErrorType } from '../services/answerService';
import {
  getWeakSkillTags,
  getStrongSkillTags,
  updateSkillMasteries,
} from '../services/adaptiveEngine';
import {
  saveDailySession,
  saveAnswerRecords,
  getAllSkillMasteries,
  updateSkillMasteries as saveMasteries,
} from '../db';

const FEEDBACK_DURATION_CORRECT = 600; // ms
const FEEDBACK_DURATION_INCORRECT = 1500; // ms
const QUESTIONS_PER_BLOCK = 25;
const TOTAL_BLOCKS = 4;
const TOTAL_QUESTIONS = QUESTIONS_PER_BLOCK * TOTAL_BLOCKS;

interface FeedbackState {
  show: boolean;
  isCorrect: boolean;
  message: string;
}

export default function TrainingPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Session
  const [sessionId] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  // Training state
  const [currentBlock, setCurrentBlock] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Input and feedback
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>({ show: false, isCorrect: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timing
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const sessionStartTime = useRef(Date.now());

  // Generate initial block on mount
  useEffect(() => {
    const initialQuestions = generateInitialTrainingBlock();
    setQuestions(initialQuestions);
    setQuestionStartTime(Date.now());
    sessionStartTime.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Session timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQuestion = questions[currentIndex];
  const overallIndex = (currentBlock - 1) * QUESTIONS_PER_BLOCK + currentIndex + 1;

  // Focus input when question changes
  useEffect(() => {
    if (!isResting && !feedback.show && currentQuestion) {
      inputRef.current?.focus();
    }
  }, [currentQuestion, isResting, feedback.show]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || isSubmitting || isResting || isFinished) return;

    const answer = userInput.trim();
    if (answer === '') return;

    const userAnswerNum = parseInt(answer, 10);
    if (isNaN(userAnswerNum)) return;

    setIsSubmitting(true);

    const endTime = Date.now();
    const timeSpent = calculateAnswerTime(questionStartTime, endTime);
    const isCorrect = checkAnswer(currentQuestion, userAnswerNum);
    const errorType = detectBasicErrorType(currentQuestion, userAnswerNum, timeSpent);

    const record: AnswerRecord = {
      id: `${sessionId}-${overallIndex}`,
      sessionId,
      questionId: currentQuestion.id,
      expression: currentQuestion.expression,
      skillTag: currentQuestion.skillTag,
      correctAnswer: currentQuestion.answer,
      userAnswer: userAnswerNum,
      isCorrect,
      timeSpentSeconds: timeSpent,
      errorType,
      answeredAt: new Date().toISOString(),
    };

    setRecords((prev) => [...prev, record]);

    if (isCorrect) {
      setFeedback({
        show: true,
        isCorrect: true,
        message: '答对了！',
      });
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `正确答案：${currentQuestion.answer}，这题先记下，最后一起看。`,
      });
    }

    // Auto advance after feedback duration
    const duration = isCorrect ? FEEDBACK_DURATION_CORRECT : FEEDBACK_DURATION_INCORRECT;

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setUserInput('');

      const newIndex = currentIndex + 1;
      const isBlockEnd = newIndex >= QUESTIONS_PER_BLOCK;
      const isTrainingEnd = overallIndex >= TOTAL_QUESTIONS;

      if (isTrainingEnd) {
        setIsFinished(true);
        return;
      }

      if (isBlockEnd) {
        setIsResting(true);
        return;
      }

      setCurrentIndex(newIndex);
      setQuestionStartTime(Date.now());
      setIsSubmitting(false);
    }, duration);
  }, [currentQuestion, currentIndex, overallIndex, userInput, isSubmitting, isResting, isFinished, questionStartTime, sessionId]);

  // Handle finish training
  useEffect(() => {
    if (!isFinished) return;

    async function finishTraining() {
      const allRecords = [...records];
      const weakTags = getWeakSkillTags(allRecords);
      const strongTags = getStrongSkillTags(allRecords);
      const correctCount = allRecords.filter((r) => r.isCorrect).length;
      const totalTime = allRecords.reduce((sum, r) => sum + r.timeSpentSeconds, 0);

      const session = {
        id: sessionId,
        date: new Date().toISOString().split('T')[0],
        totalQuestions: TOTAL_QUESTIONS,
        correctCount,
        accuracy: correctCount / TOTAL_QUESTIONS,
        totalTimeSeconds: totalTime,
        averageTimeSeconds: totalTime / TOTAL_QUESTIONS,
        weakSkillTags: weakTags,
        strongSkillTags: strongTags,
        createdAt: new Date().toISOString(),
      };

      // Update masteries
      const oldMasteries = await getAllSkillMasteries();
      const newMasteries = updateSkillMasteries(oldMasteries, allRecords);
      await saveMasteries(newMasteries);

      // Save session and records
      await saveDailySession(session);
      await saveAnswerRecords(allRecords);

      // Navigate to result page
      navigate(`/result/${sessionId}`);
    }

    finishTraining();
  }, [isFinished, records, sessionId, navigate]);

  const handleContinueRest = useCallback(() => {
    const allRecords = [...records];
    const nextQuestions = generateNextTrainingBlock(allRecords, currentBlock + 1);

    setQuestions(nextQuestions);
    setCurrentBlock((prev) => prev + 1);
    setCurrentIndex(0);
    setIsResting(false);
    setQuestionStartTime(Date.now());
    setIsSubmitting(false);
  }, [records, currentBlock]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow digits, max 3 chars
    if (/^\d{0,3}$/.test(val)) {
      setUserInput(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (questions.length === 0) {
    return <div className="empty-state">题目准备中...</div>;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Progress */}
      <div className="progress-text">
        第 {currentBlock} 组 / {TOTAL_BLOCKS} 组 · 第 {overallIndex} 题 / {TOTAL_QUESTIONS} 题
        <span style={{ float: 'right', color: '#78909c' }}>用时 {formatTime(elapsedSeconds)}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(overallIndex / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Question */}
      {!isResting && currentQuestion && (
        <>
          <div className="question-display">{currentQuestion.expression} = ?</div>

          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className="number-input"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting || feedback.show}
            autoComplete="off"
          />

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting || feedback.show || userInput.trim() === ''}
            style={{ marginTop: '24px' }}
          >
            提交答案
          </button>
        </>
      )}

      {/* Feedback */}
      {feedback.show && (
        <div className={`feedback-area ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
          {feedback.message}
        </div>
      )}

      {/* Rest overlay */}
      {isResting && (
        <div className="rest-overlay">
          <div className="rest-title">休息一下！</div>
          <div className="rest-message">
            已完成 {overallIndex} 题，完成度 {(overallIndex / TOTAL_QUESTIONS * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: '18px', color: '#78909c', marginBottom: '32px' }}>
            {overallIndex >= 75 ? '最后一组，加油！' : '做得很好，继续加油！'}
          </div>
          <button className="btn-primary" onClick={handleContinueRest}>
            继续
          </button>
        </div>
      )}
    </div>
  );
}
