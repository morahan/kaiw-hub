import { useState, useEffect } from 'react';
import { useAuth, SignIn, UserButton } from '@clerk/react';
import './css/kaiaDashboard.css';

const API_BASE = 'http://localhost:3001/api';

// ── Mock / fallback data ──────────────────────────────────────────────────────
const MOCK_STATS = {
  hot_trends: 24,
  warm_trends: 61,
  content_written: 38,
  total_trends: 127,
  hits: 19,
  misses: 6,
  pending: 14,
  competitors: 42,
  raw_signals: 389,
};

const MOCK_TOP_TRENDS = [
  { trend_name: 'Zone 2 Cardio Revival', category: 'Cardio', platform: 'YouTube', signal_strength: 'HOT', predicted_angle: 'Science-backed low-intensity training reshaping endurance culture.', content_written: false, score: 94 },
  { trend_name: 'Pilates Renaissance', category: 'Flexibility', platform: 'TikTok', signal_strength: 'HOT', predicted_angle: 'Studio Pilates going mainstream via short-form content creators.', content_written: true, score: 91 },
  { trend_name: '12-3-30 Treadmill', category: 'Cardio', platform: 'TikTok', signal_strength: 'HOT', predicted_angle: 'Low-impact incline walking dominating beginner fitness space.', content_written: true, score: 88 },
  { trend_name: 'Functional Strength', category: 'Strength', platform: 'Instagram', signal_strength: 'HOT', predicted_angle: 'Movement-based training replacing traditional bodybuilding splits.', content_written: false, score: 86 },
  { trend_name: 'Cold Plunge Recovery', category: 'Recovery', platform: 'YouTube', signal_strength: 'HOT', predicted_angle: 'Ice bath culture crossing from elite athletes to everyday gym-goers.', content_written: false, score: 83 },
  { trend_name: 'Cozy Cardio', category: 'Cardio', platform: 'TikTok', signal_strength: 'HOT', predicted_angle: 'Low-pressure, low-light home workouts — anti-hustle fitness vibe.', content_written: false, score: 81 },
  { trend_name: 'VO2 Max Training', category: 'Performance', platform: 'YouTube', signal_strength: 'WARM', predicted_angle: 'Longevity-focused fitness metric gaining mainstream attention.', content_written: false, score: 75 },
  { trend_name: 'Primal Movement', category: 'Mobility', platform: 'Instagram', signal_strength: 'WARM', predicted_angle: 'Animal-flow and ground-based movement patterns trending upward.', content_written: false, score: 72 },
  { trend_name: 'Hybrid Athlete Training', category: 'Strength', platform: 'YouTube', signal_strength: 'WARM', predicted_angle: 'Run + lift culture bridging distance runners and lifters.', content_written: true, score: 70 },
  { trend_name: 'Breathwork for Fitness', category: 'Mindfulness', platform: 'TikTok', signal_strength: 'WARM', predicted_angle: 'Wim Hof methods entering pre/post workout routines.', content_written: false, score: 68 },
  { trend_name: 'Jump Rope HIIT', category: 'Cardio', platform: 'Instagram', signal_strength: 'WARM', predicted_angle: 'Accessible, portable cardio tool getting a serious glow-up.', content_written: false, score: 65 },
  { trend_name: 'Sleep Optimization', category: 'Recovery', platform: 'YouTube', signal_strength: 'WARM', predicted_angle: 'Sleep as a performance lever — wearables driving the conversation.', content_written: true, score: 63 },
];

const MOCK_PENDING_TRENDS = [
  { trend_name: 'Rucking for Beginners', category: 'Cardio', signal_strength: 'HOT' },
  { trend_name: 'Red Light Therapy', category: 'Recovery', signal_strength: 'HOT' },
  { trend_name: 'Micro-Workouts (5 min)', category: 'Strength', signal_strength: 'WARM' },
  { trend_name: 'Grip Strength Hacks', category: 'Strength', signal_strength: 'WARM' },
  { trend_name: 'Outdoor Yoga Surge', category: 'Flexibility', signal_strength: 'WARM' },
  { trend_name: 'Creatine for Women', category: 'Nutrition', signal_strength: 'HOT' },
  { trend_name: 'Deload Week Strategy', category: 'Performance', signal_strength: 'WARM' },
];

