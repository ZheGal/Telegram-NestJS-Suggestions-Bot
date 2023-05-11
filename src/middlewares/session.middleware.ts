import * as LocalSession from 'telegraf-session-local';
const sessions = new LocalSession({ database: 'session_database.json' });

export const sessionMiddleware = sessions.middleware();
