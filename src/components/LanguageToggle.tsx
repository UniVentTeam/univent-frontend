// src/components/LanguageToggle.tsx
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ro' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="btn btn-secondary w-12 h-10"
      title="Schimbă limba"
    >
      <span className="text-xs font-bold uppercase">{i18n.language}</span>
    </button>
  );
}
