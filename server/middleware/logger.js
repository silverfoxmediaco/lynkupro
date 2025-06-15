import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom morgan token for error logs
morgan.token('error-message', (req, res) => {
  return res.locals.errorMessage || '';
});

// Development logging
export const devLogger = morgan('dev');

// Production logging
export const prodLogger = morgan('combined', { stream: accessLogStream });

// Error logging
export const errorLogger = morgan(
  ':date[iso] :method :url :status :response-time ms - :error-message',
  {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400
  }
);