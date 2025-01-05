'use client';

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

export default function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();
  const isRTL = pathname?.split('/')[1] === 'ar';

  return (
    <SessionProvider session={session}>
      <Suspense fallback={null}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={isRTL}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Suspense>
    </SessionProvider>
  );
} 