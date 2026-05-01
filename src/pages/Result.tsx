import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecords } from '../storageUtils';
import { PracticeRecord } from '../types';

export default function Result() {
  const navigate = useNavigate();
  const [record, setRecord] = useState<PracticeRecord | null>(null);

  useEffect(() => {
    const records = getRecords();
    if (records.length > 0) {
      setRecord(records[records.length - 1]);
    }
  }, []);

  if (!record) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>記録が見つかりません。</h2></div>;

  const correctCount = record.results.filter(r => r.isCorrect).length;
  const timeSeconds = (record.timeMs / 1000).toFixed(1);
  const accuracy = Math.round((correctCount / record.settings.numQuestions) * 100);

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>練習完了お疲れ様でした！</h1>
      
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
        <div style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '0.5rem' }}>スコア</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: accuracy === 100 ? 'var(--success-color)' : 'var(--primary-color)', marginBottom: '1.5rem', lineHeight: '1' }}>
          {correctCount} <span style={{ fontSize: '2rem', color: '#64748b' }}>/ {record.settings.numQuestions} 問正解</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>タイム</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeSeconds} 秒</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>正答率</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{accuracy}%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' }}>
        <button onClick={() => navigate('/settings')} className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>もう一度練習する</button>
        <button onClick={() => navigate('/')} className="btn" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: 'white', border: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>ダッシュボードへ</button>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#334155' }}>問題ごとの詳細</h2>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-color)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', color: '#64748b' }}>No.</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', color: '#64748b' }}>問題</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', color: '#64748b' }}>あなたの解答</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', color: '#64748b' }}>正解</th>
              </tr>
            </thead>
            <tbody>
              {record.results.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: r.isCorrect ? 'white' : '#fef2f2' }}>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{i + 1}</td>
                  <td style={{ padding: '1rem', whiteSpace: 'pre-line', lineHeight: '1.2' }}>{r.question.expression.join(record.operation === 'addition' ? '\n' : ' ')}</td>
                  <td style={{ padding: '1rem', color: r.isCorrect ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 'bold' }}>
                    {r.userAnswer !== null ? r.userAnswer : <span style={{ color: '#94a3b8' }}>未入力</span>}
                    {r.isCorrect ? ' ○' : ' ×'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.question.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
