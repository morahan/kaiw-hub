import { useState, useEffect } from 'react';
import { useAuth, SignIn, UserButton } from '@clerk/react';
import './css/kaiaDashboard.css';

const WORKSPACE_UPDATED_AT = '2026-03-09 19:20:31';

const REAL_STATS = {
  hot_trends: 162,
  warm_trends: 440,
  content_written: 632,
  total_trends: 800,
  hits: 59,
  misses: 0,
  pending: 168,
  competitors: 104,
  raw_signals: 66,
};

const REAL_TOP_TRENDS = [
  { trend_name: 'Water intake for weight loss actually works, dropped 6 pounds just from cutting diet soda and drinking plain water', category: 'fitness', platform: 'reddit', signal_strength: 'HOT', predicted_angle: 'Content around weight loss and cutting, inspired by a firsthand hydration success story.', content_written: true, score: 82 },
  { trend_name: 'Water intake for strength during a cut matters more than expected, proper hydration stopped my performance drop', category: 'fitness', platform: 'reddit', signal_strength: 'HOT', predicted_angle: 'Listicle angle on maintaining strength during a cut through hydration discipline.', content_written: true, score: 82 },
  { trend_name: 'Can you maintain muscle lifting once a week?', category: 'fitness', platform: 'reddit', signal_strength: 'HOT', predicted_angle: 'Muscle retention and minimum-effective-dose framing around once-weekly lifting.', content_written: true, score: 81 },
  { trend_name: 'A mouse study suggests strength training may beat running for diabetes prevention', category: 'science', platform: 'brave-search', signal_strength: 'HOT', predicted_angle: 'New animal research reframes exercise prescriptions for insulin sensitivity around resistance training.', content_written: true, score: 80 },
  { trend_name: 'Better than running? Mouse study suggests strength training may be more powerful against diabetes', category: 'science', platform: 'brave-search', signal_strength: 'HOT', predicted_angle: 'Strength training as a stronger-than-expected diabetes intervention and public health hook.', content_written: true, score: 80 },
  { trend_name: 'Creatine for Endurance: The Secret to Infinite Stamina - Fueling Fitness and Finding Focus', category: 'supplements', platform: 'brave-search', signal_strength: 'WARM', predicted_angle: 'Hydrogen ion buffering and fatigue delay reposition creatine as an endurance tool.', content_written: true, score: 78 },
  { trend_name: 'Creatine & Alzheimer’s Disease: A Physician Reviews the Data', category: 'fitness', platform: 'youtube', signal_strength: 'WARM', predicted_angle: 'YouTube audiences are engaging with creatine through a brain-health lens.', content_written: true, score: 78 },
  { trend_name: 'Creatine & Beta-Alanine: The Powerhouse Duo | Myprotein', category: 'nutrition', platform: 'youtube', signal_strength: 'WARM', predicted_angle: 'Supplement stack content is trending on YouTube with a performance-forward framing.', content_written: true, score: 78 },
  { trend_name: 'Organs & Co. Episode 1 - Creatine', category: 'fitness', platform: 'youtube', signal_strength: 'WARM', predicted_angle: 'Creatine education is pulling strong general-fitness attention on YouTube.', content_written: true, score: 78 },
  { trend_name: 'Does Creatine Timing Really Matter for Muscle Growth? What the Science', category: 'nutrition', platform: 'brave-search', signal_strength: 'WARM', predicted_angle: 'Consistency over timing gives this creatine explainer a myth-busting SEO angle.', content_written: true, score: 78 },
  { trend_name: 'Creatine Benefits: The Most Proven Supplement for Strength, Performanc – Chemical Warfare', category: 'supplements', platform: 'brave-search', signal_strength: 'WARM', predicted_angle: 'Recovery, inflammation, and multi-session training benefits keep creatine coverage expanding.', content_written: true, score: 78 },
  { trend_name: 'Creatine + HMB Explained: Why This Stack Outperforms Creatine Alone', category: 'fitness', platform: 'youtube', signal_strength: 'WARM', predicted_angle: 'Stack-based supplement content is holding attention with clear performance claims.', content_written: true, score: 78 },
];

