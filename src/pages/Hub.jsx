import { Link } from 'react-router-dom';
import './Hub.css';

const agents = [
  { id: 'marty', name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6', 
    photo: 'https://cdn1.telesco.pe/file/7xNKlQJKPqY0uElE9lI3R8sKvp4JydFw2hZgNmL4sN9qRxPvZtL3KxPyqL8sYJzJ1QwJmLkPxL6qN9mZvK3sHwRmN2pJzPxQwPmN9lK4vLxR3QmN7pJzKwQvPmN6lK3wLxR8QmN5pJzKwPvPmN8lK4wLxR2QmN6pJzKwPvQmN7lK3xLxR4QmN8pJzKwQvPmN9lK4xLxR3.jpg' },
  { id: 'thea', name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6', 
    photo: 'https://cdn1.telesco.pe/file/K3PYEVvMKwXZ05vbIylQ2q8Z7xvrlfhydU8Q9fnp0Vi6sQDFfLrbnTvgAr59eGYCz5nkykNKlEqwh0xwyhDhWOVFAjO8XHVsJKo0NgmOH2SkfUewTG9gZFrwyshtTkgHwVHaVwdkZyOqTbUY7Cvai6FowhPOj1ruA6MNeDGgdGYYNLJV0jdqW6NEASypB0Uf7qzMbHphgf42i0jIcimPjEi0Gy7cq5DJGWTQBTNmN1Yc9EYVBHZD1fbM3gbfp0ZL6VYnxzpgLHfRPVhyztHv6FTHkQkHjkrci66ygo55bSQ6bzQpyyw_aUaBbOB1tBLVqKCiFz9nMxWO-5Ot8XGYag.jpg' },
  { id: 'renzo', name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444', 
    photo: 'https://cdn1.telesco.pe/file/OWy8eUGoX5kvJlyJ6GMwlP9_60TGCxDNiYRSA1Y15sLjXSOxgMVSswAKL1mdAzH8iY2U1KVxOrvh5IPvAv_xIQaLWolGn0b2sTrrhgaJ9_4DI7NT0zjM5hzL83mAGUVt_6s1OK1yVeZUjVtOc1Pg1ZSZVl2VtSgGddV60g6J615Y1nqKqlAwXh3lA_vKdgpH62CRpmeEebD4lQP79USdj_d6JwPud5naagQcal68UNIYrm0nLHV3jCZcvk26Mm3w6f7Mmv18Kd766BHVQP_xlPZel1mx9nTI_xVpAEt-AW16dBnSlYHthc8CzbJDj76w5Kk8vWfECH0fbT1yLsAF3A.jpg' },
  { id: 'kaia', name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4', 
    photo: 'https://cdn1.telesco.pe/file/VzQZNi0IDS42EHXdn43Yl9TRo8LylErVvybDnvlzcq6wKsutINrKmifgpfXwutI4jP2V6LfF-DmcF6ets8hCEqKuT5ef3t_3FKxCeRFP88tDZS9RzWO8BBqACITood4DPP48izqXwo9HkrIei855x2kP_jACfGlcefrJGUYBxyneIbnaX1e5zfd1CqLv0PsG5tSjG5v4EWYmiRXAzoy9EEYn1T0RXSuL12BtOmrz2ZT583XiRK_srlHw47j7P0BZSfmNy24SeESodE4Ul4tooTHUKK0ghlVbLErX9mUkaZt9DNSD_z4PBzjhVvg-CqBlCMaIHE_ZjoM89X30qJ0WAw.jpg' },
  { id: 'badger', name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e', 
    photo: 'https://cdn1.telesco.pe/file/WfXYidbBWc76Mh9E0i0sGuel99aMghf5a1IcUVYQ34qctGQE_YYfPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2QmN7pJzKwPvQmN8lK3xLxR3QmN6pJzKwQvPmN7lK4wLxR4.jpg' },
  { id: 'greta', name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b', 
    photo: 'https://cdn1.telesco.pe/file/Af2vEVXPu15NXF66WaamEwlmOloG6zZagMPiDp9qd0zg0mdW_2fPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2QmN7pJzKwPvQmN8lK3xLxR3.jpg' },
  { id: 'freq', name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899', 
    photo: 'https://cdn1.telesco.pe/file/dWFAUPdURFIRoH0GR_mOqRU8FClbheev6_oh-6Osx12CcyQQHhFPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2QmN7pJzKwPvQmN8lK3xLxR3.jpg' },
  { id: 'quanta', name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6', 
    photo: 'https://cdn1.telesco.pe/file/jVwflRj8YCnxTBtItwSYjkhZyWCxOfHS5owRUQ6XTf42-hEr0RDPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2.jpg' },
  { id: 'maverick', name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316', 
    photo: 'https://cdn1.telesco.pe/file/BE5oNkN2SsY_p51yYGBTIaazvOOxWwLP49TJ25GYDjhwnJqxHvpPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2.jpg' },
  { id: 'reno', name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981', 
    photo: 'https://cdn1.telesco.pe/file/Mmpev52IgnCOfm-lJBli7BuoEsM5OD6_QqQTXo9emadMl_0Ia4IPPl7bK2vK3nLxR8QmN5pJzKwPvPmN9lK4xLxR2.jpg' },
  { id: 'aria', name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7', 
    photo: 'https://cdn1.telesco.pe/file/dU7nrlg29MyC98yoGsWQKQLV32sbpROGYUKKFAGfpNEz4J7GzL3225b8Twv5U3LSUsKOlLbq8FUJ8_3HMIJtyHpQcja_ods6QqbDl9Lcd3ocEFYS7nF5WStmDi6ei5-9XJcNkFUdogxs6Gj3JstHpcZsSJNOC4lrLca9EBAwQknZtHAGQlkjzcwrl1-ua3AW1q3QgPo9G0gDxA0_ZK786ENCF1lN-9kbtA5DZkqYKuWAw4nboiuQDd3O7TVqwXlDnovSzX1OMxRV4f4r9OEIayhA2-a8oAAanZnIEq4OcIxftOW9PMejn8uxEWAf7o-T_gpiN6FeWz9mlcYKyqDSig.jpg' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1', 
    photo: 'https://telegram.org/img/t_logo_2x.png' },
];

function Hub() {
  return (
    <div className="hub">
      <header className="hub-header">
        <h1>⚡ kaiw.io</h1>
        <p>Agent Dashboard Hub</p>
      </header>

      <div className="agents-grid">
        {agents.map(agent => (
          <Link key={agent.id} to={`/${agent.id}`} className="agent-card" style={{ '--agent-color': agent.color }}>
            <div className="agent-avatar">
              <img 
                src={agent.photo} 
                alt={agent.name}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className="agent-emoji-fallback" style={{ display: 'none' }}>{agent.emoji}</div>
            </div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hub;