const MOCK_HITS = [
  { trend_name: 'Walking Pad Workouts', category: 'Cardio', outcome_notes: 'Predicted 3 weeks early — 2.1M TikTok views at peak.', date_outcome: '2024-10-18' },
  { trend_name: 'Resistance Band Rebirth', category: 'Strength', outcome_notes: 'Picked up before Amazon listing spike. Article ranked #3.', date_outcome: '2024-11-02' },
  { trend_name: 'Low Rep Heavy Sets', category: 'Strength', outcome_notes: 'Athlete crossover drove mainstream interest.', date_outcome: '2024-12-15' },
  { trend_name: 'Sauna + Cold Contrast', category: 'Recovery', outcome_notes: 'Longevity angle landed perfectly — newsletter top performer.', date_outcome: '2025-01-08' },
  { trend_name: 'Intuitive Eating Redux', category: 'Nutrition', outcome_notes: 'Counter-macro wave confirmed. High search intent.', date_outcome: '2025-01-22' },
];

const MOCK_COMPETITORS = [
  { competitor_name: 'Healthline Fitness', signal_type: 'hot', title: 'Published 5 Zone 2 articles in 10 days', insight: 'Doubling down — we need to move fast on this angle.' },
  { competitor_name: 'MyFitnessPal Blog', signal_type: 'gap', title: 'No cold plunge content yet', insight: 'Opportunity window open for next 2–3 weeks.' },
  { competitor_name: 'Men\'s Health', signal_type: 'hot', title: 'Hybrid athlete cover feature this month', insight: 'Confirms our warm signal — boost to HOT.' },
  { competitor_name: 'Well+Good', signal_type: 'gap', title: 'Pilates coverage slowed since November', insight: 'Studio audience underserved — quick win available.' },
  { competitor_name: 'Shape Magazine', signal_type: 'neutral', title: 'Cozy cardio piece doing average engagement', insight: 'They didn\'t nail the angle — room for a better version.' },
  { competitor_name: 'Nerd Fitness', signal_type: 'hot', title: 'Grip strength series launched', insight: 'Validates our pending signal — time to publish.' },
];

const MOCK_CATEGORIES = [
  { category: 'Cardio', count: 32, hot_count: 8, warm_count: 14, written: 12 },
  { category: 'Strength', count: 28, hot_count: 6, warm_count: 13, written: 9 },
  { category: 'Recovery', count: 21, hot_count: 5, warm_count: 9, written: 8 },
  { category: 'Flexibility', count: 15, hot_count: 2, warm_count: 8, written: 4 },
  { category: 'Nutrition', count: 14, hot_count: 2, warm_count: 7, written: 3 },
  { category: 'Mindfulness', count: 10, hot_count: 1, warm_count: 6, written: 2 },
  { category: 'Performance', count: 7, hot_count: 0, warm_count: 4, written: 0 },
];

const MOCK_PLATFORMS = [
  { platform: 'TikTok', count: 48 },
  { platform: 'YouTube', count: 39 },
  { platform: 'Instagram', count: 24 },
  { platform: 'Reddit', count: 9 },
  { platform: 'Twitter/X', count: 7 },
];
// ─────────────────────────────────────────────────────────────────────────────

const STRENGTH_CONFIG = {
  HOT:  { color: 'var(--wave-hot)',     label: '🔥 HOT',  emoji: '🔥' },
  WARM: { color: 'var(--wave-warm)',    label: '🌡️ WARM', emoji: '🌡️' },
  COOL: { color: 'var(--wave-cool)',    label: '💧 COOL', emoji: '💧' },
};

