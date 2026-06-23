export const SKILL_CATEGORIES = [
  {
    id: 'creative',
    name: 'Creative Arts',
    icon: '🎨',
    gradient: 'from-purple-600 to-pink-500',
    skills: [
      { id: 'video-editing', name: 'Video Editing', poster: '🎬', tagline: 'Cut. Trim. Transform.', difficulty: 'Intermediate' },
      { id: 'photography', name: 'Photography', poster: '📸', tagline: 'Capture the unseen.', difficulty: 'Beginner' },
      { id: 'graphic-design', name: 'Graphic Design', poster: '🖼️', tagline: 'Pixels with purpose.', difficulty: 'Intermediate' },
      { id: 'ui-ux-design', name: 'UI/UX Design', poster: '🎯', tagline: 'Design that feels right.', difficulty: 'Advanced' },
      { id: 'animation', name: 'Animation', poster: '🎭', tagline: 'Bring stillness to life.', difficulty: 'Advanced' },
      { id: 'music-production', name: 'Music Production', poster: '🎵', tagline: 'Compose your world.', difficulty: 'Intermediate' },
      { id: 'illustration', name: 'Illustration', poster: '✏️', tagline: 'Draw what words can\'t say.', difficulty: 'Intermediate' },
      { id: '3d-modeling', name: '3D Modeling', poster: '🧊', tagline: 'Shape the third dimension.', difficulty: 'Advanced' },
      { id: 'motion-graphics', name: 'Motion Graphics', poster: '✨', tagline: 'Movement meets meaning.', difficulty: 'Advanced' },
      { id: 'color-grading', name: 'Color Grading', poster: '🌈', tagline: 'Paint with light.', difficulty: 'Intermediate' },
    ]
  },
  {
    id: 'writing',
    name: 'Writing & Communication',
    icon: '✍️',
    gradient: 'from-amber-500 to-orange-600',
    skills: [
      { id: 'copywriting', name: 'Copywriting', poster: '📝', tagline: 'Words that sell.', difficulty: 'Intermediate' },
      { id: 'content-writing', name: 'Content Writing', poster: '📰', tagline: 'Inform. Engage. Convert.', difficulty: 'Beginner' },
      { id: 'storytelling', name: 'Storytelling', poster: '📖', tagline: 'Every word matters.', difficulty: 'Intermediate' },
      { id: 'public-speaking', name: 'Public Speaking', poster: '🎤', tagline: 'Own the room.', difficulty: 'Advanced' },
      { id: 'screenwriting', name: 'Screenwriting', poster: '🎬', tagline: 'Write the scene.', difficulty: 'Advanced' },
      { id: 'technical-writing', name: 'Technical Writing', poster: '📋', tagline: 'Clarity is king.', difficulty: 'Intermediate' },
      { id: 'email-marketing', name: 'Email Marketing', poster: '📧', tagline: 'Inbox domination.', difficulty: 'Beginner' },
      { id: 'blogging', name: 'Blogging', poster: '💻', tagline: 'Your voice, amplified.', difficulty: 'Beginner' },
      { id: 'seo-writing', name: 'SEO Writing', poster: '🔍', tagline: 'Rank and captivate.', difficulty: 'Intermediate' },
      { id: 'persuasion', name: 'Persuasion', poster: '🧠', tagline: 'Influence with integrity.', difficulty: 'Advanced' },
    ]
  },
  {
    id: 'tech',
    name: 'Technology & Code',
    icon: '💻',
    gradient: 'from-cyan-500 to-blue-600',
    skills: [
      { id: 'javascript', name: 'JavaScript', poster: '⚡', tagline: 'The language of the web.', difficulty: 'Intermediate' },
      { id: 'python', name: 'Python', poster: '🐍', tagline: 'Elegant. Powerful. Pythonic.', difficulty: 'Beginner' },
      { id: 'react', name: 'React', poster: '⚛️', tagline: 'Build UIs that react.', difficulty: 'Intermediate' },
      { id: 'machine-learning', name: 'Machine Learning', poster: '🤖', tagline: 'Teach machines to think.', difficulty: 'Advanced' },
      { id: 'data-science', name: 'Data Science', poster: '📊', tagline: 'Stories in the numbers.', difficulty: 'Advanced' },
      { id: 'cloud-computing', name: 'Cloud Computing', poster: '☁️', tagline: 'Scale without limits.', difficulty: 'Advanced' },
      { id: 'cybersecurity', name: 'Cybersecurity', poster: '🔒', tagline: 'Defend the digital.', difficulty: 'Advanced' },
      { id: 'devops', name: 'DevOps', poster: '🔄', tagline: 'Ship faster. Break less.', difficulty: 'Advanced' },
      { id: 'mobile-dev', name: 'Mobile Development', poster: '📱', tagline: 'Apps for every pocket.', difficulty: 'Intermediate' },
      { id: 'databases', name: 'Database Design', poster: '🗄️', tagline: 'Structure the chaos.', difficulty: 'Intermediate' },
    ]
  },
  {
    id: 'business',
    name: 'Business & Strategy',
    icon: '💼',
    gradient: 'from-emerald-500 to-teal-600',
    skills: [
      { id: 'marketing', name: 'Digital Marketing', poster: '📢', tagline: 'Reach the right people.', difficulty: 'Intermediate' },
      { id: 'sales', name: 'Sales Mastery', poster: '🤝', tagline: 'Close with confidence.', difficulty: 'Intermediate' },
      { id: 'negotiation', name: 'Negotiation', poster: '⚖️', tagline: 'Win-win or walk away.', difficulty: 'Advanced' },
      { id: 'leadership', name: 'Leadership', poster: '👑', tagline: 'Lead by example.', difficulty: 'Advanced' },
      { id: 'project-management', name: 'Project Management', poster: '📋', tagline: 'Plan. Execute. Deliver.', difficulty: 'Intermediate' },
      { id: 'product-management', name: 'Product Management', poster: '🚀', tagline: 'Build what matters.', difficulty: 'Advanced' },
      { id: 'financial-literacy', name: 'Financial Literacy', poster: '💰', tagline: 'Money speaks volumes.', difficulty: 'Beginner' },
      { id: 'entrepreneurship', name: 'Entrepreneurship', poster: '🔥', tagline: 'Create your own path.', difficulty: 'Advanced' },
      { id: 'branding', name: 'Personal Branding', poster: '🏷️', tagline: 'Be unforgettable.', difficulty: 'Intermediate' },
      { id: 'analytics', name: 'Business Analytics', poster: '📈', tagline: 'Data-driven decisions.', difficulty: 'Intermediate' },
    ]
  },
  {
    id: 'personal',
    name: 'Personal Development',
    icon: '🧠',
    gradient: 'from-violet-500 to-purple-600',
    skills: [
      { id: 'speed-reading', name: 'Speed Reading', poster: '📚', tagline: 'Read faster. Learn more.', difficulty: 'Beginner' },
      { id: 'memory-techniques', name: 'Memory Techniques', poster: '🧩', tagline: 'Never forget again.', difficulty: 'Intermediate' },
      { id: 'critical-thinking', name: 'Critical Thinking', poster: '💭', tagline: 'Question everything.', difficulty: 'Intermediate' },
      { id: 'time-management', name: 'Time Management', poster: '⏰', tagline: 'Master your minutes.', difficulty: 'Beginner' },
      { id: 'mindfulness', name: 'Mindfulness', poster: '🧘', tagline: 'Be here now.', difficulty: 'Beginner' },
      { id: 'emotional-intelligence', name: 'Emotional Intelligence', poster: '❤️', tagline: 'Feel to understand.', difficulty: 'Intermediate' },
      { id: 'habit-building', name: 'Habit Building', poster: '🔁', tagline: 'Small steps. Big change.', difficulty: 'Beginner' },
      { id: 'problem-solving', name: 'Problem Solving', poster: '🔧', tagline: 'Every problem has a key.', difficulty: 'Intermediate' },
      { id: 'decision-making', name: 'Decision Making', poster: '🎯', tagline: 'Choose wisely. Act boldly.', difficulty: 'Advanced' },
      { id: 'learning-to-learn', name: 'Learning to Learn', poster: '🎓', tagline: 'The ultimate meta-skill.', difficulty: 'Beginner' },
    ]
  },
  {
    id: 'trade',
    name: 'Trade & Craft Skills',
    icon: '🔨',
    gradient: 'from-red-500 to-rose-600',
    skills: [
      { id: 'cooking', name: 'Cooking', poster: '👨‍🍳', tagline: 'Flavors that tell stories.', difficulty: 'Beginner' },
      { id: 'woodworking', name: 'Woodworking', poster: '🪵', tagline: 'Craft from nature.', difficulty: 'Intermediate' },
      { id: 'gardening', name: 'Gardening', poster: '🌱', tagline: 'Grow something real.', difficulty: 'Beginner' },
      { id: 'fitness-training', name: 'Fitness Training', poster: '💪', tagline: 'Stronger every day.', difficulty: 'Beginner' },
      { id: 'first-aid', name: 'First Aid', poster: '🏥', tagline: 'Save lives. Stay calm.', difficulty: 'Beginner' },
      { id: 'car-maintenance', name: 'Car Maintenance', poster: '🚗', tagline: 'Know your machine.', difficulty: 'Intermediate' },
      { id: 'home-repair', name: 'Home Repair', poster: '🏠', tagline: 'Fix it yourself.', difficulty: 'Intermediate' },
      { id: 'sewing', name: 'Sewing', poster: '🧵', tagline: 'Thread by thread.', difficulty: 'Beginner' },
      { id: 'electronics', name: 'Electronics', poster: '🔌', tagline: 'Circuit to solution.', difficulty: 'Advanced' },
      { id: 'bartending', name: 'Bartending', poster: '🍸', tagline: 'Mix. Shake. Impress.', difficulty: 'Beginner' },
    ]
  },
];

