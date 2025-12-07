# Tehnologii Frontend (UniVent)

Acest document descrie tehnologiile principale, bibliotecile și uneltele utilizate în dezvoltarea interfeței frontend a aplicației UniVent.

## Framework și Limbaj de Programare

- **Platforma:** [React](https://react.dev/) - Bibliotecă JavaScript pentru UI bazată pe componente.
- **Limbaj:** [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript cu tipizare statică.
- **Build Tool:** [Vite](https://vitejs.dev/) - Unelte frontend rapide pentru dezvoltare și build optimizat.

## Rutare

- **Librărie:** [React Router](https://reactrouter.com/) - Librărie standard pentru gestionarea rutelor în React.

## Managementul Stării Globale

- **Librărie:** [Zustand](https://zustand-demo.pmnd.rs/) - Soluție minimalistă pentru managementul stării cu hook-uri.

## Stiluri și Componente UI

- **Framework CSS:** [Tailwind CSS](https://tailwindcss.com/) - Framework CSS "utility-first" pentru design rapid.
- **Iconițe:** [Lucide React](https://lucide.dev/) - Bibliotecă de iconițe simple și consistente.
- **Notificări:** [Sonner](https://sonner.emilkowal.ski/) - Librărie minimalistă pentru notificări (toasts).
- **Utilitare CSS:** `clsx` și `tailwind-merge` - Biblioteci pentru clase CSS condiționale și unirea claselor Tailwind.

## Comunicare cu API-ul

- **Client API:** [openapi-fetch](https://www.npmjs.com/package/openapi-fetch) - Client fetch tip-safe, generat din OpenAPI.
- **Generare Tipuri:** [openapi-typescript](https://www.npmjs.com/package/openapi-typescript) - Generează interfețe TypeScript din specificații OpenAPI.

## Internaționalizare (i18n)

- **Framework:** [i18next](https://www.i18next.com/) - Framework complet pentru internaționalizarea aplicațiilor.
- **Integrare React:** [react-i18next](https://react.i18next.com/) - Componente și hook-uri pentru i18next în React.
- **Detecție Limbă:** [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) - Plugin i18next pentru detecția limbii browserului.

## Unelte de Dezvoltare (Dev Tools)

- **Linting:** [ESLint](https://eslint.org/) - Unealtă de analiză statică pentru JavaScript/TypeScript.
- **Formatare Cod:** [Prettier](https://prettier.io/) - Unealtă pentru formatarea automată și consistentă a codului.