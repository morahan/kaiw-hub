import { useState } from 'react';
import { motion } from 'framer-motion';
import './css/buddyDashboard.css';

const agent = { name: 'Buddy', emoji: '💪', role: 'Workout Buddy Agent', color: '#f97316' };

const workspacePath = '~/.openclaw/workspace-buddy';

const realStats = [
  { label: 'Active Users', value: '—', sub: 'Workspace unavailable', icon: '👥' },
  { label: 'Workouts Today', value: '—', sub: `No data at ${workspacePath}`, icon: '🏋️' },
  { label: 'Avg Session', value: '—', sub: 'No session logs found', icon: '⏱️' },
  { label: 'PRs This Week', value: '—', sub: 'No workout records found', icon: '🏆' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

function EmptyState({ title }) {
  return (
    <motion.div
      className="buddy-activity-row pending"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="buddy-activity-left">
        <span className="buddy-badge pending">No Data</span>
        <div className="buddy-activity-info">
          <span className="buddy-activity-text">{title}</span>
          <span className="buddy-activity-meta">{workspacePath} not found</span>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const [activities] = useState([]);

  return (
    <div className="buddy-dash">
      <header className="buddy-header">
        <div className="buddy-avatar">{agent.emoji}</div>
        <div className="buddy-header-text">
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
        <div className="buddy-header-status">
          <span className="buddy-status-dot" />
          <span>Workspace unavailable at {workspacePath}</span>
        </div>
      </header>

      <div className="buddy-stats-grid">
        {realStats.map((stat, i) => (
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

      <div className="buddy-content-grid">
        <div className="buddy-card buddy-activity-card">
          <h2>Recent Activity</h2>
          <div className="buddy-activity-list">
            {activities.length === 0 ? <EmptyState title="No Buddy activity files are available in the configured workspace." /> : null}
          </div>
        </div>

        <div className="buddy-sidebar">
          <div className="buddy-card">
            <h2>Recent Conversations</h2>
            <div className="buddy-convo-list">
              <EmptyState title="Conversation history could not be loaded because the Buddy workspace is missing." />
            </div>
            <button className="buddy-btn buddy-btn-cta" disabled>Message User</button>
          </div>

          <div className="buddy-card buddy-leaderboard-card">
            <h2>Top Users This Week</h2>
            <div className="buddy-leaderboard-list">
              <EmptyState title="No user leaderboard can be derived without Buddy workspace data." />
            </div>
          </div>

          <div className="buddy-card">
            <h2>Top Exercises This Week</h2>
            <div className="buddy-exercise-list">
              <EmptyState title="Exercise frequency is unavailable because no Buddy data files were found." />
            </div>
          </div>
        </div>
      </div>

      <footer className="buddy-footer">
        Buddy Dashboard &middot; Workspace missing at {workspacePath}
      </footer>
    </div>
  );
}

export default App;
