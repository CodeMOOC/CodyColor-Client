/*
 * Settings file that must be customized for deployment.
 * Copy custom file to settings.js and set correct values.
 */
angular.module('codyColor').factory("settings", function() {
    const settings = {
        rabbitUsername:   "",
        rabbitPassword:   "",
        rabbitVHost:      "",
        rabbitSocketUrl:  "wss://",
        webBaseUrl:       "https://",
        firebaseConfig: {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        }
    };

    return settings;
});
