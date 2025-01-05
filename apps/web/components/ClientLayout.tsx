'use client';

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
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
      <div dir={isRTL ? 'rtl' : 'ltr'}>
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
      </div>
    </SessionProvider>
  );
} 