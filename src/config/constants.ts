import * as dotenv from 'dotenv';
import { cleanEnv, str, num } from 'envalid';

dotenv.config();

export const config = cleanEnv(process.env, {
  DB_HOST: str({ default: 'localhost' }),
  DB_PORT: num({ default: 5434 }),
  DB_USER: str({ default: 'admin' }),
  DB_PASSWORD: str({ default: '123' }),
  DB_NAME: str({ default: 'nimble' }),
});
