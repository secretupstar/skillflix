import { useState } from 'react';
import { useAI } from '../hooks/useAI';

export default function QuizPanel({ skillName, notes, onComplete }) {
  const ai = useAI();
  const [questions] = useState(() => ai.generateQuizForSkill(skillName, notes));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="score-display">
        <div
          className="score-circle"
          style={{
            background: pct >= 80
              ? 'linear-gradient(135deg, rgba(6,214,160,0.2), rgba(52,211,153,0.2))'
              : pct >= 50
              ? 'linear-gradient(135deg, rgba(245,197,24,0.2), rgba(251,133,0,0.2))'
              : 'linear-gradient(135deg, rgba(255,0,110,0.2), rgba(244,114,182,0.2))',
            color: pct >= 80 ? 'var(--accent-cyan)' : pct >= 50 ? 'var(--accent-gold)' : 'var(--accent-pink)',
          }}
        >
          {pct}%
        </div>
        <div className="score-label">
          {pct >= 80 ? 'Excellent recall!' : pct >= 50 ? 'Good progress — keep reviewing!' : 'Time to review your notes!'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
          {score}/{questions.length} correct
        </div>
        <button
          className="btn btn-gold"
          style={{ marginTop: 20 }}
          onClick={() => onComplete(pct)}
        >
          Complete Test Stage
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQ + 1} of {questions.length}
      </div>
      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <div className="progress-fill gold" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="quiz-question">{q.question}</div>
      <div>
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option ${
              answered
                ? i === q.correct
                  ? 'correct'
                  : i === selected
                  ? 'wrong'
                  : ''
                : i === selected
                ? 'selected'
                : ''
            }`}
            onClick={() => handleAnswer(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      {answered && (
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
