/**
 * Production environment — all secrets are loaded at runtime from
 * window.__RUNTIME_CONFIG__, which is injected by entrypoint.sh
 * at container startup.
 *
 * - Firebase config is read from /firebase-config.json (mounted as a volume)
 * - RabbitMQ credentials, socket URL, and web base URL come from
 *   environment variables
 *
 * This file contains NO secrets — it is safe to track in version control.
 * See entrypoint.sh and index.html for the injection mechanism.
 */

function getRuntimeConfig(): {
  firebaseConfig: Record<string, string>;
  rabbit: { username: string; password: string; vHost: string; socketUrl: string };
  webBaseUrl: string;
} {
  const cfg = (window as any).__RUNTIME_CONFIG__;
  if (!cfg) {
    throw new Error(
      'Runtime config not found. Ensure runtime-config.js is loaded in index.html.'
    );
  }
  return cfg;
}

const runtimeConfig = getRuntimeConfig();

export const environment = {
  production: true,
  firebaseConfig: runtimeConfig.firebaseConfig,
  rabbit: {
    username: runtimeConfig.rabbit.username,
    password: runtimeConfig.rabbit.password,
    vHost: runtimeConfig.rabbit.vHost,
    socketUrl: runtimeConfig.rabbit.socketUrl,
  },
  webBaseUrl: runtimeConfig.webBaseUrl,
};
