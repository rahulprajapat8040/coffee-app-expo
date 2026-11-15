export const logger = {
  log: (...args: unknown[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (__DEV__) {
      console.info(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (__DEV__) {
      console.error(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (__DEV__) {
      console.debug(...args);
    }
  },
};
