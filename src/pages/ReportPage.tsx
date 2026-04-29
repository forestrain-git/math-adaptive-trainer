import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillMastery, ParentDailyReport } from '../types';
import { getDailySessionById, getAnswerRecordsBySessionId, getAllSkillMasteries } from '../db';
import { generateParentDailyReport, formatSkillName } from '../services/reportService';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}分${s}秒`;
}

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ParentDailyReport | null>(null);
  const [masteriesBefore, setMasteriesBefore] = useState<SkillMastery[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    async function loadData() {
      const [session, records, masteries] = await Promise.all([
        getDailySessionById(sessionId!),
        getAnswerRecordsBySessionId(sessionId!),
        getAllSkillMasteries(),
      ]);

      if (!session) {
        setLoading(false);
        return;
      }

      setMasteriesBefore(masteries);
      const generatedReport = generateParentDailyReport(session, records, masteries, masteries);
      setReport(generatedReport);
      setLoading(false);
    }

    loadData();
  }, [sessionId]);

  if (loading) {
    return <div className="empty-state">加载中...</div>;
  }

  if (!report) {
    return (
      <div className="empty-state">
        未找到训练记录。
        <button className="btn-secondary" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h1 className="page-title">今日训练日报</h1>

      <div className="card">
        <div className="report-section">
          <div className="report-section-title">今日完成情况</div>
          <div className="stat-row">
            <div className="stat-item">
              <div className="stat-value">{report.totalQuestions}</div>
              <div className="stat-label">完成题数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{report.correctCount}</div>
              <div className="stat-label">正确题数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{(report.accuracy * 100).toFixed(0)}%</div>
              <div className="stat-label">正确率</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatTime(report.totalTimeSeconds)}</div>
              <div className="stat-label">总用时</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{report.averageTimeSeconds.toFixed(1)}s</div>
              <div className="stat-label">平均用时</div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <div className="report-section-title">强项题型</div>
          {report.strongSkills.length > 0 ? (
            <div>
              {report.strongSkills.map((skill) => (
                <span key={skill} className="tag tag-strong">
                  {formatSkillName(skill)}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ color: '#90a4ae' }}>暂无强项</div>
          )}
        </div>

        <div className="report-section">
          <div className="report-section-title">弱项题型</div>
          {report.weakSkills.length > 0 ? (
            <div>
              {report.weakSkills.map((skill) => (
                <span key={skill} className="tag tag-weak">
                  {formatSkillName(skill)}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ color: '#90a4ae' }}>暂无弱项，表现不错！</div>
          )}
        </div>

        <div className="report-section">
          <div className="report-section-title">主要错误类型</div>
          {report.mainErrorTypes.length > 0 ? (
            <div>
              {report.mainErrorTypes.map((et) => (
                <span key={et.type} className="tag tag-error">
                  {et.type === 'calculation_error' && '普通计算错误'}
                  {et.type === 'carry_error' && '进位错误'}
                  {et.type === 'borrow_error' && '退位错误'}
                  {et.type === 'slow_answer' && '用时偏长'}
                  ({et.count})
                </span>
              ))}
            </div>
          ) : (
            <div style={{ color: '#90a4ae' }}>没有错误，太棒了！</div>
          )}
        </div>

        <div className="report-section">
          <div className="report-section-title">明日训练建议</div>
          <div className="report-suggestion">{report.tomorrowSuggestion}</div>
        </div>

        <div className="report-section">
          <div className="report-section-title">家长关注点</div>
          <div className="report-focus">{report.parentFocus}</div>
        </div>

        <div className="report-section">
          <div className="report-section-title">各题型掌握度</div>
          {masteriesBefore.map((m) => (
            <div key={m.skillTag} className="mastery-change-item">
              <span className="mastery-name">{formatSkillName(m.skillTag)}</span>
              <span className="mastery-score" style={{ color: m.masteryScore >= 80 ? '#2e7d32' : m.masteryScore >= 50 ? '#f57c00' : '#c62828' }}>
                {m.masteryScore}分
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="local-data-notice">{report.localDataNotice}</div>

      <button className="btn-secondary" onClick={() => navigate('/')}>
        返回首页
      </button>
    </div>
  );
}
