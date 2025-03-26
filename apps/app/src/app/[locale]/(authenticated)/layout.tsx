import type { ReactNode } from 'react';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  return <>{children}</>;
};

export default AppLayout;
