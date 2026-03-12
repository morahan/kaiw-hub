import { useState, useEffect } from 'react'
import { SignedIn, UserButton } from '@clerk/react'
import './App.css'

const reviewHistory = [
  { id: 'REV-001', title: 'Dead Hangs', author: 'Renzo', verdict: 'revise', score: 8.5, date: '2026-02-17', type: 'article' },
  { id: 'REV-002', title: 'Loaded Carries', author: 'Renzo', verdict: 'revise', score: 7.5, date: '2026-02-17', type: 'article' },
  { id: 'REV-003', title: 'Muscle Growth 101', author: 'Kaia', verdict: 'ship', score: 9.2, date: '2026-02-16', type: 'article' },
  { id: 'REV-004', title: 'HIIT Mistakes', author: 'Renzo', verdict: 'kill', score: 4.2, date: '2026-02-16', type: 'article' },
  { id: 'REV-005', title: 'Morning Warmup', author: 'Kaia', verdict: 'ship', score: 8.8, date: '2026-02-15', type: 'article' },
  { id: 'REV-006', title: 'Squat Deep', author: 'Renzo', verdict: 'revise', score: 7.9, date: '2026-02-15', type: 'article' },
]

const pendingReviews = [
  { id: 1, title: 'Mobility Flow', author: 'Renzo', submitted: '10m ago', type: 'article', preview: 'Unlock your hips with these proven mobility drills. Based on the latest research from the Journal of Sports Science...', wordCount: 1100 },
  { id: 2, title: 'Squat Form Guide', author: 'Renzo', submitted: '2h ago', type: 'article', preview: 'The king of exercises deserves respect. Here is proper form for maximum gains and injury prevention...', wordCount: 1450 },
  { id: 3, title: 'Morning Routine', author: 'Kaia', submitted: '4h ago', type: 'social', preview: '5 moves to start your day right. No equipment needed.', wordCount: 180 },
]

const activityLog = [
  { time: '10m ago', action: 'Review submitted', item: 'Mobility Flow', user: 'Renzo' },
  { time: '2h ago', action: 'Revision received', item: 'Dead Hangs', user: 'Renzo' },
  { time: '3h ago', action: 'Shipped', item: 'Loaded Carries', user: 'Thea' },
  { time: '1d ago', action: 'Killed', item: 'HIIT Mistakes', user: 'Thea' },
]

