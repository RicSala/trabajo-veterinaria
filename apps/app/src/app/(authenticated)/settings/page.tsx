'use client';

import { BetterAuthUI } from '@repo/auth';
import { authClient } from '@repo/auth/client';
export default function Page() {
  const { data } = authClient.useSession();
  return (
    <div>
      {data?.user?.name}
      <BetterAuthUI.SettingsCards />
    </div>
  );
}
