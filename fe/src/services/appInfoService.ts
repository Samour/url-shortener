import {versionConfig} from 'src/versionConfig';

export const registerAppInfo = () => {
  (window as any).debugAppInfo = () => {
    console.log({
      version: versionConfig.version,
    });
  };
};
