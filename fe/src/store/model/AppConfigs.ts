export interface RegisterConfig {
  minPasswordLength: number;
}

export interface ShortUrlConfig {
  shortUrlBase: string;
}

export interface AppConfigs {
  apiEndpoint: string;
  registerConfig: RegisterConfig;
  shortUrlConfig: ShortUrlConfig;
}
