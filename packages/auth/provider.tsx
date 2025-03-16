'use client';

import { useRouter } from 'next/navigation';
import { DesignSystemProvider } from '@repo/design-system';
import { authClient } from './client';
import Link from 'next/link';
// import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProvider } from '@daveyplate/better-auth-ui';
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <DesignSystemProvider>

      {/* <AuthQueryProvider> */}
        <AuthUIProvider
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          onSessionChange={() => router.refresh()}
          LinkComponent={Link}
        settingsUrl='/settings'
        settingsFields={['customField']}
        additionalFields={{
          customField: {
            placeholder: 'customField',
            label: 'Custom Field',
            type: 'string',
            required: true,
          },
        }}
      >
        {children}
      </AuthUIProvider>
      {/* </AuthQueryProvider> */}
    </DesignSystemProvider>
  );
}
