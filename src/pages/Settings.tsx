import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSettings } from '../storageUtils';
import { PracticeSettings, Operation } from '../types';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PracticeSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const handleChange = (field: keyof PracticeSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleStart = () => {
    saveSettings(settings);
    navigate('/practice');
  };

  // UI用のスタイル定数
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' };
  const inputStyle = { display: 'block', width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '1rem' };
  const flexRowStyle = { display: 'flex', gap: '1rem', marginBottom: '1.5rem' };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>練習設定</h1>
      <div className="card">
        
        <div>
          <label style={labelStyle}>種目</label>
          <select 
            value={settings.operation} 
            onChange={(e) => handleChange('operation', e.target.value as Operation)}
            style={inputStyle}
          >
            <option value="multiplication">掛け算</option>
            <option value="division">割り算</option>
            <option value="addition">見取り算</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>出題形式</label>
          <div style={{ ...flexRowStyle, marginBottom: '1.5rem', gap: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="presentationMode" 
                value="single" 
                checked={settings.presentationMode === 'single' || !settings.presentationMode} 
                onChange={() => handleChange('presentationMode', 'single')} 
              />
              1問ずつ
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="presentationMode" 
                value="all" 
                checked={settings.presentationMode === 'all'} 
                onChange={() => handleChange('presentationMode', 'all')} 
              />
              一気に表示
            </label>
          </div>
        </div>

        <div>
          <label style={labelStyle}>問題数</label>
          <input 
            type="number" 
            min="1"
            max="100"
            value={settings.numQuestions} 
            onChange={(e) => handleChange('numQuestions', parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>

        {settings.operation === 'multiplication' && (
           <div style={flexRowStyle}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>かけられる数 (桁)</label>
                <input type="number" min="1" max="10" value={settings.multipliers.digits1} onChange={(e) => handleChange('multipliers', {...settings.multipliers, digits1: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>かける数 (桁)</label>
                <input type="number" min="1" max="10" value={settings.multipliers.digits2} onChange={(e) => handleChange('multipliers', {...settings.multipliers, digits2: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
           </div>
        )}

        {settings.operation === 'division' && (
           <div style={flexRowStyle}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>割られる数 (桁)</label>
                <input type="number" min="2" max="10" value={settings.divisors.digits1} onChange={(e) => handleChange('divisors', {...settings.divisors, digits1: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>割る数 (桁)</label>
                <input type="number" min="1" max="9" value={settings.divisors.digits2} onChange={(e) => handleChange('divisors', {...settings.divisors, digits2: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
           </div>
        )}

        {settings.operation === 'addition' && (
           <div style={flexRowStyle}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>桁数</label>
                <input type="number" min="1" max="10" value={settings.addition.digits} onChange={(e) => handleChange('addition', {...settings.addition, digits: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>口数 (行数)</label>
                <input type="number" min="2" max="30" value={settings.addition.rows} onChange={(e) => handleChange('addition', {...settings.addition, rows: parseInt(e.target.value)})} style={{...inputStyle, marginBottom: 0}} />
              </div>
           </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
           <button onClick={() => navigate('/')} className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}>キャンセル</button>
           <button onClick={handleStart} className="btn btn-primary" style={{ flex: 1, fontSize: '1.1rem' }}>この設定で練習を開始</button>
        </div>
      </div>
    </div>
  );
}
