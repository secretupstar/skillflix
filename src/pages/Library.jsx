import { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/skills';
import { useApp } from '../context/AppContext';

const GRADIENT_MAP = {
  creative: 'gradient-purple',
  writing: 'gradient-amber',
  tech: 'gradient-cyan',
  business: 'gradient-emerald',
  personal: 'gradient-violet',
  trade: 'gradient-red',
};

export default function Library({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { state } = useApp();

  const filteredCategories = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: cat.skills.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat =>
    cat.skills.length > 0 && (!selectedCategory || cat.id === selectedCategory)
  );

  const totalSkills = SKILL_CATEGORIES.reduce((sum, cat) => sum + cat.skills.length, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Skills Library</h2>
        <p>{totalSkills} skills across {SKILL_CATEGORIES.length} categories — your cinematic skill collection</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search skills... (e.g. video editing, python, cooking)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <button
          className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {SKILL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {filteredCategories.map(cat => (
        <div key={cat.id} className="category-section">
          <div className="category-header">
            <span className="cat-icon">{cat.icon}</span>
            <h3>{cat.name}</h3>
            <span className="cat-count">{cat.skills.length} skills</span>
          </div>
          <div className="skills-grid">
            {cat.skills.map(skill => {
              const reviews = state.reviews[skill.id] || [];
              const avgRating = reviews.length > 0
                ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
                : 0;
              const isReviewed = reviews.length > 0;

              return (
                <div
                  key={skill.id}
                  className="skill-poster"
                  onClick={() => onNavigate('skill', skill.id)}
                >
                  <div className={`poster-visual ${GRADIENT_MAP[cat.id] || 'gradient-purple'}`}>
                    <span>{skill.poster}</span>
                    {isReviewed && (
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(6,214,160,0.9)',
                        color: '#000',
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        REVIEWED
                      </div>
                    )}
                  </div>
                  <div className="poster-info">
                    <div className="poster-title">{skill.name}</div>
                    <div className="poster-tagline">{skill.tagline}</div>
                    <div className="poster-meta">
                      <span className={`difficulty-badge ${skill.difficulty.toLowerCase()}`}>
                        {skill.difficulty}
                      </span>
                      <div className="star-rating">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`star ${s <= avgRating ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {isReviewed && (
                      <div style={{ marginTop: 8 }}>
                        <div className="progress-bar">
                          <div
                            className="progress-fill gold"
                            style={{ width: `${Math.min(100, (Object.keys(state.trapProgress[skill.id] || {}).length / 4) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredCategories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No skills found</div>
          <div className="empty-desc">Try a different search term</div>
        </div>
      )}
    </div>
  );
}
