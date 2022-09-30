import { IConfig, InMemoryStorageProvider, IToggle, UnleashClient } from 'unleash-proxy-client';
import { SessionProp } from './auth';

export const config: IConfig = {
  url: process.env.NEXT_PUBLIC_UNLEASH_PROXY_URL || '',
  clientKey: process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY || '',
  refreshInterval: parseInt(process.env.NEXT_PUBLIC_UNLEASH_REFRESH_INTERVAL || '15'),
  appName: process.env.NEXT_PUBLIC_UNLEASH_APP_NAME || '',
  environment: process.env.NEXT_PUBLIC_UNLEASH_ENVIRONMENT,
};

export type ToggleProp = { toggles: IToggle[] };

export const getPrefetchClient = () =>
  new UnleashClient({
    ...config,
    fetch,
    storageProvider: new InMemoryStorageProvider(),
    disableMetrics: true,
    disableRefresh: true,
  });

export const getAppClient = (toggles: IToggle[]) =>
  new UnleashClient({
    ...config,
    ...(typeof window !== 'undefined'
      ? {}
      : { fetch: fetch, storageProvider: new InMemoryStorageProvider() }),
    bootstrap: toggles,
  });

export const withToggles = async <P extends { [key: string]: any } & SessionProp>(
  props: P,
): Promise<P & ToggleProp> => {
  const unleash = getPrefetchClient();

  if (props.session) unleash.updateContext({ userId: props.session?.user.id });

  await unleash.start();
  const toggles = unleash.getAllToggles();

  return { ...props, toggles };
};
