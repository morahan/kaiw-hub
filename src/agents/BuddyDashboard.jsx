import { useState } from 'react';
import { motion } from 'framer-motion';
import './css/buddyDashboard.css';

const agent = { name: 'Buddy', emoji: '💪', role: 'Workout Buddy Agent', color: '#f97316' };

const mockActivities = [
  { id: 1, text: 'Push day completed — chest, shoulders, triceps', user: 'Alex M.', time: '12 min ago', status: 'done' },
  { id: 2, text: 'New PR set: Bench Press 225 lbs', user: 'Jordan K.', time: '28 min ago', status: 'done' },
  { id: 3, text: 'Rest day reminder sent', user: 'Sam R.', time: '45 min ago', status: 'pending' },
  { id: 4, text: 'Weekly plan generated — hypertrophy block week 3', user: 'Taylor W.', time: '1 hr ago', status: 'done' },
  { id: 5, text: 'Form check requested: deadlift video review', user: 'Casey L.', time: '1.5 hr ago', status: 'pending' },
  { id: 6, text: 'Nutrition log reviewed — protein target hit', user: 'Morgan P.', time: '2 hr ago', status: 'done' },
];

const mockStats = [
  { label: 'Active Users', value: '847', sub: '+12% this week', icon: '👥' },
  { label: 'Workouts Today', value: '234', sub: '28% completion rate', icon: '🏋️' },
  { label: 'Avg Session', value: '42 min', sub: 'up from 38 min', icon: '⏱️' },
  { label: 'PRs This Week', value: '89', sub: '+23 from last week', icon: '🏆' },
];

const mockConversations = [
  { user: 'Alex M.', message: "Can we swap Thursday's leg day to Friday?", time: '5 min ago' },
  { user: 'Jordan K.', message: 'What should I eat post-workout?', time: '18 min ago' },
  { user: 'Sam R.', message: 'My shoulder feels tight after OHP', time: '32 min ago' },
  { user: 'Casey L.', message: 'Ready to start a cut — help me plan?', time: '1 hr ago' },
];

const mockTopExercises = [
  { name: 'Bench Press', count: 142, pct: 92 },
  { name: 'Squat', count: 128, pct: 83 },
  { name: 'Deadlift', count: 115, pct: 75 },
  { name: 'Pull-ups', count: 98, pct: 64 },
  { name: 'Overhead Press', count: 87, pct: 57 },
];

const mockTopUsers = [
  { name: 'Alex M.', workouts: 6, streak: 14, avatar: '🔥' },
  { name: 'Jordan K.', workouts: 5, streak: 21, avatar: '💪' },
  { name: 'Taylor W.', workouts: 5, streak: 9, avatar: '⚡' },
  { name: 'Morgan P.', workouts: 4, streak: 12, avatar: '🏆' },
  { name: 'Casey L.', workouts: 4, streak: 7, avatar: '🎯' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

function App() {
  const [activities, setActivities] = useState(mockActivities);

  const markDone = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'done' } : a));
  };

  return (
    <div className="buddy-dash">
      {/* Header */}
      <header className="buddy-header">
        <div className="buddy-avatar">{agent.emoji}</div>
        <div className="buddy-header-text">
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
        <div className="buddy-header-status">
          <span className="buddy-status-dot" />
          <span>Online — 847 users active</span>
        </div>
      </header>

      {/* KPI Stats Row */}
      <div className="buddy-stats-grid">
        {mockStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="buddy-stat-card"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="buddy-stat-icon">{stat.icon}</span>
            <div className="buddy-stat-value">{stat.value}</div>
            <div className="buddy-stat-label">{stat.label}</div>
            <div className="buddy-stat-sub">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="buddy-content-grid">
        {/* Activity Feed */}
        <div className="buddy-card buddy-activity-card">
          <h2>Recent Activity</h2>
          <div className="buddy-activity-list">
            {activities.map((item, i) => (
              <motion.div
                key={item.id}
                className={`buddy-activity-row ${item.status}`}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="buddy-activity-left">
                  <span className={`buddy-badge ${item.status}`}>
                    {item.status === 'done' ? 'Done' : 'Pending'}
                  </span>
                  <div className="buddy-activity-info">
                    <span className="buddy-activity-text">{item.text}</span>
                    <span className="buddy-activity-meta">{item.user} &middot; {item.time}</span>
                  </div>
                </div>
                <div className="buddy-activity-actions">
                  <button className="buddy-btn buddy-btn-view">View</button>
                  {item.status === 'pending' && (
                    <button className="buddy-btn buddy-btn-done" onClick={() => markDone(item.id)}>
                      Mark Done
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="buddy-sidebar">
          {/* Recent Conversations */}
          <div className="buddy-card">
            <h2>Recent Conversations</h2>
            <div className="buddy-convo-list">
              {mockConversations.map((c, i) => (
                <motion.div
                  key={i}
                  className="buddy-convo-row"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="buddy-convo-user">{c.user}</div>
                  <div className="buddy-convo-msg">{c.message}</div>
                  <div className="buddy-convo-time">{c.time}</div>
                </motion.div>
              ))}
            </div>
            <button className="buddy-btn buddy-btn-cta">Message User</button>
          </div>

          {/* Top Users This Week */}
          <div className="buddy-card buddy-leaderboard-card">
            <h2>Top Users This Week</h2>
            <div className="buddy-leaderboard-list">
              {mockTopUsers.map((u, i) => (
                <motion.div
                  key={u.name}
                  className="buddy-leaderboard-row"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <span className="buddy-leaderboard-rank">#{i + 1}</span>
                  <span className="buddy-leaderboard-avatar">{u.avatar}</span>
                  <div className="buddy-leaderboard-info">
                    <span className="buddy-leaderboard-name">{u.name}</span>
                    <span className="buddy-leaderboard-meta">{u.workouts} workouts &middot; {u.streak}-day streak</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Exercises */}
          <div className="buddy-card">
            <h2>Top Exercises This Week</h2>
            <div className="buddy-exercise-list">
              {mockTopExercises.map((ex, i) => (
                <motion.div
                  key={ex.name}
                  className="buddy-exercise-row"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="buddy-exercise-name">
                    <span>{ex.name}</span>
                    <span className="buddy-exercise-count">{ex.count} sets</span>
                  </div>
                  <div className="buddy-exercise-bar-bg">
                    <motion.div
                      className="buddy-exercise-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${ex.pct}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="buddy-footer">
        Buddy Dashboard &middot; Powered by Claude Opus 4.6 &middot; kaiw.io
      </footer>
    </div>
  );
}
export default App;
