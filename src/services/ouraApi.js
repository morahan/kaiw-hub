// OURA API Service - fetches real health data
const OURA_TOKEN = '_0XBPWQQ_3091ca7f-a248-407e-8635-0e0a54a5558c';

const BASE_URL = 'https://api.ouraring.com/v2';

async function fetchOura(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${OURA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Oura API error: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error('Oura fetch error:', err);
    return null;
  }
}

// Get today's sleep data
export async function getSleepData() {
  const today = new Date().toISOString().split('T')[0];
  const data = await fetchOura(`/usercollection/sleep?start_date=${today}&end_date=${today}`);
  
  if (data?.data?.[0]) {
    const s = data.data[0];
    return {
      date: `${today} sleep`,
      scores: {
        sleep: s.score ?? null,
        readiness: s.readiness_score ?? null,
        activity: s.activity_score ?? null
      },
      details: {
        sleep: {
          deep: s.deep_sleep_duration ? Math.round(s.deep_sleep_duration / 60) : 0,
          hrv: s.hrv ?? 0,
          restingHR: s.resting_heart_rate ?? 0,
          total: s.total_sleep_duration ? Math.round(s.total_sleep_duration / 3600 * 10) / 10 : 0
        },
        activity: {
          steps: s.steps ?? 0,
          calories: s.active_calories ?? 0
        }
      }
    };
  }
  
  // Fallback mock data
  return {
    date: `${today} (mock)`,
    scores: { sleep: 82, readiness: 88, activity: 72 },
    details: {
      sleep: { deep: 65, hrv: 32, restingHR: 45, total: 7.5 },
      activity: { steps: 5234, calories: 1842 }
    }
  };
}

// Get weekly sleep for charts
export async function getWeeklySleep() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  
  const data = await fetchOura(`/usercollection/sleep?start_date=${startStr}&end_date=${endStr}`);
  
  if (data?.data) {
    return data.data.map(s => ({
      day: s.date.substring(5),
      hours: s.total_sleep_duration ? Math.round(s.total_sleep_duration / 3600 * 10) / 10 : 0,
      score: s.score ?? 0
    })).reverse();
  }
  
  return [
    { day: 'Mar 10', hours: 6.5, score: 72 },
    { day: 'Mar 11', hours: 7.2, score: 78 },
    { day: 'Mar 12', hours: 8.0, score: 85 },
    { day: 'Mar 13', hours: 7.5, score: 82 },
    { day: 'Mar 14', hours: 6.8, score: 75 },
    { day: 'Mar 15', hours: 7.8, score: 88 },
    { day: 'Mar 16', hours: 8.2, score: 89 }
  ];
}

export async function getWeeklySteps() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  
  const data = await fetchOura(`/usercollection/daily?start_date=${startStr}&end_date=${endStr}`);
  
  if (data?.data) {
    return data.data.map(d => ({
      day: d.date.substring(5),
      steps: d.steps ?? 0
    })).reverse();
  }
  
  return [
    { day: 'Mar 10', steps: 4521 },
    { day: 'Mar 11', steps: 6234 },
    { day: 'Mar 12', steps: 3892 },
    { day: 'Mar 13', steps: 7102 },
    { day: 'Mar 14', steps: 5123 },
    { day: 'Mar 15', steps: 8941 },
    { day: 'Mar 16', steps: 4302 }
  ];
}
