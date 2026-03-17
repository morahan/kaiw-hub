import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Zap, Clock, Wifi, WifiOff, X, Send, MessageCircle } from 'lucide-react';
import './Hub.css';

const agents = [
  { id: 'marty', name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6', status: 'online',
    task: 'Heartbeat updated 4:21 PM — BTC exit signal, 6 Notion articles flagged', lastActive: 'Today 4:21 PM', health: 98,
    photo: 'https://ui-avatars.com/api/?name=Marty&background=3b82f6&color=fff&size=200' },
  { id: 'thea', name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6', status: 'online',
    task: 'Quality reviewer — 18 articles reviewed, shipped 13', lastActive: 'Today', health: 95,
    photo: 'https://cdn1.telesco.pe/file/Cp9hckgULYTLp8T7dIUC5ZPDc1THtQ-33C4CJOkxzkph3u5vYIWB6VBvbZeKKYMT_-XIVxsSGV8CJ1nuPbnOo_PwrynYs7ThbXE3izi2OhXF5F6ZGr6Pn1AAgHEaS5J8Qdyc2BTk8u2v6GpbmHsfnov0I_Ij_QyxAaYDGZONnyaGDAakoTtzQr5p7UdFIiGXc0YlFMUZ-V4refcBvfm4LL69rticry4bMiQ8yRQVEqRgNpmiUr5-Hc5kjcYTyQfMwgFoyIhhnMD2VayVeciLkAtotdbu5EgUOhJqLjOIoKQ7lv_RW_Tk3TuyCksaYzbgLKiNJYXHIBgXZgiG5eWoqg.jpg' },
  { id: 'renzo', name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444', status: 'busy',
    task: '8 articles in workspace — Zone 2, Protein Timing, VO2 Max, Sleep Tracking…', lastActive: 'Today', health: 87,
    photo: 'https://cdn1.telesco.pe/file/mYc0oUC2IAkKZUmsvuMzEJ6FRXxTMYEPa93ia71jsYHPQK4rlDz-9fLOwFVeJfTs0UiywxOOoOShBtDkr4LsZcXGJ1GNxhjtV8Una3BYwXc9RChHJsWfW5xUyDgn1vXEpasPyYKAOISl49MlnOzhZfJxnJl0yRoN93pQLG4gWTlocZCpaxoPMlAouwyul9d5lbKvJwgN2WN-XjQGw_I-EldN7YVxMW4bHQrPetXUKpl38r1yk-ytOoSBJHPXri0r6n--Rva4ThLm3EdDpwk9l4LVNk_3P6gECINh7WTj7OGVas9Q6H-UkrPYOv5ywOpybRicov7jP777Q7__w7SSfA.jpg' },
  { id: 'rocio', name: 'Rocío', emoji: '🎨', role: 'Visual Expert', color: '#f43f5e', status: 'online',
    task: 'Video editing, color grading, UI feedback — thumbnail optimization active', lastActive: 'Today', health: 94,
    photo: '' },
  { id: 'kaia', name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4', status: 'online',
    task: '800 fitness trends tracked — Creatine brain health trending 97%', lastActive: 'Today', health: 100,
    photo: 'https://cdn1.telesco.pe/file/MxPx-UmLLv0ikVGR3diaQOYfSXlhG32VwHGHS5DHPP9jebqN5nHQBIwArjuLg-JnI-HYisDShEzTYR5nqY98z43svWRJZMl_dsPs94_kJq8n8QAy9LTqzM8zekiLNtzrYTSjHv_8JnGoEyp4bNwLuR2f7erd8WFbIJe3wV2A_hjG8i_QRzOGIy9V6S3J8-630sHyDNQApW04Izw43eSVS4QhfHpOntYQsbnAeogloyvZ2K-H2vSvmUtuj_C6Q7sBc9lUmcRKTnKmLjrPHhP2B_1C8vTvm6mzhvf-eNhOmHFVjGSlKgCfKJCqnvsULz_alD0OvT2qL_DNxdClgpL3tA.jpg' },
  { id: 'badger', name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e', status: 'online',
    task: 'Voice router running — 9,974 workspace files tracked — 0 unfinished WIP', lastActive: 'Today', health: 92,
    photo: 'https://cdn1.telesco.pe/file/pgnzk-gFHkjedwx_fZHmJ1uglh_gAjDkfIwd-sOh4LhEX60CeAwH3C1XlisPBW-ZhNYDLRce-1MoSZA3GhxFonUMnNgo-xhkQCXE1RJZrL6VnB01JRpR_UV5jL78OLWwejCWx_-OGWhvoDf1d7Uf7ETiV0kJiVTtOEOqxBwZkYCfIVpA3h22HszsGV9dKi5FwMJtIgy_iuk6-dyicoUqVgM0V0n5HyLaMagAlT8JFw5qmII76qNIt75vfq8HbGJn5I015XrGnvHSgEJV8B7-7QeOvGxTqrhcs59UJGMF7rZULW9ljFZCXov2STCO1Ndi7sQa0exLRx9DrhXLSyyCFg.jpg' },
  { id: 'greta', name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b', status: 'online',
    task: 'Agent org brain — health reports, state metrics, file embeddings', lastActive: 'Today', health: 96,
    photo: 'https://cdn1.telesco.pe/file/a-yQiY5OnMt_Mfr8BZ_qUttI-ez7jVD-zwbnLEzX0g3yOW5JISPVeQ_-3BCl6jvr-INH57-UGWuTojcqRstloKVBd8-jiaOsdzVXutdzlL9urc0xFwR2wn6qMzVVHTQMQQaDlv-hd5ybbOR5dqh-x0vsoshc0XDKRA8BlSzuaPop6O6nfu1YoZN8u5b3zrWx8s_qZTvy7Qcc3F_rIKYsyopMWUl6x1cqh7Ab8_3XUp4F3_jyU0EdjxPAx4BB4rY4pHxDwT-RUM0pp_PvnnjE9DWMe_33ysSC7ol8SyQqvQK3pcmZjjlv8hs1giaDBhmfnqMV7bPmykQASUWxWtYdNg.jpg' },
  { id: 'freq', name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899', status: 'offline',
    task: 'Fish Speech TTS pipeline — voice cloning, reference health DB active', lastActive: 'Today', health: 100,
    photo: 'https://cdn1.telesco.pe/file/OdMnzkPBx55aq3BRS8-LPr_XKTVfxESNKcvP4u_YuEKTKXFvU3KjLyW7s_MKvS0auHt9HQOObjWxyoc9npQDybom543mVMwDEnTBZHoc2vo2-xnBhNayIqX9nXqa0qBb5p_Sn9LGHABko6GF117MmOtxGXLVHBEpC2xJF5VfYJiIjzNx6vetvDLKncxaYx9o3Xc2ScDhUXWhYlk31St4scIB0GoO9soofNe_Tfwk683daxFVf3oWARlsfuyXXItwEaLt0SkjzNltsItfFivQ5yUigvptqHrIPKvVuEVplRPP3yyOhhaKuBB3Qh7R5_hiU_20NfmVnvYF5Qcuqgwohw.jpg' },
  { id: 'quanta', name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6', status: 'online',
    task: '4,620 sessions tracked — 15 agents — analytics DB live', lastActive: 'Today', health: 91,
    photo: 'https://cdn1.telesco.pe/file/dWYC0oxhfBcIbwf2ai-KGT3n1DCm9MhgSMW1588z9o8IlzdzKN4WKxdSZnO0OYF93ylS5_7bqfaiBiOT0r3qoWDQJU7xQXVYaA78IbGZDeZ7lNIPVT2sZjLzuu2v4CRPCwHWLqEDZuh2bKkKZ1CDea2BIOvexvynYlgtHI_yOjZGjgHMubqnAMCZfDKqmWQGnl_D4TDF2ZA8nU8g7t-_Gp-t60t3hWOR7pz2LrBkQp7D0kTZ61_U6IiKjmoyMc88URdB69oHdRYw9M9XRvYJ4sbryRHE4Asw_TxsQague6CxkCuCh1m3H23Y1b2K-9zB32ywzQckEJpG9-a79C_OGw.jpg' },
  { id: 'maverick', name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316', status: 'busy',
    task: 'Queue scheduler — 4 tasks active, 1 waiting — 128GB VRAM managed', lastActive: 'Today', health: 84,
    photo: 'https://cdn1.telesco.pe/file/oAn6cB8a4zvUv4wbH38mFXkuR-mlPeJT9efNQ51dOyJ4-x6xaH-_ERDFLEiTYPLB-qlesSO9WL0pgAoABgzXnjS-D4lKEBBcVPHx7flbz9WO6thtAy3ghcjJlkrdwiZ6x-eafs6Tmmshpi5jUnb11gvRlprL95Lxdv0IVcTfDTqpS4JrIlce2j5ABQKhEIF1qoU_4E7EYihI8OiI-CWfUn6m9J28VONCqMz1BXQs-4L-TfVn3HiXsGnegK4bWK7fRdYyXZmPI-TCM4U0So2iEM1xImX4ckW0vxKyh1oXsQ3rGRECnX6Ldtk19V9K1XvOxtSCdowzlKvO507HZQiBzw.jpg' },
  { id: 'reno', name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981', status: 'online',
    task: '4 open paper trades (BMNR×2, POET, TSLA) — BTC closed +1.6% today', lastActive: 'Today 4:30 PM', health: 97,
    photo: 'https://cdn1.telesco.pe/file/JRuf7fKwL4NQOZj0_FESui7sxz0WVCygbYRZW6AxFy63tc5rEa2jJSptpBhE9eSIuL3ZDQkdxHH5Fu55fgp6yMiyJwf0hPDNbrftBbjK0396SlM9L_hxulpW294KWEmFLC-ICtb30pR-4TAkjTWAN6uMmLsFKnSXR1njz2wp4k6QJS5G4naZEb7I2R702_oMzCCbMbFN7tyFXeGrrFXve1jpP-rl9XDpaHfT_H81RjfbosPIjr22HCffPQ1iFVxb0Sh7gojQIH9S5HyjnEaguC_tJ5NkgJs_oXspWaah4PFcw8Jw7Cvx5rPf6LblF3wFPj2PJyQoxYNjsxzyJuChzw.jpg' },
  { id: 'aria', name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7', status: 'online',
    task: "52 sessions on Mar 16 — Oura: sleep 8.3h, HRV 34, 4,302 steps", lastActive: 'Today', health: 99,
    photo: 'https://cdn1.telesco.pe/file/vYQ6K_dTy3YAVuK__aU9avcE9gQcz3Bta160iRibDW3_nDqBAxljzxung9EicfvZAdr7TyncBc6dOV_GskUm_ngnezSzLsjVO4a9Ba6Z72gHQxJtH_r_19s3S7OChHdMZKu1Hrv_7mHHbmJLzjh7XDlJ2GqXSGjopjFK_TJtxb1-XVS5eNRqhrsR7DuKvGoDZ4m3Tjxard-YN68VBiLsXQ4TZ9UZMJBo0KhpsXdYviSBhrU4erY0WLyVxlKvVNPfoA6ythEx7YEfGuWps6Ae6u0fRpYIsijN17MzOyE7EWAsJhiS77lW8azLYXG_cnlH3BHgyfraOzSu23VPw2t0EQ.jpg' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1', status: 'online',
    task: 'Workout Flow companion — beta mode, voice + form feedback ready', lastActive: 'Today', health: 100,
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
];

const onlineCount = agents.filter(a => a.status === 'online').length;
const busyCount = agents.filter(a => a.status === 'busy').length;
const offlineCount = agents.filter(a => a.status === 'offline').length;

// Real activity feed — Mar 16, 2026
const activityFeed = [
  { agent: 'Reno', action: 'closed BTC-USD long +1.6% — BB_20_2.0 exit signal fired', time: '4:30 PM', color: '#10b981' },
  { agent: 'Marty', action: 'fixed entry-signal-scanner.py schema mismatch (active_positions → trades)', time: '4:15 PM', color: '#3b82f6' },
  { agent: 'Kaia', action: 'tracking 800 fitness trends — Creatine brain health at 97% momentum', time: 'Today', color: '#06b6d4' },
  { agent: 'Quanta', action: '4,620 sessions ingested across 15 agents — analytics DB current', time: 'Today', color: '#14b8a6' },
  { agent: 'Reno', action: 'PER-171 complete — backtest dedup module built, 172 records, 0 duplicates', time: '6:19 PM', color: '#10b981' },
  { agent: 'Marty', action: 'drafted creatine brain health X thread for 6 PM posting', time: '4:21 PM', color: '#3b82f6' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const feedVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.3 },
  }),
};

