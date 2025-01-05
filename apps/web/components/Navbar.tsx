"use client";

import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {t('Sign out')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 