/**
 * Template for environment files.
 *
 * In production, all secrets are loaded at runtime via window.__RUNTIME_CONFIG__
 * (see environment.prod.ts). In development, values are hardcoded for local use
 * and stored in a `environment.ts` file.
 *
 * Secrets breakdown:
 *   - Firebase config (apiKey, projectId, etc.): mounted as /firebase-config.json
 *     in production; hardcoded in environment.ts for development.
 *   - RabbitMQ credentials (username, password): environment variables
 *     RABBIT_USERNAME, RABBIT_PASSWORD in production; hardcoded in development.
 *   - RabbitMQ socket URL, vHost: environment variables RABBIT_SOCKET_URL,
 *     RABBIT_VHOST in production; hardcoded in development.
 *   - Web base URL: environment variable WEB_BASE_URL in production;
 *     hardcoded in development.
 */

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
  rabbit: {
    username: '',
    password: '',
    vHost: '',
    socketUrl: '',
  },
  webBaseUrl: '',
};
