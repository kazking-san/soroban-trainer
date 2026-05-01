import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveRecord } from '../storageUtils';
import { generateQuestions } from '../mathUtils';
import { Question, PracticeRecord } from '../types';

export default function Practice() {
  const navigate = useNavigate();
  const [settings] = useState(() => getSettings());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const qs = generateQuestions(settings);
    setQuestions(qs);
    setInputValues(new Array(qs.length).fill(''));
    setStartTime(Date.now());
  }, [settings]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputValue.trim() === '' ? null : Number(inputValue);
      const newAnswers = [...answers, val];
      
      if (currentIndex + 1 < questions.length) {
        setAnswers(newAnswers);
        setInputValue('');
        setCurrentIndex(currentIndex + 1);
      } else {
        // Finish
        finishPractice(newAnswers);
      }
    }
  };

  const finishPractice = (finalAnswers: (number | null)[]) => {
    const timeMs = Date.now() - startTime;
    const results = questions.map((q, i) => ({
      question: q,
      userAnswer: finalAnswers[i] ?? null,
      isCorrect: finalAnswers[i] === q.answer
    }));

    const record: PracticeRecord = {
      id: `record_${Date.now()}`,
      date: new Date().toISOString(),
      operation: settings.operation,
      settings,
      results,
      timeMs,
    };

    saveRecord(record);
    navigate('/result', { replace: true });
  };

  if (questions.length === 0) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><h2>問題を作成中...</h2></div>;

  const currentQ = questions[currentIndex];
  const isAddition = settings.operation === 'addition';
  const isAllMode = settings.presentationMode === 'all';

  if (isAllMode) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>練習問題 (全 {questions.length} 問)</h2>
        
        {isAddition ? (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1px',
            background: 'var(--border-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ 
                flex: '1 1 120px',
                background: 'white',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '1rem',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}>
                <div style={{ width: '100%', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{i + 1}.</div>
                <div style={{ textAlign: 'right', lineHeight: '1.2', width: '100%', paddingRight: '0.5rem' }}>
                  {q.expression.map((num, idx) => <div key={idx}>{num}</div>)}
                </div>
                <div style={{ width: '100%', borderBottom: '2px solid black', margin: '0.5rem 0' }}></div>
                <input
                  type="number"
                  value={inputValues[i]}
                  onChange={(e) => {
                    const newVals = [...inputValues];
                    newVals[i] = e.target.value;
                    setInputValues(newVals);
                  }}
                  style={{
                    fontSize: '1.25rem',
                    padding: '0.25rem',
                    textAlign: 'right',
                    width: '100%',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.id} style={{ borderBottom: i < questions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <td style={{ padding: '1rem', width: '40px', color: '#64748b', textAlign: 'right' }}>{i + 1}.</td>
                    <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap', width: '50%' }}>{q.expression.join(' ')} = </td>
                    <td style={{ padding: '1rem' }}>
                      <input
                        type="number"
                        value={inputValues[i]}
                        onChange={(e) => {
                          const newVals = [...inputValues];
                          newVals[i] = e.target.value;
                          setInputValues(newVals);
                        }}
                        style={{
                          fontSize: '1.25rem',
                          padding: '0.5rem',
                          width: '150px',
                          border: '2px solid var(--border-color)',
                          borderRadius: '6px',
                          outline: 'none',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
            onClick={() => {
              const finalAnswers = inputValues.map(v => v.trim() === '' ? null : Number(v));
              finishPractice(finalAnswers);
            }}
          >
            解答を終了する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ marginBottom: '2rem', fontSize: '1.25rem', color: '#64748b', fontWeight: 'bold' }}>
        <span style={{ color: 'var(--primary-color)' }}>第 {currentIndex + 1} 問</span> / 全 {questions.length} 問
      </div>
      
      <div className="card" style={{ 
        display: 'inline-block', 
        padding: isAddition ? '2rem 4rem' : '4rem 6rem', 
        minWidth: '320px', 
        fontSize: '3rem', 
        fontWeight: 'bold', 
        letterSpacing: '2px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }}>
        {isAddition ? (
          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
            {currentQ.expression.map((num, i) => (
              <div key={i}>{num}</div>
            ))}
          </div>
        ) : (
          <div>{currentQ.expression.join(' ')}</div>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="答え"
          style={{
            fontSize: '2.5rem',
            padding: '1rem',
            textAlign: 'center',
            width: '320px',
            borderRadius: '12px',
            border: '3px solid var(--primary-color)',
            outline: 'none',
            boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.2)'
          }}
        />
      </div>
      
      <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '1rem' }}>Enterキーで次の問題へ</p>
    </div>
  );
}
