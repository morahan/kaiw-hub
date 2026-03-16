import { useState, useEffect } from 'react'
import { useAuth, UserButton } from '@clerk/react'
import './css/theaDashboard.css'

const reviewHistory = [
  { id: 'REV-009', title: 'Shoulder Mobility Blueprint', author: 'Renzo', verdict: 'ship', score: 9.1, date: '2026-03-16', type: 'article' },
  { id: 'REV-008', title: 'The Forgotten Pull Muscles', author: 'Kaia', verdict: 'revise', score: 7.8, date: '2026-03-15', type: 'article' },
  { id: 'REV-007', title: 'Rest Day Protocols', author: 'Renzo', verdict: 'ship', score: 8.7, date: '2026-03-14', type: 'article' },
  { id: 'REV-006', title: 'Creatine: The Evidence', author: 'Kaia', verdict: 'ship', score: 9.4, date: '2026-03-13', type: 'article' },
  { id: 'REV-005', title: 'Bro Splits Are Back', author: 'Renzo', verdict: 'kill', score: 3.9, date: '2026-03-12', type: 'article' },
  { id: 'REV-004', title: 'Zone 2 Cardio Guide', author: 'Kaia', verdict: 'revise', score: 7.2, date: '2026-03-11', type: 'article' },
]

const pendingReviews = [
  { id: 1, title: 'Anterior Pelvic Tilt Fix', author: 'Renzo', submitted: '23m ago', type: 'article', preview: 'Most gym-goers spend years unknowingly fighting their posture. This evidence-backed guide targets the root cause — not the symptoms — of anterior pelvic tilt, with corrective exercises drawn from current physiotherapy research.', wordCount: 1180 },
  { id: 2, title: 'VO2 Max for Beginners', author: 'Kaia', submitted: '3h ago', type: 'article', preview: 'Aerobic capacity is the foundation every other fitness quality is built upon. Here is how to develop yours systematically, starting from zero, with protocols validated in peer-reviewed sport science.', wordCount: 1320 },
  { id: 3, title: 'Pre-Workout Timing', author: 'Renzo', submitted: '6h ago', type: 'social', preview: 'Timing your pre-workout nutrition can make a meaningful difference in performance output. Here is the science — distilled to 60 seconds.', wordCount: 210 },
]

const activityLog = [
  { time: '23m ago', action: 'Submitted for review', item: 'Anterior Pelvic Tilt Fix', user: 'Renzo' },
  { time: '2h ago', action: 'Shipped to production', item: 'Shoulder Mobility Blueprint', user: 'Thea' },
  { time: '4h ago', action: 'Revision requested', item: 'The Forgotten Pull Muscles', user: 'Thea' },
  { time: '1d ago', action: 'Standard violated — killed', item: 'Bro Splits Are Back', user: 'Thea' },
]

const metricTrends = {
  pendingReviews: { delta: '+1', dir: 'up', note: 'since yesterday' },
  shippedToday: { delta: '+1', dir: 'up', note: 'vs weekly avg' },
  avgScore: { delta: '+0.4', dir: 'up', note: 'vs last month' },
  approvalRate: { delta: '−5%', dir: 'down', note: 'vs last month' },
}