function HealthBar({ value, color }) {
  return (
    <div className="health-bar">
      <div
        className="health-bar-fill"
        style={{
          width: `${value}%`,
          background: value > 90 ? '#22c55e' : value > 70 ? '#f59e0b' : '#ef4444',
        }}
      />
    </div>
  );
}

function Hub() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState({});

  return (
    <div className="hub">
      {/* Compact header */}
      <header className="hub-header">
        <div className="hub-header-row">
          <div className="hub-header-left">
            <h1>⚡ kaiw.io</h1>
            <span className="hub-tagline">Agent Command Center</span>
          </div>
          <div className="hub-header-right">
            <div className="hub-system-status">
              <span className="system-dot" />
              <span>All Systems Online</span>
            </div>
            <div className="hub-header-stats">
              <div className="hub-stat-pill online">
                <Wifi size={13} />
                <span>{onlineCount} online</span>
              </div>
              <div className="hub-stat-pill busy">
                <Zap size={13} />
                <span>{busyCount} busy</span>
              </div>
              <div className="hub-stat-pill offline">
                <WifiOff size={13} />
                <span>{offlineCount} offline</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* System status bar */}
      <motion.div
        className="system-status-bar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="status-bar-left">
          <Activity size={14} className="status-bar-icon pulse-icon" />
          <span className="status-bar-label">Live Activity</span>
        </div>
        <div className="activity-feed-ticker">
          {activityFeed.map((item, i) => (
            <motion.div
              key={i}
              className="feed-item"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={feedVariants}
            >
              <span className="feed-dot" style={{ background: item.color }} />
              <span className="feed-agent" style={{ color: item.color }}>{item.agent}</span>
              <span className="feed-action">{item.action}</span>
              <span className="feed-time">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Agent grid */}
      <div className="agents-grid">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link
              to={`/${agent.id}`}
              className="agent-card"
              style={{ '--agent-color': agent.color }}
            >
              <span className="agent-emoji-badge">{agent.emoji}</span>

              <div className="agent-avatar-wrap">
                <div className="agent-avatar">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="agent-emoji-fallback" style={{ display: 'none' }}>
                    {agent.emoji}
                  </div>
                </div>
                <span className={`agent-status ${agent.status}`} title={agent.status} />
              </div>

              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">
                <span className="agent-role-color">{agent.role}</span>
              </div>

              <div className="agent-task">{agent.task}</div>

              <div className="agent-meta">
                <div className="agent-health-wrap">
                  <Cpu size={11} />
                  <HealthBar value={agent.health} />
                  <span className="agent-health-val">{agent.health}%</span>
                </div>
                <div className="agent-last-active">
                  <Clock size={11} />
                  <span>{agent.lastActive}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Floating Chat Bubbles (FABs) */}
      <div className="chat-fabs">
        {agents.map((agent) => (
          <motion.button
            key={agent.id}
            className="chat-fab"
            style={{ '--agent-color': agent.color }}
            onClick={() => setSelectedAgent(agent)}
            whileHover={{ scale: 1.15, x: -8 }}
            whileTap={{ scale: 0.95 }}
            title={`Chat with ${agent.name}`}
          >
            <span className="fab-emoji">{agent.emoji}</span>
            <span className="fab-tooltip">{agent.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            className="chat-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              className="chat-modal"
              style={{ '--agent-color': selectedAgent.color }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="chat-modal-header">
                <div className="chat-agent-info">
                  <span className="chat-agent-emoji">{selectedAgent.emoji}</span>
                  <span className="chat-agent-name">{selectedAgent.name}</span>
                </div>
                <button className="chat-close-btn" onClick={() => setSelectedAgent(null)}>
                  <X size={18} />
                </button>
              </div>
              
              <div className="chat-messages">
                {chatMessages[selectedAgent.id]?.length === 0 && (
                  <div className="chat-empty">
                    <MessageCircle size={32} strokeWidth={1.5} />
                    <p>Start a conversation with {selectedAgent.name}</p>
                    <span className="chat-hint">They'll respond when available</span>
                  </div>
                )}
                {chatMessages[selectedAgent.id]?.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.from === 'me' ? 'from-me' : 'from-agent'}`}>
                    <span className="msg-emoji">{msg.from === 'me' ? '👤' : selectedAgent.emoji}</span>
                    <div className="msg-content">{msg.text}</div>
                  </div>
                ))}
              </div>
              
              <form className="chat-input-form" onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message;
                if (input.value.trim()) {
                  setChatMessages(prev => ({
                    ...prev,
                    [selectedAgent.id]: [
                      ...(prev[selectedAgent.id] || []),
                      { from: 'me', text: input.value }
                    ]
                  }));
                  input.value = '';
                }
              }}>
                <input
                  type="text"
                  name="message"
                  placeholder={`Message ${selectedAgent.name}...`}
                  autoComplete="off"
                />
                <button type="submit">
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Hub;
