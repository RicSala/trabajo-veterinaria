'use client';

import { useRouter } from 'next/navigation';
import { DesignSystemProvider } from '@repo/design-system';
import { authClient } from './client';
import Link from 'next/link';
import { useTranslations } from '@repo/internationalization/src/i18n/useTranslation';
// import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthLocalization, AuthUIProvider } from '@daveyplate/better-auth-ui';
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const localization = useLocalization();
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
        defaultRedirectTo='/app'
        localization={localization}
      >
        {children}
      </AuthUIProvider>
      {/* </AuthQueryProvider> */}
    </DesignSystemProvider>
  );
}

// probably not the best way to do this
const useLocalization = () => {
  const t = useTranslations('Auth');
  const authLocalization: AuthLocalization = {
    alreadyHaveAnAccount: t('alreadyHaveAnAccount'),
    dontHaveAnAccount: t('dontHaveAnAccount'),
    signIn: t('signIn'),
    signUp: t('signUp'),
    signOut: t('signOut'),
    email: t('email'),
    password: t('password'),
    forgotPassword: t('forgotPassword'),
    resetPassword: t('resetPassword'),
    newPassword: t('newPassword'),
    name: t('name'),
    signUpDescription: t('signUpDescription'),
    namePlaceholder: t('namePlaceholder'),
    emailPlaceholder: t('emailPlaceholder'),
    signUpAction: t('signUpAction'),
    signInAction: t('signInAction'),
    passwordPlaceholder: t('passwordPlaceholder'),
    newPasswordPlaceholder: t('newPasswordPlaceholder'),
    changePassword: t('changePassword'),
    changePasswordInstructions: t('changePasswordInstructions'),
    changePasswordDescription: t('changePasswordDescription'),
  };

  return authLocalization;
};