function StrengthMeter({ score = 0 }) {
  const bars = 10;
  const filled = Math.round((score / 100) * bars);
  const color = score >= 80 ? 'var(--wave-hot)' : score >= 60 ? 'var(--wave-warm)' : 'var(--wave-cool)';
  return (
    <div className="strength-meter" title={`Score: ${score}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`meter-bar ${i < filled ? 'filled' : ''}`}
          style={i < filled ? { background: color } : {}}
        />
      ))}
      <span className="meter-score">{score}</span>
    </div>
  );
}

function TrendCard({ trend, index }) {
  const cfg = STRENGTH_CONFIG[trend.signal_strength?.toUpperCase()] || STRENGTH_CONFIG.COOL;
  return (
    <div
      className={`trend-card ${trend.signal_strength?.toLowerCase()}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="trend-card-glow" style={{ background: cfg.color }} />
      <div className="trend-header">
        <span className="trend-name">{trend.trend_name}</span>
        <span className={`signal-badge ${trend.signal_strength?.toLowerCase()}`}>
          {cfg.emoji} {trend.signal_strength}
        </span>
      </div>
      <div className="trend-meta">
        <span className="category">📂 {trend.category}</span>
        <span className="platform">📡 {trend.platform}</span>
      </div>
      {trend.score != null && <StrengthMeter score={trend.score} />}
      {trend.predicted_angle && <p className="trend-angle">{trend.predicted_angle}</p>}
      <div className="trend-footer">
        {trend.content_written
          ? <span className="status done">✓ Published</span>
          : <span className="status pending">○ Queue</span>}
      </div>
    </div>
  );
}

function App() {
  const { isSignedIn } = useAuth();
  const [stats, setStats]               = useState(null);
  const [topTrends, setTopTrends]       = useState([]);
  const [pendingTrends, setPendingTrends] = useState([]);
  const [recentHits, setRecentHits]     = useState([]);
  const [competitors, setCompetitors]   = useState([]);
  const [categories, setCategories]     = useState([]);
  const [platforms, setPlatforms]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [activeTab, setActiveTab]       = useState('overview');
  const [usingMock, setUsingMock]       = useState(false);

  const applyFallback = () => {
    setStats(MOCK_STATS);
    setTopTrends(MOCK_TOP_TRENDS);
    setPendingTrends(MOCK_PENDING_TRENDS);
    setRecentHits(MOCK_HITS);
    setCompetitors(MOCK_COMPETITORS);
    setCategories(MOCK_CATEGORIES);
    setPlatforms(MOCK_PLATFORMS);
    setLastUpdated('demo mode');
    setUsingMock(true);
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const [statsRes, trendsRes, pendingRes, hitsRes, compsRes, catsRes, platsRes] = await Promise.all([
        fetch(`${API_BASE}/stats`,                    { signal: controller.signal }),
        fetch(`${API_BASE}/trends/top?limit=15`,      { signal: controller.signal }),
        fetch(`${API_BASE}/trends/pending?limit=15`,  { signal: controller.signal }),
        fetch(`${API_BASE}/trends/recent-hits?limit=8`, { signal: controller.signal }),
        fetch(`${API_BASE}/competitors/recent?limit=8`, { signal: controller.signal }),
        fetch(`${API_BASE}/trends/by-category`,       { signal: controller.signal }),
        fetch(`${API_BASE}/trends/by-platform`,       { signal: controller.signal }),
      ]);
      clearTimeout(timeout);

      setStats(await statsRes.json());
      setTopTrends(await trendsRes.json());
      setPendingTrends(await pendingRes.json());
      setRecentHits(await hitsRes.json());
      setCompetitors(await compsRes.json());
      setCategories(await catsRes.json());
      setPlatforms(await platsRes.json());
      setLastUpdated(new Date().toLocaleTimeString());
      setUsingMock(false);
      setLoading(false);
    } catch (err) {
      console.warn('API unavailable — using mock data:', err.message);
      applyFallback();
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="wave-container">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
        <p className="loading-text">🌊 Riding the data wave…</p>
      </div>
    );
  }

  const hitRate = stats?.hits + stats?.misses > 0
    ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100)
    : 0;

  const contentCoverage = stats?.total_trends > 0
    ? Math.round((stats.content_written / stats.total_trends) * 100)
    : 0;

  const maxCat  = Math.max(...categories.map(c => c.count), 1);
  const maxPlat = Math.max(...platforms.map(p => p.count), 1);

  if (!isSignedIn) {
    return (
      <div className="dashboard">
        <div className="ocean-bg" />
        <div className="sign-in-wrapper">
          <div className="sign-in-card">
            <span className="sign-in-wave">🌊</span>
            <h2>Kaia's Trend Hub</h2>
            <p>Sign in to access the dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview',   label: '📊 Overview' },
    { id: 'trends',     label: '🔥 Trends' },
    { id: 'wip',        label: '⚡ WIP' },
    { id: 'hits',       label: '🎯 Hits' },
    { id: 'intel',      label: '🏢 Intel' },
    { id: 'breakdown',  label: '📈 Breakdown' },
  ];

  return (
    <div className="dashboard">
      <div className="ocean-bg">
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />
      </div>

      {usingMock && (
        <div className="mock-banner">
          📡 API offline — showing demo data &nbsp;·&nbsp; backend at localhost:3001
        </div>
      )}

      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="wave-emoji">🌊</span>
            <div className="logo-text">
              <h1>Kaia</h1>
              <span className="tagline">Trend Hunter</span>
            </div>
          </div>
          <div className="header-stats">
            <UserButton afterSignOutUrl="/" />
            <div className="live-indicator">
              <span className="pulse" />
              {usingMock ? 'DEMO' : 'LIVE'}
            </div>
            <span className="last-updated">Updated: {lastUpdated}</span>
          </div>
        </div>
        <nav className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <main className="main-content">
          <section className="stats-grid">
            {[
              { icon: '🔥', value: stats?.hot_trends || 0,       label: 'Hot Trends',     fill: 'hot',     pct: (stats?.hot_trends / 50) * 100 },
              { icon: '🌡️', value: stats?.warm_trends || 0,      label: 'Warm Trends',    fill: 'warm',    pct: (stats?.warm_trends / 100) * 100 },
              { icon: '✍️', value: stats?.content_written || 0,  label: 'Articles',       fill: 'content', pct: contentCoverage },
              { icon: '🎯', value: `${hitRate}%`,                 label: 'Hit Rate',       fill: 'hit',     pct: hitRate },
            ].map((card, i) => (
              <div key={i} className={`stat-card stat-card-${card.fill}`}>
                <div className="stat-card-shine" />
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
                <div className="stat-bar">
                  <div className={`stat-bar-fill ${card.fill}`} style={{ width: `${Math.min(card.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </section>

          <section className="pipeline-section">
            <h2>📈 Pipeline Pulse</h2>
            <div className="pipeline-grid">
              <div className="pipeline-card"><div className="pipeline-number">{stats?.total_trends || 0}</div><div className="pipeline-label">Total Tracked</div></div>
              <div className="pipeline-card success"><div className="pipeline-number">{stats?.hits || 0}</div><div className="pipeline-label">Confirmed Hits</div></div>
              <div className="pipeline-card pending"><div className="pipeline-number">{stats?.pending || 0}</div><div className="pipeline-label">Pending</div></div>
              <div className="pipeline-card"><div className="pipeline-number">{stats?.competitors || 0}</div><div className="pipeline-label">Competitor Signals</div></div>
              <div className="pipeline-card"><div className="pipeline-number">{stats?.raw_signals || 0}</div><div className="pipeline-label">Raw Signals</div></div>
            </div>
          </section>

          <section className="quick-section">
            <h3>🔥 Hot Right Now</h3>
            <div className="trend-tags">
              {topTrends.slice(0, 10).map((trend, i) => (
                <span key={i} className={`trend-tag ${trend.signal_strength?.toLowerCase()}`}>
                  {trend.trend_name}
                  {trend.score != null && <em className="tag-score">{trend.score}</em>}
                </span>
              ))}
            </div>
          </section>

          {/* Mini platform breakdown on overview */}
          <section className="overview-platforms">
            <h3>📡 Platform Activity</h3>
            <div className="mini-platform-bars">
              {platforms.map((p, i) => (
                <div key={i} className="mini-plat-row">
                  <span className="mini-plat-name">{p.platform}</span>
                  <div className="mini-plat-track">
                    <div
                      className="mini-plat-fill"
                      style={{
                        width: `${(p.count / maxPlat) * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                  <span className="mini-plat-count">{p.count}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ── TRENDS ───────────────────────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <main className="main-content">
          <section className="trends-section">
            <h2>🔥 All Hot Trends</h2>
            <div className="trends-grid">
              {topTrends.map((trend, i) => (
                <TrendCard key={i} trend={trend} index={i} />
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ── WIP ──────────────────────────────────────────────────────────── */}
      {activeTab === 'wip' && (
        <main className="main-content">
          <section className="wip-section">
            <h2>⚡ Work In Progress</h2>
            {pendingTrends.length === 0 ? (
              <div className="empty-state">
                <span className="empty-emoji">🎉</span>
                <p>All caught up! Nothing pending.</p>
              </div>
            ) : (
              <div className="wip-list">
                {pendingTrends.map((trend, i) => (
                  <div key={i} className="wip-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <span className={`priority-dot ${trend.signal_strength?.toLowerCase()}`} />
                    <div className="wip-content">
                      <span className="wip-name">{trend.trend_name}</span>
                      <span className="wip-category">{trend.category}</span>
                    </div>
                    <span className={`action-badge ${trend.signal_strength?.toLowerCase()}`}>
                      {trend.signal_strength}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ── HITS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'hits' && (
        <main className="main-content">
          <section className="hits-section">
            <h2>🎯 Confirmed Hits</h2>
            {recentHits.length === 0 ? (
              <div className="empty-state">
                <span className="empty-emoji">🎯</span>
                <p>No hits recorded yet.</p>
              </div>
            ) : (
              <div className="hits-grid">
                {recentHits.map((hit, i) => (
                  <div key={i} className="hit-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="hit-badge">🎯 HIT</div>
                    <span className="hit-name">{hit.trend_name}</span>
                    <span className="hit-category">{hit.category}</span>
                    {hit.outcome_notes && <p className="hit-notes">{hit.outcome_notes}</p>}
                    {hit.date_outcome && <span className="hit-date">{hit.date_outcome}</span>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ── INTEL ────────────────────────────────────────────────────────── */}
      {activeTab === 'intel' && (
        <main className="main-content">
          <section className="intel-section">
            <h2>🏢 Competitor Intel</h2>
            <div className="intel-grid">
              {competitors.map((comp, i) => (
                <div key={i} className={`intel-card intel-${comp.signal_type}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="intel-header">
                    <span className="signal-type">
                      {comp.signal_type === 'hot' ? '🔥' : comp.signal_type === 'gap' ? '🎯' : '📌'}
                    </span>
                    <span className="competitor-name">{comp.competitor_name}</span>
                    <span className={`intel-type-badge intel-type-${comp.signal_type}`}>
                      {comp.signal_type}
                    </span>
                  </div>
                  <p className="intel-title">{comp.title}</p>
                  {comp.insight && <p className="intel-insight">💡 {comp.insight}</p>}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ── BREAKDOWN ────────────────────────────────────────────────────── */}
      {activeTab === 'breakdown' && (
        <main className="main-content">
          <section className="breakdown-section">
            <h2>📈 Trends by Category</h2>
            <div className="breakdown-grid">
              {categories.map((cat, i) => {
                const pct = Math.round((cat.count / maxCat) * 100);
                return (
                  <div key={i} className="breakdown-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="breakdown-header">
                      <span className="breakdown-name">{cat.category}</span>
                      <span className="breakdown-count">{cat.count}</span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="breakdown-meta">
                      <span className="hot-count">🔥 {cat.hot_count} hot</span>
                      <span className="warm-count">🌡️ {cat.warm_count} warm</span>
                      <span className="written-count">✍️ {cat.written} written</span>
                    </div>
                    {/* mini-bars for hot/warm/written */}
                    <div className="breakdown-sub-bars">
                      <div className="sub-bar-row">
                        <span>Hot</span>
                        <div className="sub-bar-track">
                          <div className="sub-bar-fill sub-hot" style={{ width: `${(cat.hot_count / cat.count) * 100}%` }} />
                        </div>
                      </div>
                      <div className="sub-bar-row">
                        <span>Warm</span>
                        <div className="sub-bar-track">
                          <div className="sub-bar-fill sub-warm" style={{ width: `${(cat.warm_count / cat.count) * 100}%` }} />
                        </div>
                      </div>
                      <div className="sub-bar-row">
                        <span>Written</span>
                        <div className="sub-bar-track">
                          <div className="sub-bar-fill sub-written" style={{ width: `${(cat.written / cat.count) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="breakdown-section platform-section">
            <h2>📡 Trends by Platform</h2>
            <div className="platform-grid">
              {platforms.map((plat, i) => (
                <div key={i} className="platform-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="platform-name">{plat.platform}</span>
                  <div className="platform-bar">
                    <div className="platform-fill" style={{ width: `${(plat.count / maxPlat) * 100}%` }} />
                  </div>
                  <span className="platform-count">{plat.count}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      <footer className="footer">
        <p>🌊 Kaia Dashboard v2.2 — Riding the trend wave</p>
      </footer>
    </div>
  );
}

export default App;
