import axios from 'axios';

type Env = 'dev' | 'stage';

const LOGIN_URLS: Record<Env, string> = {
  dev: 'https://api-dev.suite-e.com/api/v1/user-service/platform-user/login',
  stage: 'https://stage-api-v2.suite-e.com/api/v1/user-service/platform-user/login',
};

const LOGIN_CREDENTIALS = {
  email: 'admin@suite-e.com',
  password: 'asdfasdf',
};

export class TokenManager {
  private tokens: Partial<Record<Env, string>> = {};

  private getEnvFromUrl(url: string): Env | undefined {
    if (url.includes('api-dev.suite-e.com')) return 'dev';
    if (url.includes('stage-api-v2.suite-e.com')) return 'stage';
    return undefined;
  }

  async getToken(baseUrl: string, credentials?: { email: string; password: string }): Promise<string | undefined> {
    const env = this.getEnvFromUrl(baseUrl);
    if (!env) return undefined;
    if (this.tokens[env]) return this.tokens[env];
    // Fetch token
    try {
      const loginCreds = credentials || LOGIN_CREDENTIALS;
      const response = await axios.post(LOGIN_URLS[env], loginCreds);
      const token = response.data?.token || response.data?.accessToken;
      if (token) {
        this.tokens[env] = token;
        return token;
      }
    } catch (e) {
      // Ignore
    }
    return undefined;
  }
}

export const tokenManager = new TokenManager();