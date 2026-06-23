import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REVIEW_RATINGS } from '../data/skills';

export default function ReviewForm({ skillName, skillId, onClose }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [tagType, setTagType] = useState('');

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, { label: tagInput.trim(), type: tagType }]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !rating) return;
    dispatch({
      type: 'ADD_REVIEW',
      payload: {
        skillId,
        review: { title, body, rating, keyTakeaway, tags },
      },
    });
    onClose();
  };

  const currentLabel = REVIEW_RATINGS.find(r => r.stars === (hoverRating || rating));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✍️ Review: {skillName}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="form-group" style={{ textAlign: 'center' }}>
            <div className="form-label">Your Mastery Rating</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 36, marginBottom: 8 }}>
              {[1,2,3,4,5].map(s => (
                <span
                  key={s}
                  className={`star ${s <= (hoverRating || rating) ? 'filled' : ''}`}
                  style={{ fontSize: 36, cursor: 'pointer' }}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  ★
                </span>
              ))}
            </div>
            {currentLabel && (
              <div style={{ fontSize: 14, color: 'var(--accent-gold)' }}>
                {currentLabel.emoji} {currentLabel.label}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Review Headline</label>
            <input
              className="form-input"
              placeholder='e.g. "The fundamentals changed everything"'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Body */}
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              className="form-textarea"
              placeholder="What did you learn? What surprised you? What was the hardest part? Write it like a movie review — your honest take on this skill..."
              value={body}
              onChange={e => setBody(e.target.value)}
              required
            />
          </div>

          {/* Key Takeaway */}
          <div className="form-group">
            <label className="form-label">Key Takeaway (Optional)</label>
            <input
              className="form-input"
              placeholder="The one thing you want to remember most"
              value={keyTakeaway}
              onChange={e => setKeyTakeaway(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <select
                className="form-select"
                style={{ width: 120 }}
                value={tagType}
                onChange={e => setTagType(e.target.value)}
              >
                <option value="">General</option>
                <option value="layer">Layer</option>
                <option value="fact">Fact</option>
              </select>
              <input
                className="form-input"
                placeholder="Add a tag (e.g. fundamentals, shortcuts)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              />
              <button type="button" className="btn btn-ghost" onClick={addTag}>+</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tags.map((tag, i) => (
                <span key={i} className={`tag ${tag.type}`} style={{ cursor: 'pointer' }} onClick={() => removeTag(i)}>
                  {tag.label} ×
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn btn-gold"
              disabled={!title.trim() || !body.trim() || !rating}
            >
              🎬 Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