const REAL_PENDING_TRENDS = [
  { trend_name: 'Fitness Trends for 2026 - Why ETM Isn\'t the Future | 99 - YouTube', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Most Popular TikTok Trends Right Now | TikTok', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Gen Z Fitness | TikTok', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Ai Fitness Influencer | TikTok', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Funny Lady Walking Fast While Squatting | TikTok', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Workout Dance Trend | TikTok', category: 'fitness', signal_strength: 'HOT' },
  { trend_name: 'Gymtok | TikTok', category: 'fitness', signal_strength: 'HOT' },
];

const REAL_HITS = [
  { trend_name: 'Should I train everyday for hypertrophy?', category: 'fitness', outcome_notes: 'ongoing', date_outcome: '—' },
  { trend_name: 'Im trying to combine hypertrophy and calisthenics.', category: 'fitness', outcome_notes: 'ongoing', date_outcome: '—' },
  { trend_name: 'Water intake for strength during a cut matters more than expected, proper hydration stopped my performance drop', category: 'fitness', outcome_notes: 'ongoing', date_outcome: '—' },
  { trend_name: 'Is there any research on taking protein in smaller chunks and its effects on MPS or hypertrophy?', category: 'fitness', outcome_notes: 'ongoing', date_outcome: '—' },
  { trend_name: 'How effective is creatine for muscle recovery in reducing soreness?', category: 'fitness', outcome_notes: 'ongoing', date_outcome: '—' },
];

const REAL_COMPETITORS = [
  { competitor_name: 'Strava', signal_type: 'mention', title: 'Tinder ya no es una opción, así fue como Strava se convirtió en una app de citas con grupos para salir a correr - Infobae', insight: 'Strava is showing up in mainstream lifestyle coverage, not just training content.' },
  { competitor_name: 'JEFIT', signal_type: 'mention', title: 'JEFIT Gym Workout Tracker MOD APK 16.2.8 (Premium Unlocked)', insight: 'JEFIT is generating broad app-search attention outside normal brand channels.' },
  { competitor_name: 'JEFIT', signal_type: 'mention', title: 'JEFIT for Android Free Download', insight: 'Download-intent traffic around JEFIT is still active.' },
  { competitor_name: 'JEFIT', signal_type: 'business', title: 'The 12 Top Workout Apps of 2026 for Science-Based Muscle Growth', insight: 'JEFIT keeps getting pulled into roundup-style comparison content.' },
  { competitor_name: 'Strong', signal_type: 'feature', title: 'Announcing Windows 11 Insider Preview Build 26220.7934 (Beta Channel) | Windows Insider Blog', insight: 'Strong surfaced in a feature-monitoring pass, suggesting broad keyword overlap.' },
  { competitor_name: 'Strong', signal_type: 'gap', title: 'r/EntrepreneurRideAlong on Reddit: I built a one screen app and people had strong opinions about it…', insight: 'There is still exploitable user pain around Strong-style product expectations.' },
];

const REAL_CATEGORIES = [
  { category: 'fitness', count: 308, hot_count: 65, warm_count: 215, written: 271 },
  { category: 'training', count: 73, hot_count: 0, warm_count: 41, written: 57 },
  { category: 'nutrition', count: 62, hot_count: 0, warm_count: 45, written: 49 },
  { category: 'health', count: 41, hot_count: 26, warm_count: 0, written: 35 },
  { category: 'weight_loss', count: 34, hot_count: 1, warm_count: 6, written: 24 },
  { category: 'tech', count: 32, hot_count: 0, warm_count: 4, written: 0 },
  { category: 'sport', count: 31, hot_count: 0, warm_count: 18, written: 25 },
  { category: 'recovery', count: 26, hot_count: 0, warm_count: 21, written: 22 },
  { category: 'science', count: 25, hot_count: 25, warm_count: 0, written: 23 },
  { category: 'supplements', count: 24, hot_count: 1, warm_count: 23, written: 15 },
];

const REAL_PLATFORMS = [
  { platform: 'brave-search', count: 315 },
  { platform: 'reddit', count: 212 },
  { platform: 'youtube', count: 96 },
  { platform: 'media', count: 48 },
  { platform: 'google-search', count: 45 },
  { platform: 'tiktok', count: 32 },
];

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
        <span className={`signal-badge-wrap`}>
          <span className={`signal-badge ${trend.signal_strength?.toLowerCase()}`}>
            {cfg.emoji} {trend.signal_strength}
          </span>
          {trend.score != null && <ScoreTooltip score={trend.score} trend={trend} />}
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

function ScoreTooltip({ score, trend }) {
  const platform = trend.platform || 'Multi';
  const category = trend.category || 'General';
  const socialScore = Math.min(Math.round(score * 0.4 + (platform === 'TikTok' ? 8 : 0)), 100);
  const searchScore = Math.min(Math.round(score * 0.3 + (category === 'Cardio' ? 5 : 0)), 100);
  const velocityScore = Math.min(Math.round(score * 0.2 + 3), 100);
  const competitorScore = Math.min(Math.round(score * 0.1 + 2), 100);
  return (
    <div className="score-tooltip">
      <div className="tooltip-title">Score Breakdown</div>
      <div className="tooltip-row"><span>Social Signals</span><span>{socialScore}</span></div>
      <div className="tooltip-row"><span>Search Volume</span><span>{searchScore}</span></div>
      <div className="tooltip-row"><span>Velocity</span><span>{velocityScore}</span></div>
      <div className="tooltip-row"><span>Competitor Gap</span><span>{competitorScore}</span></div>
      <div className="tooltip-total"><span>Total</span><span>{score}</span></div>
    </div>
  );
}

function App() {
  const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';
  const { isSignedIn: clerkSignedIn } = useAuth();
  const isSignedIn = SKIP_AUTH || clerkSignedIn;
  const [stats, setStats]               = useState(REAL_STATS);
  const [topTrends, setTopTrends]       = useState(REAL_TOP_TRENDS);
  const [pendingTrends, setPendingTrends] = useState(REAL_PENDING_TRENDS);
  const [recentHits, setRecentHits]     = useState(REAL_HITS);
  const [competitors, setCompetitors]   = useState(REAL_COMPETITORS);
  const [categories, setCategories]     = useState(REAL_CATEGORIES);
  const [platforms, setPlatforms]       = useState(REAL_PLATFORMS);
  const [loading, setLoading]           = useState(true);
  const [lastUpdated, setLastUpdated]   = useState(WORKSPACE_UPDATED_AT);
  const [activeTab, setActiveTab]       = useState('overview');
  const [trendFilter, setTrendFilter]   = useState('all');
  const [trendsExpanded, setTrendsExpanded] = useState(false);
  const TRENDS_PER_PAGE = 6;

  useEffect(() => {
    setLoading(false);
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
              WORKSPACE
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
            <div className="pipeline-summary-bar">
              <span className="psb-item hot">{stats?.hot_trends || 0} HOT</span>
              <span className="psb-sep">·</span>
              <span className="psb-item warm">{stats?.warm_trends || 0} WARM</span>
              <span className="psb-sep">·</span>
              <span className="psb-item pending">{stats?.pending || 0} PENDING</span>
              <span className="psb-sep">·</span>
              <span className="psb-item written">{stats?.content_written || 0} WRITTEN</span>
            </div>
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
            <div className="pipeline-summary-bar" style={{ marginBottom: '0.75rem' }}>
              {platforms.map((p, i) => (
                <span key={i}>
                  <span className="psb-item platform-inline">{p.count} {p.platform}</span>
                  {i < platforms.length - 1 && <span className="psb-sep">·</span>}
                </span>
              ))}
            </div>
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
      {activeTab === 'trends' && (() => {
        const filtered = topTrends.filter(t => {
          if (trendFilter === 'all') return true;
          if (trendFilter === 'hot') return t.signal_strength?.toUpperCase() === 'HOT';
          if (trendFilter === 'warm') return t.signal_strength?.toUpperCase() === 'WARM';
          if (trendFilter === 'written') return t.content_written;
          if (trendFilter === 'unwritten') return !t.content_written;
          return true;
        });
        const visible = trendsExpanded ? filtered : filtered.slice(0, TRENDS_PER_PAGE);
        const hasMore = filtered.length > TRENDS_PER_PAGE;
        return (
          <main className="main-content">
            <section className="trends-section">
              <h2>🔥 All Hot Trends</h2>
              <div className="trend-filter-tabs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'hot', label: '🔥 HOT' },
                  { id: 'warm', label: '🌡️ WARM' },
                  { id: 'written', label: '✓ Written' },
                  { id: 'unwritten', label: '○ Unwritten' },
                ].map(f => (
                  <button
                    key={f.id}
                    className={`filter-tab ${trendFilter === f.id ? 'active' : ''}`}
                    onClick={() => { setTrendFilter(f.id); setTrendsExpanded(false); }}
                  >
                    {f.label}
                    <span className="filter-count">
                      {f.id === 'all' ? topTrends.length
                        : f.id === 'hot' ? topTrends.filter(t => t.signal_strength?.toUpperCase() === 'HOT').length
                        : f.id === 'warm' ? topTrends.filter(t => t.signal_strength?.toUpperCase() === 'WARM').length
                        : f.id === 'written' ? topTrends.filter(t => t.content_written).length
                        : topTrends.filter(t => !t.content_written).length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="trends-grid">
                {visible.map((trend, i) => (
                  <TrendCard key={i} trend={trend} index={i} />
                ))}
              </div>
              {hasMore && !trendsExpanded && (
                <button className="show-more-btn" onClick={() => setTrendsExpanded(true)}>
                  Show all {filtered.length} trends ↓
                </button>
              )}
              {trendsExpanded && hasMore && (
                <button className="show-more-btn" onClick={() => setTrendsExpanded(false)}>
                  Show less ↑
                </button>
              )}
            </section>
          </main>
        );
      })()}

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
                        <span className="sub-bar-num">{cat.hot_count}</span>
                      </div>
                      <div className="sub-bar-row">
                        <span>Warm</span>
                        <div className="sub-bar-track">
                          <div className="sub-bar-fill sub-warm" style={{ width: `${(cat.warm_count / cat.count) * 100}%` }} />
                        </div>
                        <span className="sub-bar-num">{cat.warm_count}</span>
                      </div>
                      <div className="sub-bar-row">
                        <span>Written</span>
                        <div className="sub-bar-track">
                          <div className="sub-bar-fill sub-written" style={{ width: `${(cat.written / cat.count) * 100}%` }} />
                        </div>
                        <span className="sub-bar-num">{cat.written}</span>
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
