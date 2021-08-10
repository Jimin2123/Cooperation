const privateKey = (process.env.VUE_APP_FIREBASE_ADMIN_PRIVATE_KEY || "")
  .split("\\n")
  .join("\n");

export const adminConfig = {
  type: process.env.VUE_APP_FIREBASE_ADMIN_TYPE,
  project_id: process.env.VUE_APP_FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.VUE_APP_FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.VUE_APP_FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.VUE_APP_FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.VUE_APP_FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.VUE_APP_FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.VUE_APP_FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.VUE_APP_FIREBASE_ADMIN_CLIENT_CERT_URL,
};

export const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBSE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_APP_ID,
};