function App() {
  const [time, setTime] = useState(new Date())
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedReview, setSelectedReview] = useState(null)
  const [voiceText, setVoiceText] = useState('')
  const [voiceGenerating, setVoiceGenerating] = useState(false)
  const [showHint, setShowHint] = useState(true)

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

  const handleVerdict = (verdict) => {
    alert(`${verdict.toUpperCase()} - This would trigger the review kickback workflow.`)
  }

  return (
    <SignedIn>
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">Θ</span>
          <span className="logo-text">Thea</span>
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
                { key: 'pendingReviews', label: 'Pending', color: 'warning', click: () => setActiveView('reviews') },
                { key: 'shippedToday', label: 'Shipped', color: 'success' },
                { key: 'avgScore', label: 'Avg Score', color: '' },
                { key: 'approvalRate', label: 'Approval', color: '', suffix: '%' },
              ].map(stat => (
                <div key={stat.key} className="metric" onClick={stat.click} style={stat.click ? { cursor: 'pointer' } : {}}>
                  <div className={`metric-number ${stat.color}`}>{stat.suffix ? `${keyStats[stat.key]}${stat.suffix}` : keyStats[stat.key]}</div>
                  <div className="metric-label">{stat.label}</div>
                </div>
              ))}
            </section>

            <div className="two-col">
              <section className="section">
                <div className="section-header">
                  <h2>⏳ Pending Reviews</h2>
                  <span className="badge warning">{pendingReviews.length}</span>
                </div>
                <div className="card-list">
                  {pendingReviews.slice(0, 3).map(item => (
                    <div key={item.id} className="card pending" onClick={() => { setSelectedReview(item); setActiveView('reviews'); }}>
                      <div className="card-content"><h3>{item.title}</h3><span className="meta">{item.author} · {item.type}</span></div>
                      <span className="arrow">→</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-header"><h2>📜 Activity</h2></div>
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
            </div>

            <section className="section">
              <div className="section-header"><h2>⚡ Quick Actions</h2></div>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setActiveView('reviews')}>📝 Review Next</button>
                <button className="action-btn" onClick={() => setActiveView('voice')}>🎙️ Test Voice</button>
                <button className="action-btn" onClick={() => setActiveView('history')}>📊 View History</button>
                <button className="action-btn secondary">🔄 Sync Notion</button>
              </div>
            </section>

            <section className="section">
              <div className="section-header"><h2>💎 Brand Standards</h2></div>
              <div className="brand-grid">
                {[
                  { icon: '⚗️', title: 'Scientific', desc: '3-5 sources per article' },
                  { icon: '🏛️', title: 'Elegant', desc: '750-1,250 words' },
                  { icon: '🔥', title: 'Warm', desc: 'No hype, just facts' },
                  { icon: '✨', title: 'Confident', desc: 'Clear CTAs' },
                ].map((item, i) => (
                  <div key={i} className="brand-item"><span className="brand-icon">{item.icon}</span><div><h4>{item.title}</h4><p>{item.desc}</p></div></div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeView === 'reviews' && (
          <section className="reviews-view">
            <div className="section-header">
              {selectedReview && <button className="back-btn" onClick={() => setSelectedReview(null)}>← Back</button>}
              <h2>{selectedReview ? 'Review Detail' : 'Pending Queue'}</h2>
            </div>
            
            {selectedReview ? (
              <div className="review-detail">
                <div className="review-header">
                  <h3>{selectedReview.title}</h3>
                  <span className="review-meta">{selectedReview.author} · {selectedReview.type} · {selectedReview.wordCount} words</span>
                </div>
                <p className="preview">{selectedReview.preview}</p>
                
                <div className="checklist">
                  <h4>Quick Check</h4>
                  {['Headline ≤10 words', '3-5 sources', 'Clear CTA', 'No fake experience'].map((item, i) => (
                    <label key={i} className="check-item"><input type="checkbox" /> {item}</label>
                  ))}
                </div>

                <div className="review-actions">
                  <button className="btn btn-ship" onClick={() => handleVerdict('ship')}>✅ Ship</button>
                  <button className="btn btn-revise" onClick={() => handleVerdict('revise')}>🔄 Revise</button>
                  <button className="btn btn-kill" onClick={() => handleVerdict('kill')}>❌ Kill</button>
                </div>
              </div>
            ) : (
              <div className="review-list">
                {pendingReviews.map(item => (
                  <div key={item.id} className="review-item" onClick={() => setSelectedReview(item)}>
                    <div className="review-info"><h4>{item.title}</h4><span>{item.author} · {item.wordCount} words</span></div>
                    <span className="review-time">{item.submitted}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeView === 'voice' && (
          <section className="voice-view">
            <div className="section-header"><h2>🎙️ Voice Engine</h2></div>
            
            <div className="voice-card">
              <div className="voice-status">
                <span className="status-indicator online"></span>
                <div><h3>Fish Speech</h3><p>thea-cori-v3 · 1.2x speed</p></div>
              </div>
              
              <div className="voice-params">
                <h4>Parameters (Locked)</h4>
                <div className="params-grid">
                  {[{ k: 'temp', v: '0.2' }, { k: 'top_p', v: '0.7' }, { k: 'rep_pen', v: '1.0' }, { k: 'seed', v: '42' }].map(p => (
                    <div key={p.k} className="param"><span>{p.k}</span><span>{p.v}</span></div>
                  ))}
                </div>
              </div>

              <div className="voice-test">
                <h4>Test Voice</h4>
                <textarea placeholder="Quality is the only message worth sending." value={voiceText} onChange={(e) => setVoiceText(e.target.value)} />
                <button className="btn btn-voice" disabled={voiceGenerating || !voiceText.trim()}>{voiceGenerating ? 'Generating...' : '🎙️ Generate'}</button>
              </div>
            </div>
          </section>
        )}

        {activeView === 'history' && (
          <section className="history-view">
            <div className="section-header"><h2>📜 Review History</h2></div>
            
            <div className="history-stats">
              {['ship', 'revise', 'kill'].map(v => (
                <div key={v} className="hist-stat">
                  <span className="hist-num">{reviewHistory.filter(r => r.verdict === v).length}</span>
                  <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </div>
              ))}
            </div>

            <div className="history-list">
              {reviewHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div className={`verdict-dot ${item.verdict}`}></div>
                  <div className="history-info"><h4>{item.title}</h4><span>{item.author} · {item.date}</span></div>
                  <span className="history-score">{item.score}</span>
                  <span className={`verdict-tag ${item.verdict}`}>{item.verdict}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showHint && (
        <div className="hint">Click metrics to drill down · Hover for details</div>
      )}

      <footer className="footer">
        <span>Built by Thea 🏛️</span>
        <span>MiniMax M2.5</span>
      </footer>
    </div>
    </SignedIn>
  )
}

export default App
