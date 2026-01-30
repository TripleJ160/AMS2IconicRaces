'use client';

import { usePathname } from 'next/navigation';
import { PageTransition } from '@/components/shared/PageTransition';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isRaceDetailPage = pathname.startsWith('/race/');

  return (
    <div className={isRaceDetailPage ? '' : 'md:ml-64'}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
