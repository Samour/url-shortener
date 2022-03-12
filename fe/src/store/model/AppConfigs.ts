export interface RegisterConfig {
  minPasswordLength: number;
}

export interface ShortUrlConfig {
  shortUrlBase: string;
}

export interface Features {
}

export interface AppConfigs {
  apiEndpoint: string;
  registerConfig: RegisterConfig;
  shortUrlConfig: ShortUrlConfig;
  features: Features;
}
