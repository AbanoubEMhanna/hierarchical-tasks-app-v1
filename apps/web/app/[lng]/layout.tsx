import { Inter } from "next/font/google";
import "../globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { languages } from '../../i18n/settings';
import ClientLayout from "../../components/ClientLayout";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  return {
    title: 'Task Manager',
  };
}

export default async function LngLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const session = await getServerSession(authOptions);

  return (
    <ClientLayout session={session}>
      {children}
    </ClientLayout>
  );
} 