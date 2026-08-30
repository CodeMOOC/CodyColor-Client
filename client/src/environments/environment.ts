/**
 * Development environment — hardcoded local values for ng serve / ng build.
 *
 * This file is gitignored. Copy environmentTemplate.ts to create it:
 *   cp environmentTemplate.ts environment.ts
 *
 * In production, secrets are loaded at runtime from window.__RUNTIME_CONFIG__
 * (see environment.prod.ts, entrypoint.sh, and index.html).
 */
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '«reda...…»',
    authDomain: 'codycolor-f2519.firebaseapp.com',
    databaseURL: 'https://codycolor-f2519.firebaseio.com',
    projectId: 'codycolor-f2519',
    storageBucket: 'codycolor-f2519.appspot.com',
    messagingSenderId: '839718298178',
    appId: '1:839718298178:web:6e3b0cf34856eb12',
  },
  rabbit: {
    username: 'guest',
    password: 'guest',
    vHost: '/',
    socketUrl: 'ws://rabbit-1:15674/ws',
  },
  webBaseUrl: 'http://localhost:4200',
};
