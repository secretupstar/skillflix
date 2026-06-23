import { useApp } from '../context/AppContext';
import { getAllSkills, getSkillById, SKILL_CATEGORIES } from '../data/skills';
import { useAI } from '../hooks/useAI';

export default function Dashboard({ onNavigate }) {
  const { state } = useApp();
  const { getAIInsight } = useAI();

  const reviewedSkillIds = Object.keys(state.reviews).filter(id => state.reviews[id].length > 0);
  const totalReviews = Object.values(state.reviews).reduce((sum, arr) => sum + arr.length, 0);
  const totalNotes = Object.values(state.notes).reduce((sum, arr) => sum + arr.length, 0);
  const trapCompleted = Object.values(state.trapProgress).reduce((sum, stages) => sum + Object.keys(stages).length, 0);

  const recentActivity = [];
  Object.entries(state.reviews).forEach(([skillId, reviews]) => {
    reviews.forEach(r => {
      const skill = getSkillById(skillId);
      if (skill) {
        recentActivity.push({
          type: 'review',
          icon: '📝',
          title: `Reviewed "${skill.name}"`,
          subtitle: r.title,
          time: r.createdAt,
          skillId,
        });
      }
    });
  });
  Object.entries(state.notes).forEach(([skillId, notes]) => {
    notes.forEach(n => {
      const skill = getSkillById(skillId);
      if (skill) {
        recentActivity.push({
          type: 'note',
          icon: n.type === 'fact' ? '💡' : n.type === 'technique' ? '🔧' : '🔗',
          title: `Added ${n.type} for "${skill.name}"`,
          subtitle: n.content.slice(0, 60) + '...',
          time: n.createdAt,
          skillId,
        });
      }
    });
  });
  Object.entries(state.trapProgress).forEach(([skillId, stages]) => {
    Object.entries(stages).forEach(([stage, data]) => {
      const skill = getSkillById(skillId);
      if (skill) {
        recentActivity.push({
          type: 'trap',
          icon: stage === 'TEST' ? '📝' : stage === 'RETAIN' ? '🧠' : stage === 'ASSOCIATE' ? '🔗' : '🎯',
          title: `Completed ${stage} for "${skill.name}"`,
          subtitle: `Score: ${data.score}%`,
          time: data.completedAt,
          skillId,
        });
      }
    });
  });

  recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Your Skill Theater</h2>
        <p>Track, review, and master every skill you learn</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-icon">🎬</div>
          <div className="stat-value">{reviewedSkillIds.length}</div>
          <div className="stat-label">Skills Reviewed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon">🧠</div>
          <div className="stat-value">{trapCompleted}</div>
          <div className="stat-label">T.R.A.P. Stages Done</div>
        </div>
        <div className="stat-card pink">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{state.streakDays}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {reviewedSkillIds.length > 0 && (
        <div className="ai-panel">
          <div className="ai-header">🤖 AI Insight</div>
          <div className="ai-message">
            You've reviewed {reviewedSkillIds.length} skill{reviewedSkillIds.length > 1 ? 's' : ''} with {totalReviews} review{totalReviews > 1 ? 's' : ''} and {totalNotes} note{totalNotes !== 1 ? 's' : ''}.
            {reviewedSkillIds.length < 3
              ? ' Keep building your collection! The more skills you review, the stronger your knowledge network becomes.'
              : ` Great momentum! Focus on completing T.R.A.P. stages for your reviewed skills to lock them into long-term memory.`
            }
          </div>
        </div>
      )}

      {reviewedSkillIds.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🎬 Your Reviewed Skills</h3>
          <div className="skills-grid">
            {reviewedSkillIds.map(skillId => {
              const skill = getSkillById(skillId);
              if (!skill) return null;
              const reviews = state.reviews[skillId] || [];
              const avgRating = reviews.length > 0
                ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
                : 0;
              const gradientMap = {
                creative: 'gradient-purple',
                writing: 'gradient-amber',
                tech: 'gradient-cyan',
                business: 'gradient-emerald',
                personal: 'gradient-violet',
                trade: 'gradient-red',
              };
              return (
                <div key={skillId} className="skill-poster" onClick={() => onNavigate('skill', skillId)}>
                  <div className={`poster-visual ${gradientMap[skill.category] || 'gradient-purple'}`}>
                    <span>{skill.poster}</span>
                  </div>
                  <div className="poster-info">
                    <div className="poster-title">{skill.name}</div>
                    <div className="poster-tagline">{skill.tagline}</div>
                    <div className="poster-meta">
                      <span className={`difficulty-badge ${skill.difficulty.toLowerCase()}`}>{skill.difficulty}</span>
                      <div className="star-rating">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`star ${s <= avgRating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>📋 Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍿</div>
            <div className="empty-title">No activity yet</div>
            <div className="empty-desc">Start reviewing skills to see your activity here</div>
            <button className="btn btn-gold" onClick={() => onNavigate('library')}>Browse Skills Library</button>
          </div>
        ) : (
          recentActivity.slice(0, 10).map((item, i) => (
            <div key={i} className="activity-item" onClick={() => onNavigate('skill', item.skillId)} style={{ cursor: 'pointer' }}>
              <div className="activity-icon">{item.icon}</div>
              <div className="activity-info">
                <div className="activity-title">{item.title}</div>
                <div className="activity-time">{formatTime(item.time)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {reviewedSkillIds.length === 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🌟 Featured Skills to Start</h3>
          <div className="skills-grid">
            {['video-editing', 'copywriting', 'javascript', 'marketing', 'memory-techniques', 'cooking'].map(id => {
              const skill = getSkillById(id);
              if (!skill) return null;
              const gradientMap = {
                creative: 'gradient-purple',
                writing: 'gradient-amber',
                tech: 'gradient-cyan',
                business: 'gradient-emerald',
                personal: 'gradient-violet',
                trade: 'gradient-red',
              };
              return (
                <div key={id} className="skill-poster" onClick={() => onNavigate('skill', id)}>
                  <div className={`poster-visual ${gradientMap[skill.category] || 'gradient-purple'}`}>
                    <span>{skill.poster}</span>
                  </div>
                  <div className="poster-info">
                    <div className="poster-title">{skill.name}</div>
                    <div className="poster-tagline">{skill.tagline}</div>
                    <div className="poster-meta">
                      <span className={`difficulty-badge ${skill.difficulty.toLowerCase()}`}>{skill.difficulty}</span>
                      <div className="star-rating">
                        {[1,2,3,4,5].map(s => <span key={s} className="star">★</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
