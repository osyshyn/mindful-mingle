/*
  # Add Sample Daily Tips

  1. Changes
    - Insert sample tips into the daily_tips table
    - Tips cover various EQ categories with meaningful content
*/

-- Insert sample daily tips
INSERT INTO daily_tips (title, content, category, created_at)
VALUES
  (
    'Active Listening: The Key to Better Relationships',
    'Practice active listening by maintaining eye contact, nodding to show understanding, and asking clarifying questions. This demonstrates respect and helps build stronger connections with others.',
    'Communication',
    NOW() - INTERVAL '2 days'
  ),
  (
    'Managing Stress Through Emotional Awareness',
    'When feeling stressed, take a moment to identify and label your emotions. This simple act of emotional recognition can help reduce stress and lead to better decision-making.',
    'Self-Management',
    NOW() - INTERVAL '1 day'
  ),
  (
    'Building Empathy in Daily Interactions',
    'Before responding in challenging situations, take a moment to consider the other person''s perspective. What might they be feeling? What circumstances might be influencing their behavior?',
    'Empathy',
    NOW()
  ),
  (
    'The Power of Positive Self-Talk',
    'Replace negative self-talk with positive, realistic affirmations. Instead of "I can''t handle this," try "I can learn from this challenge and grow stronger."',
    'Self-Awareness',
    NOW() - INTERVAL '3 days'
  ),
  (
    'Navigating Difficult Conversations',
    'When addressing conflicts, use "I" statements to express your feelings without blame. For example, "I feel frustrated when..." instead of "You always..."',
    'Conflict Resolution',
    NOW() - INTERVAL '4 days'
  ),
  (
    'Emotional Intelligence in Leadership',
    'Great leaders recognize and validate their team members'' emotions. Take time to acknowledge others'' feelings and concerns, even when you can''t solve every problem.',
    'Leadership',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Building Resilience Through Self-Compassion',
    'Treat yourself with the same kindness you''d offer a good friend. Acknowledge that making mistakes is part of being human and an opportunity for growth.',
    'Self-Management',
    NOW() - INTERVAL '6 days'
  ),
  (
    'Reading Emotional Cues in Others',
    'Pay attention to non-verbal signals like facial expressions, tone of voice, and body language. These often communicate more than words alone.',
    'Social Awareness',
    NOW() - INTERVAL '7 days'
  ),
  (
    'Maintaining Boundaries for Emotional Health',
    'Setting healthy boundaries is crucial for emotional well-being. Learn to say "no" when necessary and communicate your limits clearly and respectfully.',
    'Self-Care',
    NOW() - INTERVAL '8 days'
  ),
  (
    'Cultivating Gratitude Daily',
    'Take time each day to acknowledge three things you''re grateful for. This practice can shift your focus from negative to positive emotions and improve overall well-being.',
    'Positive Psychology',
    NOW() - INTERVAL '9 days'
  );