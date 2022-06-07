declare global {
  namespace Express {
    interface User {userId: string, name: string, email: string, roleId: string}
  }
}

export let TEACHER_ROLE_ID = '1';
export let STUDENT_ROLE_ID = '2';

/**
 * Session Configurations
 */
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || '',
  resave: (process.env.SESSION_RESAVE === 'true'), 
  saveUninitialized: (process.env.SESSION_SAVEUNINITIALIZED === 'true'),
  cookie: {secure: (process.env.SESSION_COOKIE_SECURE === 'true')}
}

/**
 * Passport configuration for Microsoft
 */
export const microsoftPassportConfig = {
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: process.env.MICROSOFT_CALL_BACK_URL,
  scope: [process.env.MICROSOFT_SCOPE]
}