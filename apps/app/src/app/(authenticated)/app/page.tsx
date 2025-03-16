'use client';

import { BetterAuthUI } from '@repo/auth';
import { OrganizationButton } from "@repo/auth/components/organization-button";
import { authClient } from '@repo/auth/client';
export default function Page() {
  const { data: session } = authClient.useSession();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <BetterAuthUI.UserButton size="full" />
      <OrganizationButton size="full" />
      {/* <pre>{JSON.stringify(organization, null, 2)}</pre> */}
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
