import { ChakraProvider } from '@chakra-ui/react';
import { ApplicationShell } from '@components/application-shell';
import { getMessages } from '@i18n/getMessages';
import { trpc } from '@lib/trpc';
import { getAppClient } from '@lib/unleash';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import theme from '@theme/theme';
import { FlagProvider, IToggle } from '@unleash/proxy-client-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

const WithApplicationShell = ({ children }: PropsWithChildren<{}>) => {
  const { pathname } = useRouter();
  if (pathname.startsWith('/app/v2')) return <>{children}</>;
  return pathname.startsWith('/app') ? <ApplicationShell {...{ children }} /> : <>{children}</>;
};

const MyApp = ({
  Component,
  pageProps: { session, toggles, ...pageProps },
}: AppProps<{ session: Session; toggles: IToggle[] }>) => {
  const { locale } = useRouter();
  const client = getAppClient(toggles);

  return (
    <FlagProvider unleashClient={client}>
      <SessionProvider session={session}>
        <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
          <ChakraProvider resetCSS theme={theme}>
            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
            <WithApplicationShell>
              <Component {...pageProps} />
            </WithApplicationShell>
          </ChakraProvider>
        </IntlProvider>
      </SessionProvider>
    </FlagProvider>
  );
};

export default trpc.withTRPC(MyApp);
