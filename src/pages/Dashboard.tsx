import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecords } from '../storageUtils';
import { PracticeRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const data = records.slice(-20).map((r, idx) => ({
    name: `${idx + 1}回目`,
    accuracy: Math.round((r.results.filter(res => res.isCorrect).length / r.settings.numQuestions) * 100),
    time: parseFloat((r.timeMs / 1000).toFixed(1)),
    operation: r.operation === 'multiplication' ? '掛' : r.operation === 'division' ? '割' : '見',
  }));

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>ダッシュボード</h1>
        <Link to="/settings" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          + 練習を始める
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧮</div>
          <h2 style={{ marginBottom: '1rem' }}>まだ練習記録がありません</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>右上のボタンから最初の練習を始めて、成績の推移を記録しましょう！</p>
          <Link to="/settings" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>設定してスタート</Link>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>最近の学習状況</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>累計練習回数</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{records.length} <span style={{ fontSize: '1rem', color: '#64748b' }}>回</span></div>
              </div>
              <div style={{ flex: 1, background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>直近正答率</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#15803d' }}>
                  {data[data.length - 1].accuracy} <span style={{ fontSize: '1rem' }}>%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
            <div className="card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>正答率の推移 (直近20回)</h2>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }} 
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="var(--primary-color)" strokeWidth={3} name="正答率(%)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>解答タイムの推移 (直近20回)</h2>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }} 
                    />
                    <Line type="monotone" dataKey="time" stroke="var(--success-color)" strokeWidth={3} name="タイム(秒)" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