export const TRAP_STAGES = {
  TEST: { name: 'Test', icon: '📝', color: '#f59e0b', description: 'Quiz yourself on what you learned' },
  RETAIN: { name: 'Retain', icon: '🧠', color: '#8b5cf6', description: 'Lock it into long-term memory' },
  ASSOCIATE: { name: 'Associate', icon: '🔗', color: '#06b6d4', description: 'Connect it to what you already know' },
  PERFORM: { name: 'Perform', icon: '🎯', color: '#10b981', description: 'Apply it in real scenarios' },
};

export const REVIEW_RATINGS = [
  { stars: 1, label: 'Just Started', emoji: '🌱' },
  { stars: 2, label: 'Getting There', emoji: '📚' },
  { stars: 3, label: 'Solid Grasp', emoji: '💪' },
  { stars: 4, label: 'Expert Level', emoji: '🔥' },
  { stars: 5, label: 'Mastered', emoji: '👑' },
];

export function getAllSkills() {
  return SKILL_CATEGORIES.flatMap(cat =>
    cat.skills.map(s => ({ ...s, category: cat.id, categoryName: cat.name, gradient: cat.gradient }))
  );
}

export function getSkillById(id) {
  for (const cat of SKILL_CATEGORIES) {
    const skill = cat.skills.find(s => s.id === id);
    if (skill) return { ...skill, category: cat.id, categoryName: cat.name, gradient: cat.gradient };
  }
  return null;
}
