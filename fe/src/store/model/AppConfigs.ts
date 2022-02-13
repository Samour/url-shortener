export interface RegisterConfig {
  minPasswordLength: number;
}

export interface AppConfigs {
  apiEndpoint: string;
  registerConfig: RegisterConfig;
}
