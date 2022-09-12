import { ChakraProvider } from '@chakra-ui/react';
import theme from '@theme/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';

import { getMessages } from '@i18n/getMessages';
import { supabase } from '@utils/supabaseClient';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps<{ dehydratedState: unknown }>) {
  const { locale } = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      });
    });

    return () => {
      authListener?.unsubscribe()
    }
  }, []);

  return (
    <IntlProvider locale={String(locale)} messages={getMessages(String(locale))}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </IntlProvider>
  );
}

export default MyApp;
