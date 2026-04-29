import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DailySession } from '../types';
import { getLatestDailySession, resetAllLocalData } from '../db';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}分${s}秒`;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [latestSession, setLatestSession] = useState<DailySession | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    getLatestDailySession().then((session) => {
      setLatestSession(session ?? null);
    });
  }, []);

  const handleStart = () => {
    navigate('/training');
  };

  const handleReset = async () => {
    await resetAllLocalData();
    setLatestSession(null);
    setShowResetDialog(false);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <h1 className="page-title">Math Adaptive Trainer</h1>

      <div className="local-data-notice">
        训练数据保存在当前浏览器本地，不会上传到 GitHub。
      </div>

      <button className="btn-primary" onClick={handleStart}>
        开始今日训练
      </button>

      {latestSession ? (
        <div className="card">
          <div className="card-title">最近一次训练</div>
          <div style={{ fontSize: '15px', color: '#546e7a', lineHeight: 1.8 }}>
            <div>日期：{latestSession.date}</div>
            <div>
              正确率：{(latestSession.accuracy * 100).toFixed(0)}%（
              {latestSession.correctCount}/{latestSession.totalQuestions}）
            </div>
            <div>总用时：{formatTime(latestSession.totalTimeSeconds)}</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">还没有训练记录，开始第一次训练吧！</div>
      )}

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button className="btn-danger" onClick={() => setShowResetDialog(true)}>
          重置本地数据
        </button>
      </div>

      {showResetDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-title">确认重置？</div>
            <div className="dialog-message">
              此操作将删除所有训练记录和掌握度数据，不可恢复。
            </div>
            <div className="dialog-actions">
              <button className="btn-secondary" onClick={() => setShowResetDialog(false)}>
                取消
              </button>
              <button className="btn-danger" onClick={handleReset}>
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
