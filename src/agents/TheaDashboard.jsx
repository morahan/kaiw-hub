import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import './css/theaDashboard.css';

const reviewHistory = [
  { id: 'review-4', title: 'good-article.md', author: 'system', verdict: 'revise', score: 6.6, date: '2026-03-03', type: 'article' },
  { id: 'review-5', title: 'short-article.md', author: 'system', verdict: 'revise', score: 6.6, date: '2026-03-03', type: 'article' },
  { id: 'review-6', title: 'empty-article.md', author: 'system', verdict: 'kill', score: 4.4, date: '2026-03-03', type: 'article' },
  { id: 'review-7', title: 'fake-experience-article.md', author: 'system', verdict: 'revise', score: 6.6, date: '2026-03-03', type: 'article' },
  { id: 'review-8', title: 'tmp.XTfepZ6yi4.md', author: 'system', verdict: 'revise', score: 7.0, date: '2026-03-03', type: 'article' },
  { id: 'review-3', title: 'Test Article (REV-20260301082906-4790)', author: 'system', verdict: 'revise', score: 6.0, date: '2026-03-01', type: 'article' },
  { id: 'review-2', title: 'Dead Hangs', author: 'system', verdict: 'revise', score: 8.5, date: '2026-02-18', type: 'article' },
  { id: 'review-1', title: 'Loaded Carries', author: 'system', verdict: 'revise', score: 7.5, date: '2026-02-17', type: 'article' },
];

const pendingReviews = [
  {
    id: 'REV-20260307182824-8460',
    title: 'sample-post-1.txt',
    author: 'kaia',
    submitted: '2026-03-07 18:28',
    type: 'post',
    preview: 'Feedback for revision:\n1. Hook is weak - start with a specific benefit\n2. Third paragraph needs 2-3 more sources\n3. CTA is missing at the end\nPlease revise and resubmit.',
    wordCount: null,
  },
  {
    id: 'REV-20260307183003-3158',
    title: 'sample-post.txt',
    author: 'kaia',
    submitted: '2026-03-07 18:30',
    type: 'post',
    preview: 'Hook weak. Add sources. Missing CTA.',
    wordCount: null,
  },
];

const activityLog = [
  { time: '2026-03-07 18:30', action: 'Kill verdict issued', item: 'REV-20260307183003-6787', user: 'badger' },
  { time: '2026-03-07 18:30', action: 'Revision requested', item: 'REV-20260307183003-3158', user: 'kaia' },
  { time: '2026-03-07 18:30', action: 'Shipped to production', item: 'REV-20260307183003-3329', user: 'renzo' },
  { time: '2026-03-07 18:30', action: 'Submitted for review', item: 'REV-20260307183003-6787', user: 'badger' },
  { time: '2026-03-07 18:30', action: 'Submitted for review', item: 'REV-20260307183003-3158', user: 'kaia' },
  { time: '2026-03-07 18:30', action: 'Submitted for review', item: 'REV-20260307183003-3329', user: 'renzo' },
];

const metricTrends = {
  pendingReviews: { delta: '2 queue', dir: 'up', note: 'revise-pending now' },
  shippedToday: { delta: '1 ship', dir: 'up', note: 'logged on 2026-03-15' },
  avgScore: { delta: '8 reviews', dir: 'up', note: 'scored in review history' },
  approvalRate: { delta: '2 of 6', dir: 'up', note: 'current workflow shipped' },
};

const historyStats = {
  ship: 2,
  revise: 2,
  kill: 2,
};

const voiceParams = [
  { k: 'temperature', v: '0.2' },
  { k: 'top_p', v: '0.7' },
  { k: 'rep_penalty', v: '1.2' },
  { k: 'seed', v: '42' },
];

