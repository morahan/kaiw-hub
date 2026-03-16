import { Link } from 'react-router-dom';
import './Hub.css';

const agents = [
  { id: 'marty', name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/Cp9hckgULYTLp8T7dIUC5ZPDc1THtQ-33C4CJOkxzkph3u5vYIWB6VBvbZeKKYMT_-XIVxsSGV8CJ1nuPbnOo_PwrynYs7ThbXE3izi2OhXF5F6ZGr6Pn1AAgHEaS5J8Qdyc2BTk8u2v6GpbmHsfnov0I_Ij_QyxAaYDGZONnyaGDAakoTtzQr5p7UdFIiGXc0YlFMUZ-V4refcBvfm4LL69rticry4bMiQ8yRQVEqRgNpmiUr5-Hc5kjcYTyQfMwgFoyIhhnMD2VayVeciLkAtotdbu5EgUOhJqLjOIoKQ7lv_RW_Tk3TuyCksaYzbgLKiNJYXHIBgXZgiG5eWoqg.jpg' },
  { id: 'thea', name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/Cp9hckgULYTLp8T7dIUC5ZPDc1THtQ-33C4CJOkxzkph3u5vYIWB6VBvbZeKKYMT_-XIVxsSGV8CJ1nuPbnOo_PwrynYs7ThbXE3izi2OhXF5F6ZGr6Pn1AAgHEaS5J8Qdyc2BTk8u2v6GpbmHsfnov0I_Ij_QyxAaYDGZONnyaGDAakoTtzQr5p7UdFIiGXc0YlFMUZ-V4refcBvfm4LL69rticry4bMiQ8yRQVEqRgNpmiUr5-Hc5kjcYTyQfMwgFoyIhhnMD2VayVeciLkAtotdbu5EgUOhJqLjOIoKQ7lv_RW_Tk3TuyCksaYzbgLKiNJYXHIBgXZgiG5eWoqg.jpg' },
  { id: 'renzo', name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444', status: 'busy',
    photo: 'https://cdn1.telesco.pe/file/mYc0oUC2IAkKZUmsvuMzEJ6FRXxTMYEPa93ia71jsYHPQK4rlDz-9fLOwFVeJfTs0UiywxOOoOShBtDkr4LsZcXGJ1GNxhjtV8Una3BYwXc9RChHJsWfW5xUyDgn1vXEpasPyYKAOISl49MlnOzhZfJxnJl0yRoN93pQLG4gWTlocZCpaxoPMlAouwyul9d5lbKvJwgN2WN-XjQGw_I-EldN7YVxMW4bHQrPetXUKpl38r1yk-ytOoSBJHPXri0r6n--Rva4ThLm3EdDpwk9l4LVNk_3P6gECINh7WTj7OGVas9Q6H-UkrPYOv5ywOpybRicov7jP777Q7__w7SSfA.jpg' },
  { id: 'kaia', name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/MxPx-UmLLv0ikVGR3diaQOYfSXlhG32VwHGHS5DHPP9jebqN5nHQBIwArjuLg-JnI-HYisDShEzTYR5nqY98z43svWRJZMl_dsPs94_kJq8n8QAy9LTqzM8zekiLNtzrYTSjHv_8JnGoEyp4bNwLuR2f7erd8WFbIJe3wV2A_hjG8i_QRzOGIy9V6S3J8-630sHyDNQApW04Izw43eSVS4QhfHpOntYQsbnAeogloyvZ2K-H2vSvmUtuj_C6Q7sBc9lUmcRKTnKmLjrPHhP2B_1C8vTvm6mzhvf-eNhOmHFVjGSlKgCfKJCqnvsULz_alD0OvT2qL_DNxdClgpL3tA.jpg' },
  { id: 'badger', name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/pgnzk-gFHkjedwx_fZHmJ1uglh_gAjDkfIwd-sOh4LhEX60CeAwH3C1XlisPBW-ZhNYDLRce-1MoSZA3GhxFonUMnNgo-xhkQCXE1RJZrL6VnB01JRpR_UV5jL78OLWwejCWx_-OGWhvoDf1d7Uf7ETiV0kJiVTtOEOqxBwZkYCfIVpA3h22HszsGV9dKi5FwMJtIgy_iuk6-dyicoUqVgM0V0n5HyLaMagAlT8JFw5qmII76qNIt75vfq8HbGJn5I015XrGnvHSgEJV8B7-7QeOvGxTqrhcs59UJGMF7rZULW9ljFZCXov2STCO1Ndi7sQa0exLRx9DrhXLSyyCFg.jpg' },
  { id: 'greta', name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/a-yQiY5OnMt_Mfr8BZ_qUttI-ez7jVD-zwbnLEzX0g3yOW5JISPVeQ_-3BCl6jvr-INH57-UGWuTojcqRstloKVBd8-jiaOsdzVXutdzlL9urc0xFwR2wn6qMzVVHTQMQQaDlv-hd5ybbOR5dqh-x0vsoshc0XDKRA8BlSzuaPop6O6nfu1YoZN8u5b3zrWx8s_qZTvy7Qcc3F_rIKYsyopMWUl6x1cqh7Ab8_3XUp4F3_jyU0EdjxPAx4BB4rY4pHxDwT-RUM0pp_PvnnjE9DWMe_33ysSC7ol8SyQqvQK3pcmZjjlv8hs1giaDBhmfnqMV7bPmykQASUWxWtYdNg.jpg' },
  { id: 'freq', name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899', status: 'offline',
    photo: 'https://cdn1.telesco.pe/file/OdMnzkPBx55aq3BRS8-LPr_XKTVfxESNKcvP4u_YuEKTKXFvU3KjLyW7s_MKvS0auHt9HQOObjWxyoc9npQDybom543mVMwDEnTBZHoc2vo2-xnBhNayIqX9nXqa0qBb5p_Sn9LGHABko6GF117MmOtxGXLVHBEpC2xJF5VfYJiIjzNx6vetvDLKncxaYx9o3Xc2ScDhUXWhYlk31St4scIB0GoO9soofNe_Tfwk683daxFVf3oWARlsfuyXXItwEaLt0SkjzNltsItfFivQ5yUigvptqHrIPKvVuEVplRPP3yyOhhaKuBB3Qh7R5_hiU_20NfmVnvYF5Qcuqgwohw.jpg' },
  { id: 'quanta', name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/dWYC0oxhfBcIbwf2ai-KGT3n1DCm9MhgSMW1588z9o8IlzdzKN4WKxdSZnO0OYF93ylS5_7bqfaiBiOT0r3qoWDQJU7xQXVYaA78IbGZDeZ7lNIPVT2sZjLzuu2v4CRPCwHWLqEDZuh2bKkKZ1CDea2BIOvexvynYlgtHI_yOjZGjgHMubqnAMCZfDKqmWQGnl_D4TDF2ZA8nU8g7t-_Gp-t60t3hWOR7pz2LrBkQp7D0kTZ61_U6IiKjmoyMc88URdB69oHdRYw9M9XRvYJ4sbryRHE4Asw_TxsQague6CxkCuCh1m3H23Y1b2K-9zB32ywzQckEJpG9-a79C_OGw.jpg' },
  { id: 'maverick', name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316', status: 'busy',
    photo: 'https://cdn1.telesco.pe/file/oAn6cB8a4zvUv4wbH38mFXkuR-mlPeJT9efNQ51dOyJ4-x6xaH-_ERDFLEiTYPLB-qlesSO9WL0pgAoABgzXnjS-D4lKEBBcVPHx7flbz9WO6thtAy3ghcjJlkrdwiZ6x-eafs6Tmmshpi5jUnb11gvRlprL95Lxdv0IVcTfDTqpS4JrIlce2j5ABQKhEIF1qoU_4E7EYihI8OiI-CWfUn6m9J28VONCqMz1BXQs-4L-TfVn3HiXsGnegK4bWK7fRdYyXZmPI-TCM4U0So2iEM1xImX4ckW0vxKyh1oXsQ3rGRECnX6Ldtk19V9K1XvOxtSCdowzlKvO507HZQiBzw.jpg' },
  { id: 'reno', name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/JRuf7fKwL4NQOZj0_FESui7sxz0WVCygbYRZW6AxFy63tc5rEa2jJSptpBhE9eSIuL3ZDQkdxHH5Fu55fgp6yMiyJwf0hPDNbrftBbjK0396SlM9L_hxulpW294KWEmFLC-ICtb30pR-4TAkjTWAN6uMmLsFKnSXR1njz2wp4k6QJS5G4naZEb7I2R702_oMzCCbMbFN7tyFXeGrrFXve1jpP-rl9XDpaHfT_H81RjfbosPIjr22HCffPQ1iFVxb0Sh7gojQIH9S5HyjnEaguC_tJ5NkgJs_oXspWaah4PFcw8Jw7Cvx5rPf6LblF3wFPj2PJyQoxYNjsxzyJuChzw.jpg' },
  { id: 'aria', name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7', status: 'online',
    photo: 'https://cdn1.telesco.pe/file/vYQ6K_dTy3YAVuK__aU9avcE9gQcz3Bta160iRibDW3_nDqBAxljzxung9EicfvZAdr7TyncBc6dOV_GskUm_ngnezSzLsjVO4a9Ba6Z72gHQxJtH_r_19s3S7OChHdMZKu1Hrv_7mHHbmJLzjh7XDlJ2GqXSGjopjFK_TJtxb1-XVS5eNRqhrsR7DuKvGoDZ4m3Tjxard-YN68VBiLsXQ4TZ9UZMJBo0KhpsXdYviSBhrU4erY0WLyVxlKvVNPfoA6ythEx7YEfGuWps6Ae6u0fRpYIsijN17MzOyE7EWAsJhiS77lW8azLYXG_cnlH3BHgyfraOzSu23VPw2t0EQ.jpg' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1', status: 'offline',
    photo: 'https://cdn1.telesco.pe/file/JRuf7fKwL4NQOZj0_FESui7sxz0WVCygbYRZW6AxFy63tc5rEa2jJSptpBhE9eSIuL3ZDQkdxHH5Fu55fgp6yMiyJwf0hPDNbrftBbjK0396SlM9L_hxulpW294KWEmFLC-ICtb30pR-4TAkjTWAN6uMmLsFKnSXR1njz2wp4k6QJS5G4naZEb7I2R702_oMzCCbMbFN7tyFXeGrrFXve1jpP-rl9XDpaHfT_H81RjfbosPIjr22HCffPQ1iFVxb0Sh7gojQIH9S5HyjnEaguC_tJ5NkgJs_oXspWaah4PFcw8Jw7Cvx5rPf6LblF3wFPj2PJyQoxYNjsxzyJuChzw.jpg' },
];

const onlineCount = agents.filter(a => a.status === 'online').length;
const busyCount = agents.filter(a => a.status === 'busy').length;

function Hub() {
  return (
    <div className="hub">
      <header className="hub-header">
        <h1>⚡ kaiw.io</h1>
        <p className="hub-tagline">Agent Command Center</p>
        <div className="hub-stats">
          <span className="hub-stat">
            <span className="hub-stat-dot" />
            {onlineCount} online
          </span>
          <span className="hub-stat" style={{ color: '#6b7280' }}>·</span>
          <span className="hub-stat">{busyCount} busy</span>
          <span className="hub-stat" style={{ color: '#6b7280' }}>·</span>
          <span className="hub-stat">{agents.length} agents total</span>
        </div>
      </header>

      <div className="hub-section-label">
        <span>Active Team</span>
      </div>

      <div className="agents-grid">
        {agents.map(agent => (
          <Link
            key={agent.id}
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hub;
