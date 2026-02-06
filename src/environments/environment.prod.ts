export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCJoAvdMagPFHTG--zurc3RjBekWLJzvxo',
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
    // socketUrl: 'wss://codycolor.codemooc.net/api/ws',
    socketUrl: 'wss://codycolor-beta.codemooc.net/api/ws',
    // socketUrl: 'ws://localhost:15674/ws',
  },
  webBaseUrl: 'https://codycolor-beta.codemooc.net',
};