function App() {
  const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';
  const { isSignedIn: clerkSignedIn } = useAuth();
  const isSignedIn = SKIP_AUTH || clerkSignedIn;
  const [time, setTime] = useState(new Date());
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedReview, setSelectedReview] = useState(null);
  const [voiceText, setVoiceText] = useState('Elegance is economy, and every choice serves the message.');
  const [voiceGenerating, setVoiceGenerating] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const keyStats = {
    pendingReviews: pendingReviews.length,
    shippedToday: 1,
    avgScore: 6.7,
    approvalRate: 33,
  };

  const toggleExpand = (id, event) => {
    event.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVerdict = (verdict) => {
    alert(`${verdict.toUpperCase()} — This would trigger the editorial review workflow.`);
  };

  if (!isSignedIn) {
    return (
      <div className="dashboard">
        <div className="not-signed-in">
          <div className="signin-emblem">Θ</div>
          <h2>Editorial access required</h2>
          <p>Please sign in to view the Brand Review dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">Θ</span>
          <div className="logo-meta">
            <span className="logo-text">Thea</span>
            <span className="logo-subtitle">Brand Strategist · Editorial</span>
          </div>
        </div>
        <nav className="top-nav">
          {['dashboard', 'reviews', 'voice', 'history'].map((view) => (
            <button key={view} className={`nav-btn ${activeView === view ? 'active' : ''}`} onClick={() => setActiveView(view)}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <UserButton afterSignOutUrl="/" />
          <span className="status-dot online"></span>
          <span className="time">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      <main className="main">
        {activeView === 'dashboard' && (
          <>
            <section className="key-metrics">
              {[
                { key: 'pendingReviews', label: 'In Queue', color: 'warning', icon: '◎', click: () => setActiveView('reviews') },
                { key: 'shippedToday', label: 'Shipped', color: 'success', icon: '▲' },
                { key: 'avgScore', label: 'Quality Score', color: 'gold', icon: '✦' },
                { key: 'approvalRate', label: 'Approval Rate', color: 'gold', icon: '◆', suffix: '%' },
              ].map((stat) => (
                <div key={stat.key} className={`metric metric--${stat.color}`} onClick={stat.click} style={stat.click ? { cursor: 'pointer' } : {}}>
                  <div className="metric-icon">{stat.icon}</div>
                  <div className={`metric-number ${stat.color}`}>{stat.suffix ? `${keyStats[stat.key]}${stat.suffix}` : keyStats[stat.key]}</div>
                  <div className="metric-label">{stat.label}</div>
                  <div className={`metric-trend ${metricTrends[stat.key].dir}`}>
                    <span className="trend-delta">{metricTrends[stat.key].delta}</span>
                    <span className="trend-note">{metricTrends[stat.key].note}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="pipeline-flow">
              <div className="flow-stage">
                <div className="flow-count warning">{pendingReviews.length}</div>
                <div className="flow-label">Pending</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-stage">
                <div className="flow-count gold">1</div>
                <div className="flow-label">In Review</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-stage">
                <div className="flow-count success">{historyStats.ship}</div>
                <div className="flow-label">Shipped</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-stage">
                <div className="flow-count" style={{ color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid rgba(140, 64, 64, 0.3)' }}>{historyStats.kill}</div>
                <div className="flow-label">Killed</div>
              </div>
            </section>

            <div className="two-col">
              <section className="section">
                <div className="section-header">
                  <h2>Editorial Queue</h2>
                  <span className="badge warning">{pendingReviews.length} revise-pending</span>
                </div>
                <div className="card-list">
                  {pendingReviews.map((item) => (
                    <div key={item.id} className="card pending" onClick={() => { setSelectedReview(item); setActiveView('reviews'); }}>
                      <div className="card-content">
                        <h3>{item.title}</h3>
                        <div className="card-meta-row">
                          <span className="card-author">{item.author}</span>
                          <span className="card-type">{item.type}</span>
                          <span className="card-words">{item.wordCount ? `${item.wordCount.toLocaleString()} words` : '— words'}</span>
                        </div>
                        <p className="card-preview">{expandedCards[item.id] ? item.preview : `${item.preview.slice(0, 100)}...`}</p>
                        <button className="card-expand-btn" onClick={(event) => toggleExpand(item.id, event)}>
                          {expandedCards[item.id] ? '▲ Collapse' : '▼ Preview full excerpt'}
                        </button>
                      </div>
                      <span className="card-submitted">{item.submitted}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-header"><h2>Recent Verdicts</h2></div>
                <div className="verdict-list">
                  {reviewHistory.slice(0, 4).map((item) => (
                    <div key={item.id} className="verdict-row">
                      <div className={`verdict-badge ${item.verdict}`}>{item.verdict}</div>
                      <div className="verdict-info">
                        <span className="verdict-title">{item.title}</span>
                        <span className="verdict-meta">{item.author} · {item.date}</span>
                      </div>
                      <span className="verdict-score">{item.score}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="two-col">
              <section className="section">
                <div className="section-header"><h2>Activity Log</h2></div>
                <div className="activity-list">
                  {activityLog.map((item, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-time">{item.time}</span>
                      <div className="activity-content">
                        <span className="activity-action">{item.action}</span>
                        <span className="activity-item-name">{item.item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-header"><h2>Brand Standards</h2></div>
                <div className="brand-grid-compact">
                  {[
                    { icon: '⚗️', title: 'Scientific', desc: '3-5 cited sources per article' },
                    { icon: '🏛️', title: 'Elegant', desc: '750-1,250 words. No padding.' },
                    { icon: '🔥', title: 'Warm', desc: 'Evidence-led, never hype.' },
                    { icon: '✦', title: 'Confident', desc: 'Clear CTA. No hedging.' },
                  ].map((item, index) => (
                    <div key={index} className="brand-item-compact">
                      <span className="brand-icon">{item.icon}</span>
                      <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="section">
              <div className="quick-actions">
                <button className="action-btn hero-cta" onClick={() => setActiveView('reviews')}>◎ Review Next — {pendingReviews.length} in queue</button>
                <div className="quick-actions-row">
                  <button className="action-btn" onClick={() => setActiveView('voice')}>Test Voice</button>
                  <button className="action-btn" onClick={() => setActiveView('history')}>View History</button>
                  <button className="action-btn secondary">Sync Notion</button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeView === 'reviews' && (
          <section className="reviews-view">
            <div className="section-header">
              {selectedReview && <button className="back-btn" onClick={() => setSelectedReview(null)}>← Back to Queue</button>}
              <h2>{selectedReview ? selectedReview.title : 'Editorial Queue'}</h2>
            </div>

            {selectedReview ? (
              <div className="review-detail">
                <div className="review-header">
                  <span className="review-meta">{selectedReview.author} · {selectedReview.type} · {selectedReview.wordCount ? `${selectedReview.wordCount.toLocaleString()} words` : '— words'} · Submitted {selectedReview.submitted}</span>
                </div>
                <blockquote className="preview">{selectedReview.preview}</blockquote>

                <div className="checklist">
                  <h4>Editorial Checklist</h4>
                  {['Headline is ≤10 words and specific', '3-5 credible sources cited', 'Clear call-to-action', 'No first-person false experience', 'Tone: warm, evidence-led, confident'].map((item, index) => (
                    <label key={index} className="check-item"><input type="checkbox" /> {item}</label>
                  ))}
                </div>

                <div className="review-actions">
                  <button className="btn btn-ship" onClick={() => handleVerdict('ship')}>Ship It</button>
                  <button className="btn btn-revise" onClick={() => handleVerdict('revise')}>Request Revision</button>
                  <button className="btn btn-kill" onClick={() => handleVerdict('kill')}>Kill It</button>
                </div>
              </div>
            ) : (
              <div className="review-list">
                {pendingReviews.map((item) => (
                  <div key={item.id} className="review-item" onClick={() => setSelectedReview(item)}>
                    <div className="review-info">
                      <h4>{item.title}</h4>
                      <span>{item.author} · {item.wordCount ? `${item.wordCount.toLocaleString()} words` : '— words'} · {item.type}</span>
                    </div>
                    <span className="review-time">{item.submitted}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeView === 'voice' && (
          <section className="voice-view">
            <div className="section-header"><h2>Voice Engine</h2></div>

            <div className="voice-card">
              <div className="voice-status">
                <span className="status-indicator online"></span>
                <div><h3>Fish Speech</h3><p>reference-cori-v3-energetic · 1.2× speed</p></div>
              </div>

              <div className="voice-params">
                <h4>Parameters — Locked by Brand Standard</h4>
                <div className="params-grid">
                  {voiceParams.map((param) => (
                    <div key={param.k} className="param"><span>{param.k}</span><span>{param.v}</span></div>
                  ))}
                </div>
              </div>

              <div className="voice-test">
                <h4>Test Voice</h4>
                <textarea value={voiceText} onChange={(event) => setVoiceText(event.target.value)} />
                <button className="btn btn-voice" disabled={voiceGenerating || !voiceText.trim()}>{voiceGenerating ? 'Generating…' : 'Generate Sample'}</button>
              </div>
            </div>
          </section>
        )}

        {activeView === 'history' && (
          <section className="history-view">
            <div className="section-header"><h2>Review History</h2></div>

            <div className="history-stats">
              {[
                { v: 'ship', label: 'Shipped', color: 'success' },
                { v: 'revise', label: 'Revised', color: 'warning' },
                { v: 'kill', label: 'Killed', color: 'danger' },
              ].map(({ v, label, color }) => (
                <div key={v} className={`hist-stat ${color}`}>
                  <span className="hist-num">{historyStats[v]}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="history-list">
              {reviewHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className={`verdict-dot ${item.verdict}`}></div>
                  <div className="history-info">
                    <h4>{item.title}</h4>
                    <span>{item.author} · {item.date}</span>
                  </div>
                  <span className="history-score">{item.score}</span>
                  <span className={`verdict-tag ${item.verdict}`}>{item.verdict}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showHint && (
        <div className="hint">Click metrics to drill down · Hover cards for details</div>
      )}

      <footer className="footer">
        <span>Thea 🏛️ · Brand Strategist</span>
        <span>Review data from memory/reviews.json, reviews-data.json, and sla-tracker.json</span>
      </footer>
    </div>
  );
}

export default App;
