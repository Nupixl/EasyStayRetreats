/**
 * Enhanced debugging and logging utilities
 */

const DEBUG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

class DebugLogger {
  constructor(service = 'api') {
    this.service = service;
    this.level = process.env.DEBUG_LEVEL || 'INFO';
    this.correlationId = null;
  }

  setCorrelationId(id) {
    this.correlationId = id;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const correlation = this.correlationId ? `[${this.correlationId}]` : '';
    
    return {
      timestamp,
      level,
      service: this.service,
      correlation,
      message,
      meta: {
        ...meta,
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
  }

  log(level, message, meta = {}) {
    if (DEBUG_LEVELS[level] <= DEBUG_LEVELS[this.level]) {
      const formatted = this.formatMessage(level, message, meta);
      console.log(JSON.stringify(formatted));
    }
  }

  error(message, error = null, meta = {}) {
    this.log('ERROR', message, {
      ...meta,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null
    });
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  trace(message, meta = {}) {
    this.log('TRACE', message, meta);
  }
}

// Request tracing utilities
export const generateCorrelationId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const traceRequest = (req, res, next) => {
  const correlationId = generateCorrelationId();
  req.correlationId = correlationId;
  
  const logger = new DebugLogger('request');
  logger.setCorrelationId(correlationId);
  req.logger = logger;
  
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? '[REDACTED]' : undefined
    }
  });
  
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  if (next) next();
};

export default DebugLogger;
