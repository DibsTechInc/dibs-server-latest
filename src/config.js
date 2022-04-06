if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

export const JWT_API = {
    secret: 'SECRET-KEY',
    timeout: '1 days'
};

export const FIREBASE_API = {
    // apiKey: 'AIzaSyBernKzdSojh_vWXBHt0aRhf5SC9VLChbM',
    // authDomain: 'berry-material-react.firebaseapp.com',
    // projectId: 'berry-material-react',
    // storageBucket: 'berry-material-react.appspot.com',
    // messagingSenderId: '901111229354',
    // appId: '1:901111229354:web:a5ae5aa95486297d69d9d3',
    // measurementId: 'G-MGJHSL8XW3'
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBAS_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBAS_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBAS_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBAS_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const AUTH0_API = {
    client_id: '7T4IlWis4DKHSbG8JAye4Ipk0rvXkH9V',
    domain: 'dev-w0-vxep3.us.auth0.com'
};

export const AWS_API = {
    poolId: 'us-east-1_AOfOTXLvD',
    appClientId: '3eau2osduslvb7vks3vsh9t7b0'
};

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard';

const config = {
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 4,
    outlinedFilled: true,
    navType: 'light', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: false
};

export default config;
