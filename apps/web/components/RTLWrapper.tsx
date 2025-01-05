'use client';

import { usePathname } from 'next/navigation';

export default function RTLWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRTL = pathname?.split('/')[1] === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
} 