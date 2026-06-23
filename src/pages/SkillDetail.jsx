import { useState } from 'react';
import { getSkillById, TRAP_STAGES } from '../data/skills';
import { useApp } from '../context/AppContext';
import { useAI } from '../hooks/useAI';
import ReviewForm from '../components/ReviewForm';
import NoteForm from '../components/NoteForm';
import QuizPanel from '../components/QuizPanel';

const GRADIENT_MAP = {
  creative: 'gradient-purple',
  writing: 'gradient-amber',
  tech: 'gradient-cyan',
  business: 'gradient-emerald',
  personal: 'gradient-violet',
  trade: 'gradient-red',
};

export default function SkillDetail({ skillId, onNavigate }) {
  const skill = getSkillById(skillId);
  const { state, dispatch } = useApp();
  const ai = useAI();
  const [activeTab, setActiveTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [activeTrap, setActiveTrap] = useState(null);

  if (!skill) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❓</div>
        <div className="empty-title">Skill not found</div>
        <button className="btn btn-ghost" onClick={() => onNavigate('library')}>← Back to Library</button>
      </div>
    );
  }

  const reviews = state.reviews[skillId] || [];
  const notes = state.notes[skillId] || [];
  const trapProgress = state.trapProgress[skillId] || {};
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const aiInsight = ai.getAIInsight(skill.name, reviews.length, trapProgress);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDeleteReview = (reviewId) => {
    dispatch({ type: 'DELETE_REVIEW', payload: { skillId, reviewId } });
  };

  const handleDeleteNote = (noteId) => {
    dispatch({ type: 'DELETE_NOTE', payload: { skillId, noteId } });
  };

  const handleTrapComplete = (stage, score) => {
    dispatch({ type: 'UPDATE_TRAP', payload: { skillId, stage, score } });
    setActiveTrap(null);
  };

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => onNavigate('library')}>← Back to Library</button>

      <div className="skill-hero">
        <div className="hero-content">
          <div className="hero-emoji">{skill.poster}</div>
          <div className="hero-info">
            <h2>{skill.name}</h2>
            <div className="hero-tagline">"{skill.tagline}"</div>
            <div className="hero-meta">
              <span className={`difficulty-badge ${skill.difficulty.toLowerCase()}`}>{skill.difficulty}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{skill.categoryName}</span>
              <span style={{ color: 'var(--accent-gold)', fontSize: 14, fontWeight: 700 }}>
                ★ {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ai-panel">
        <div className="ai-header">🤖 AI Coach</div>
        <div className="ai-message">{aiInsight}</div>
      </div>

      {/* T.R.A.P. System */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          🎯 T.R.A.P. Mastery System
        </h3>
        <div className="trap-container">
          {Object.entries(TRAP_STAGES).map(([key, stage]) => (
            <div
              key={key}
              className={`trap-stage ${trapProgress[key] ? 'completed' : ''}`}
              onClick={() => setActiveTrap(key)}
            >
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-name">{stage.name}</div>
              <div className="stage-desc">{stage.description}</div>
              {trapProgress[key] && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  Score: {trapProgress[key].score}%
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="progress-bar" style={{ marginBottom: 8 }}>
          <div
            className="progress-fill purple"
            style={{ width: `${(Object.keys(trapProgress).length / 4) * 100}%` }}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {Object.keys(trapProgress).length}/4 stages completed
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          Reviews ({reviews.length})
        </button>
        <button className={`tab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          Notes ({notes.length})
        </button>
        <button className={`tab ${activeTab === 'associations' ? 'active' : ''}`} onClick={() => setActiveTab('associations')}>
          Associations
        </button>
        <button className={`tab ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
          Challenges
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reviews' && (
        <div className="slide-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Reviews</h3>
            <button className="btn btn-gold" onClick={() => setShowReviewForm(true)}>
              ✍️ Write Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <div className="empty-title">No reviews yet</div>
              <div className="empty-desc">Write your first review of {skill.name} — just like a movie critic reviews a film!</div>
              <button className="btn btn-gold" onClick={() => setShowReviewForm(true)}>Write Your First Review</button>
            </div>
          ) : (
            reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <div className="review-title">{review.title}</div>
                    <div className="star-rating" style={{ marginTop: 4 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`star ${s <= review.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(review.id)}>×</button>
                  </div>
                </div>
                <div className="review-body">{review.body}</div>
                {review.keyTakeaway && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(245,197,24,0.08)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-gold)',
                    fontSize: 13,
                    color: 'var(--accent-gold)',
                    marginBottom: 12,
                  }}>
                    💡 Key Takeaway: {review.keyTakeaway}
                  </div>
                )}
                <div className="review-tags">
                  {review.tags?.map((tag, i) => (
                    <span key={i} className={`tag ${tag.type || ''}`}>{tag.label}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="slide-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Knowledge Notes</h3>
            <button className="btn btn-primary" onClick={() => setShowNoteForm(true)}>
              + Add Note
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📒</div>
              <div className="empty-title">No notes yet</div>
              <div className="empty-desc">Capture facts, techniques, insights, and associations about {skill.name}</div>
              <button className="btn btn-primary" onClick={() => setShowNoteForm(true)}>Add Your First Note</button>
            </div>
          ) : (
            notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(note => (
              <div key={note.id} className="note-card">
                <div className={`note-type ${note.type}`}>{note.type}</div>
                <div className="note-content">{note.content}</div>
                <div className="note-footer">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(note.createdAt)}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'associations' && (
        <div className="slide-up">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🔗 Memory Associations</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            AI-generated memory techniques to help you remember {skill.name} better
          </p>
          {ai.generateAssociationsForSkill(skill.name, notes).map((assoc, i) => (
            <div key={i} className="association-card">
              <div className="assoc-type">{assoc.type.replace('-', ' ')}</div>
              <div className="assoc-content">{assoc.content}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="slide-up">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🏆 Performance Challenges</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Apply your {skill.name} knowledge in real scenarios
          </p>
          {ai.generateChallengesForSkill(skill.name).map((challenge, i) => (
            <div key={i} className="challenge-card">
              <div className={`challenge-level ${challenge.level.toLowerCase()}`}>{challenge.level}</div>
              <div className="challenge-task">{challenge.task}</div>
              <div className="challenge-points">+{challenge.points} pts</div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showReviewForm && (
        <ReviewForm
          skillName={skill.name}
          skillId={skillId}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {showNoteForm && (
        <NoteForm
          skillName={skill.name}
          skillId={skillId}
          onClose={() => setShowNoteForm(false)}
        />
      )}

      {activeTrap && (
        <div className="modal-overlay" onClick={() => setActiveTrap(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{TRAP_STAGES[activeTrap].icon} {TRAP_STAGES[activeTrap].name}</h3>
              <button className="modal-close" onClick={() => setActiveTrap(null)}>×</button>
            </div>

            {activeTrap === 'TEST' && (
              <QuizPanel
                skillName={skill.name}
                notes={notes}
                onComplete={(score) => handleTrapComplete('TEST', score)}
              />
            )}

            {activeTrap === 'RETAIN' && (
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Use these scientifically-proven techniques to retain your {skill.name} knowledge:
                </p>
                {Object.entries(ai.generateRetentionForSkill(skill.name, notes)).map(([key, tip]) => (
                  <div key={key} className="retention-card">
                    <div className="retention-title">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="retention-tip">{tip}</div>
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                  onClick={() => handleTrapComplete('RETAIN', 100)}
                >
                  ✓ I've practiced retention techniques
                </button>
              </div>
            )}

            {activeTrap === 'ASSOCIATE' && (
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Build mental connections to strengthen your {skill.name} memory:
                </p>
                {ai.generateAssociationsForSkill(skill.name, notes).map((assoc, i) => (
                  <div key={i} className="association-card">
                    <div className="assoc-type">{assoc.type.replace('-', ' ')}</div>
                    <div className="assoc-content">{assoc.content}</div>
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                  onClick={() => handleTrapComplete('ASSOCIATE', 100)}
                >
                  ✓ I've built my associations
                </button>
              </div>
            )}

            {activeTrap === 'PERFORM' && (
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Complete these challenges to prove your {skill.name} mastery:
                </p>
                {ai.generateChallengesForSkill(skill.name).map((challenge, i) => (
                  <div key={i} className="challenge-card">
                    <div className={`challenge-level ${challenge.level.toLowerCase()}`}>{challenge.level}</div>
                    <div className="challenge-task">{challenge.task}</div>
                    <div className="challenge-points">+{challenge.points} pts</div>
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                  onClick={() => handleTrapComplete('PERFORM', 100)}
                >
                  ✓ I've completed a challenge
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
