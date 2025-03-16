import { auth } from '@repo/auth/server';
import { headers } from 'next/headers';
// import { secure } from '@repo/security';
import type { ReactNode } from 'react';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AppLayout;
