'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { languages } from '../i18n/settings';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const handleLanguageChange = (newLang: string) => {
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    router.push(newPath);
  };

  const currentLang = pathname.split('/')[1] || 'en';

  return (
    <select
      value={currentLang}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="px-2 py-1 border rounded bg-white"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang === 'en' ? 'English' : 'العربية'}
        </option>
      ))}
    </select>
  );
} 