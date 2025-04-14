import fs from 'fs';
import path from 'path';

const AUTH_DATA_DIR = path.join(process.cwd(), 'data', 'auth');
const AUTH_LOG_FILE = path.join(AUTH_DATA_DIR, 'auth_logs.json');

// Ensure directory exists
if (!fs.existsSync(AUTH_DATA_DIR)) {
  fs.mkdirSync(AUTH_DATA_DIR, { recursive: true });
}

// Initialize log file if it doesn't exist
if (!fs.existsSync(AUTH_LOG_FILE)) {
  fs.writeFileSync(AUTH_LOG_FILE, JSON.stringify({ logs: [] }));
}

export const logAuthOperation = async (operation) => {
  try {
    const data = JSON.parse(fs.readFileSync(AUTH_LOG_FILE, 'utf8'));
    const timestamp = new Date().toISOString();
    
    data.logs.push({
      timestamp,
      operation,
    });

    // Keep only last 1000 logs to prevent file from growing too large
    if (data.logs.length > 1000) {
      data.logs = data.logs.slice(-1000);
    }

    fs.writeFileSync(AUTH_LOG_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error logging auth operation:', error);
  }
};

export const getAuthLogs = () => {
  try {
    const data = JSON.parse(fs.readFileSync(AUTH_LOG_FILE, 'utf8'));
    return data.logs;
  } catch (error) {
    console.error('Error reading auth logs:', error);
    return [];
  }
}; 