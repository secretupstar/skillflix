import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function NoteForm({ skillName, skillId, onClose }) {
  const { dispatch } = useApp();
  const [content, setContent] = useState('');
  const [type, setType] = useState('fact');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        skillId,
        note: { content, type },
      },
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📝 Add Note: {skillName}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Note Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'fact', label: '💡 Fact', desc: 'A key fact or piece of knowledge' },
                { value: 'technique', label: '🔧 Technique', desc: 'A method or approach' },
                { value: 'insight', label: '🧠 Insight', desc: 'A personal realization' },
                { value: 'association', label: '🔗 Association', desc: 'Connection to something else' },
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`btn btn-sm ${type === t.value ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setType(t.value)}
                  title={t.desc}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {type === 'fact' && 'What fact did you learn?'}
              {type === 'technique' && 'What technique or method?'}
              {type === 'insight' && 'What insight did you have?'}
              {type === 'association' && 'What connection did you make?'}
            </label>
            <textarea
              className="form-textarea"
              placeholder={
                type === 'fact' ? 'e.g. "The rule of thirds in photography places key elements along intersecting lines..."'
                : type === 'technique' ? 'e.g. "Use the Pomodoro technique: 25 min focus, 5 min break..."'
                : type === 'insight' ? 'e.g. "I realized that copywriting is really about understanding psychology..."'
                : 'e.g. "Video editing is like cooking — you prep ingredients (footage), then combine them (timeline)..."'
              }
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!content.trim()}>
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
