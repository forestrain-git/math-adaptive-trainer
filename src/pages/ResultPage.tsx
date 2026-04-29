import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnswerRecord, DailySession } from '../types';
import { getDailySessionById, getAnswerRecordsBySessionId } from '../db';
import { generateWrongQuestionExplanation } from '../services/reportService';
import { generateErrorVariants } from '../services/variantService';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}分${s}秒`;
}

function getErrorTypeLabel(type: string | null): string {
  switch (type) {
    case 'calculation_error': return '普通计算错误';
    case 'carry_error': return '进位错误';
    case 'borrow_error': return '退位错误';
    case 'slow_answer': return '用时偏长';
    default: return '';
  }
}

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<DailySession | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    async function loadData() {
      const [sess, recs] = await Promise.all([
        getDailySessionById(sessionId!),
        getAnswerRecordsBySessionId(sessionId!),
      ]);
      setSession(sess ?? null);
      setRecords(recs);
      setLoading(false);
    }

    loadData();
  }, [sessionId]);

  if (loading) {
    return <div className="empty-state">加载中...</div>;
  }

  if (!session) {
    return (
      <div className="empty-state">
        未找到训练记录。
        <button className="btn-secondary" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  const wrongRecords = records.filter((r) => !r.isCorrect);

  return (
    <div style={{ padding: '20px 0' }}>
      <h1 className="page-title">训练完成！</h1>

      {/* Stats */}
      <div className="card">
        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-value">{session.totalQuestions}</div>
            <div className="stat-label">总题数</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{session.correctCount}</div>
            <div className="stat-label">正确题数</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{(session.accuracy * 100).toFixed(0)}%</div>
            <div className="stat-label">正确率</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{formatTime(session.totalTimeSeconds)}</div>
            <div className="stat-label">总用时</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{session.averageTimeSeconds.toFixed(1)}s</div>
            <div className="stat-label">平均用时</div>
          </div>
        </div>
      </div>

      {/* Wrong questions */}
      {wrongRecords.length > 0 ? (
        <div className="card">
          <div className="card-title">错题复盘（{wrongRecords.length} 道）</div>
          {wrongRecords.map((record, idx) => {
            const variants = generateErrorVariants(record, 2);
            return (
              <div key={record.id} className="wrong-item">
                <div className="wrong-expression">
                  第 {idx + 1} 题：{record.expression}
                </div>
                <div className="wrong-detail">
                  你的答案：{record.userAnswer} · 正确答案：{record.correctAnswer}
                  {record.errorType && (
                    <span style={{ marginLeft: '12px' }}>
                      · 错误类型：{getErrorTypeLabel(record.errorType)}
                    </span>
                  )}
                </div>
                <div className="wrong-explanation">
                  {generateWrongQuestionExplanation(record)}
                </div>
                <div className="variants">
                  <div className="variants-title">类似练习：</div>
                  {variants.map((v) => (
                    <div key={v.id} className="variant-item">
                      {v.expression} = ?
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: '#2e7d32', fontSize: '20px', fontWeight: 600 }}>
          太棒了，全对！
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <button className="btn-primary" onClick={() => navigate(`/report/${sessionId}`)}>
          查看家长日报
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    </div>
  );
}