function App() {
  const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';
  const { isSignedIn: clerkSignedIn } = useAuth();
  const isSignedIn = SKIP_AUTH || clerkSignedIn;
  const [time, setTime] = useState(new Date())
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedReview, setSelectedReview] = useState(null)
  const [voiceText, setVoiceText] = useState('')
  const [voiceGenerating, setVoiceGenerating] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [expandedCards, setExpandedCards] = useState({})

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const keyStats = {
    pendingReviews: pendingReviews.length,
    shippedToday: reviewHistory.filter(r => r.verdict === 'ship').length,
    avgScore: (reviewHistory.reduce((a, b) => a + b.score, 0) / reviewHistory.length).toFixed(1),
    approvalRate: Math.round((reviewHistory.filter(r => r.verdict === 'ship').length / reviewHistory.length) * 100),
  }

  const toggleExpand = (id, e) => {
    e.stopPropagation()
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleVerdict = (verdict) => {
    alert(`${verdict.toUpperCase()} — This would trigger the editorial review workflow.`)
  }

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
          {['dashboard', 'reviews', 'voice', 'history'].map(view => (
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
              ].map(stat => (
                <div key={stat.key} className={`metric metric--${stat.color}`} onClick={stat.click} style={stat.click ? { cursor: 'pointer' } : {}}>
                  <div className="metric-icon">{stat.icon}</div>
                  <div className={`metric-number ${stat.color}`}>{stat.suffix ? `${keyStats[stat.key]}${stat.suffix}` : keyStats[stat.key]}</div>
                  <div className="metric-label">{stat.label}</div>
                  {metricTrends[stat.key] && (
                    <div className={`metric-trend ${metricTrends[stat.key].dir}`}>
                      <span className="trend-delta">{metricTrends[stat.key].delta}</span>
                      <span className="trend-note">{metricTrends[stat.key].note}</span>
                    </div>
                  )}
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
                <div className="flow-count success">{reviewHistory.filter(r => r.verdict === 'ship').length}</div>
                <div className="flow-label">Shipped</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-stage">
                <div className="flow-count" style={{ color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid rgba(140, 64, 64, 0.3)' }}>{reviewHistory.filter(r => r.verdict === 'kill').length}</div>
                <div className="flow-label">Killed</div>
              </div>
            </section>

            <div className="two-col">
              <section className="section">
                <div className="section-header">
                  <h2>Editorial Queue</h2>
                  <span className="badge warning">{pendingReviews.length} pending</span>
                </div>
                <div className="card-list">
                  {pendingReviews.slice(0, 3).map(item => (
                    <div key={item.id} className="card pending" onClick={() => { setSelectedReview(item); setActiveView('reviews'); }}>
                      <div className="card-content">
                        <h3>{item.title}</h3>
                        <div className="card-meta-row">
                          <span className="card-author">{item.author}</span>
                          <span className="card-type">{item.type}</span>
                          <span className="card-words">{item.wordCount.toLocaleString()} words</span>
                        </div>
                        <p className="card-preview">{expandedCards[item.id] ? item.preview : `${item.preview.slice(0, 100)}...`}</p>
                        <button className="card-expand-btn" onClick={(e) => toggleExpand(item.id, e)}>
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
                  {reviewHistory.slice(0, 4).map(item => (
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
                  {activityLog.map((item, i) => (
                    <div key={i} className="activity-item">
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
                    { icon: '⚗️', title: 'Scientific', desc: '3–5 cited sources per article' },
                    { icon: '🏛️', title: 'Elegant', desc: '750–1,250 words. No padding.' },
                    { icon: '🔥', title: 'Warm', desc: 'Evidence-led, never hype.' },
                    { icon: '✦', title: 'Confident', desc: 'Clear CTA. No hedging.' },
                  ].map((item, i) => (
                    <div key={i} className="brand-item-compact">
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
                  <span className="review-meta">{selectedReview.author} · {selectedReview.type} · {selectedReview.wordCount.toLocaleString()} words · Submitted {selectedReview.submitted}</span>
                </div>
                <blockquote className="preview">{selectedReview.preview}</blockquote>
                
                <div className="checklist">
                  <h4>Editorial Checklist</h4>
                  {['Headline is ≤10 words and specific', '3–5 credible sources cited', 'Clear call-to-action', 'No first-person false experience', 'Tone: warm, evidence-led, confident'].map((item, i) => (
                    <label key={i} className="check-item"><input type="checkbox" /> {item}</label>
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
                {pendingReviews.map(item => (
                  <div key={item.id} className="review-item" onClick={() => setSelectedReview(item)}>
                    <div className="review-info">
                      <h4>{item.title}</h4>
                      <span>{item.author} · {item.wordCount.toLocaleString()} words · {item.type}</span>
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
                <div><h3>Fish Speech</h3><p>thea-cori-v3 · 1.2× speed</p></div>
              </div>
              
              <div className="voice-params">
                <h4>Parameters — Locked by Brand Standard</h4>
                <div className="params-grid">
                  {[{ k: 'temperature', v: '0.2' }, { k: 'top_p', v: '0.7' }, { k: 'rep_penalty', v: '1.0' }, { k: 'seed', v: '42' }].map(p => (
                    <div key={p.k} className="param"><span>{p.k}</span><span>{p.v}</span></div>
                  ))}
                </div>
              </div>

              <div className="voice-test">
                <h4>Test Voice</h4>
                <textarea placeholder="Quality is the only message worth sending." value={voiceText} onChange={(e) => setVoiceText(e.target.value)} />
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
                  <span className="hist-num">{reviewHistory.filter(r => r.verdict === v).length}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="history-list">
              {reviewHistory.map(item => (
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
        <span>Claude Sonnet 4.6</span>
      </footer>
    </div>
  )
}

export default App
