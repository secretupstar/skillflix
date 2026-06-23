import { useState } from 'react';

const AI_PROMPTS = {
  quiz: (skill, notes) => {
    const context = notes.length > 0
      ? `Based on these notes about ${skill}: ${notes.map(n => n.content).join('. ')}`
      : `About the skill: ${skill}`;
    return generateQuiz(skill, context);
  },
  associate: (skill, notes) => {
    return generateAssociations(skill, notes);
  },
  perform: (skill) => {
    return generateChallenge(skill);
  },
  retain: (skill, notes) => {
    return generateRetentionTips(skill, notes);
  },
};

function generateQuiz(skill, context) {
  const quizzes = {
    default: [
      { question: `What is the core principle behind ${skill}?`, options: ['Foundation basics', 'Advanced technique', 'Creative application', 'Industry standard'], correct: 0 },
      { question: `Which technique is fundamental to ${skill}?`, options: ['Practice & repetition', 'Theory only', 'Watching tutorials', 'Random experimentation'], correct: 0 },
      { question: `What separates a beginner from an expert in ${skill}?`, options: ['Consistent deliberate practice', 'Natural talent only', 'Expensive tools', 'Years of passive exposure'], correct: 0 },
      { question: `How would you explain ${skill} to a 5 year old?`, options: ['Simple analogy', 'Technical terms', 'Skip explaining', 'Show don\'t tell'], correct: 0 },
      { question: `What\'s the biggest mistake beginners make in ${skill}?`, options: ['Skipping fundamentals', 'Practicing too much', 'Being too careful', 'Asking questions'], correct: 0 },
    ]
  };
  return quizzes.default;
}

function generateAssociations(skill, notes) {
  return [
    { type: 'analogy', content: `${skill} is like cooking — you need the right ingredients (fundamentals), proper technique (practice), and a dash of creativity.` },
    { type: 'memory-palace', content: `Imagine walking through your house. At the door, you see the BASICS of ${skill}. In the kitchen, the TOOLS. In the bedroom, your BEST WORK.` },
    { type: 'acronym', content: `Remember the key steps with L.E.A.R.N: Look, Explore, Apply, Review, Navigate next steps.` },
    { type: 'story', content: `Picture yourself 1 year from now, having mastered ${skill}. What project would you showcase? That vision IS your roadmap.` },
    { type: 'connection', content: `Think about skills you already have. How does ${skill} connect? Every new skill builds on old ones — find the bridge.` },
  ];
}

function generateChallenge(skill) {
  return [
    { level: 'Easy', task: `Explain ${skill} to someone who's never heard of it, in under 60 seconds.`, points: 10 },
    { level: 'Medium', task: `Create a mini-project using ${skill} in 30 minutes. Share it.`, points: 25 },
    { level: 'Hard', task: `Teach the fundamentals of ${skill} to a friend. Teaching is the ultimate test.`, points: 50 },
    { level: 'Expert', task: `Combine ${skill} with another skill to create something unique.`, points: 100 },
  ];
}

function generateRetentionTips(skill, notes) {
  const noteCount = notes.length;
  return {
    spaceRepetition: `Review your ${skill} notes again in ${noteCount < 3 ? '1 day' : '3 days'}. Spaced repetition locks knowledge in.`,
    activeRecall: `Close your eyes and list everything you know about ${skill}. Then check your notes. The gaps are where learning happens.`,
    feynmanTechnique: `Write a simple explanation of ${skill} as if teaching a beginner. Where you struggle to explain simply, you need to study more.`,
    interleaving: `Don't just practice ${skill} in isolation. Mix it with related skills to build stronger neural connections.`,
    elaboration: `For each note you've written about ${skill}, add a "WHY does this matter?" explanation.`,
  };
}

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generateQuizForSkill = (skillName, notes = []) => {
    setLoading(true);
    const quiz = AI_PROMPTS.quiz(skillName, notes);
    setLoading(false);
    return quiz;
  };

  const generateAssociationsForSkill = (skillName, notes = []) => {
    return AI_PROMPTS.associate(skillName, notes);
  };

  const generateChallengesForSkill = (skillName) => {
    return AI_PROMPTS.perform(skillName);
  };

  const generateRetentionForSkill = (skillName, notes = []) => {
    return AI_PROMPTS.retain(skillName, notes);
  };

  const getAIInsight = (skillName, reviewCount, trapStages) => {
    const completedStages = Object.keys(trapStages || {}).length;
    if (completedStages === 0) return `Start your ${skillName} journey! Add your first review to begin.`;
    if (completedStages < 2) return `Good start with ${skillName}! Complete more T.R.A.P. stages to strengthen retention.`;
    if (completedStages < 4) return `You're making solid progress with ${skillName}. The associations you're building will last.`;
    return `Outstanding mastery of ${skillName}! You've completed all T.R.A.P. stages. Keep reviewing to maintain peak recall.`;
  };

  return {
    loading,
    generateQuizForSkill,
    generateAssociationsForSkill,
    generateChallengesForSkill,
    generateRetentionForSkill,
    getAIInsight,
  };
}
