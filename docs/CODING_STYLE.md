# **Ghid de Coding Style & Bune Practici - Frontend (React)**

## 1. Structura Proiectului

Respectăm o structură de foldere bazată pe funcționalitate.

```text
src/
├── api/             # Servicii pentru apeluri API (ex: authService.ts)
├── components/      # Componente UI generice, reutilizabile (Button, Input)
├── constants/       # Valori constante globale (Regex, Enums)
├── i18n/            # Configurare și fișiere de traducere
├── layouts/         # Schelete de pagini (DashboardLayout, AuthLayout)
├── pages/           # Componentele principale ale paginilor (views)
├── router/          # Logica de rutare (public, privat, protejat)
├── stores/          # Store-uri globale Zustand (authStore.ts)
├── types/           # Definiții TypeScript (schema.ts, interfețe globale)
├── utils/           # Funcții ajutătoare (ex: cn.ts)
├── index.css        # Configurare globală Tailwind, variabile CSS, Dark Mode
└── main.tsx         # Punctul de intrare al aplicației
```

## 2. Formatare & Linting

Formatarea codului este automată și non-negociabilă, fiind gestionată de **Prettier**. Linting-ul este asigurat de **ESLint** pentru a identifica probleme de calitate a codului.

-   **Rulare verificări:**
    ```bash
    # Verifică erorile de linting
    npm run lint
    ```
-   **Reguli Prettier principale:**
    -   Lățime maximă linie: `100` caractere
    -   Ghilimele: `singleQuote` pentru JS/TS, `doubleQuote` pentru JSX
    -   Punct și virgulă (`semi`): `true`
    -   Virgulă la final (`trailingComma`): `all`

## 3. Convenții de Denumire

| Element                               | Convenție   | Exemplu                    |
| ------------------------------------- | ----------- | -------------------------- |
| **Foldere Structurale (ex: `src/api/`)** | `lowercase` | `src/components/`, `src/api/`    |
| **Foldere Feature (ex: `src/pages/`)** | `PascalCase` | `src/pages/Auth/`, `src/pages/Profile/` |
| **Fișiere Componentă React**          | `PascalCase.tsx` | `UserProfileCard.tsx`      |
| **Fișiere Non-Componentă (hooks, utils)** | `camelCase.ts` | `authService.ts`, `useApi.ts` |
| **Componente & Tipuri/Interfețe**     | `PascalCase` | `function Navbar() {}`, `interface User {}` |
| **Variabile, Funcții, Props**         | `camelCase` | `const userIsActive = true;`, `function getUser() {}` |
| **Constante Globale**                 | `UPPER_SNAKE_CASE` | `export const API_URL = '...'` |
| **Clase CSS (în `index.css`)**        | `kebab-case` | `.btn-primary`, `.input-field` |

## 4. Ghid de Stilare (Tailwind CSS v4)

### A. Fără culori hardcodate. Folosiți culori semantice.

Pentru a asigura funcționarea corectă a temei Dark/Light, este **obligatoriu** să folosim clasele semantice definite în `src/index.css`. Acestea sunt definite ca variabile CSS și mapate în `@theme` pentru a fi folosite ca utilități Tailwind (ex: `bg-page`, `text-main`).

| Variabilă CSS             | Clasă Tailwind  | Utilizare (Light ↔ Dark) |
| ------------------------- | --------------- | ------------------------ |
| `--bg-page`               | `bg-page`       | `Gray-50` ↔ `Gray-950`   |
| `--bg-card`               | `bg-card`       | `White` ↔ `Gray-900`     |
| `--text-primary`          | `text-main`     | `Black` ↔ `White`        |
| `--text-secondary`        | `text-muted`    | `Gray-500` ↔ `Gray-400`  |
| `--border-base`           | `border-border` | `Gray-200` ↔ `Gray-800`  |
| `--color-accent`          | `bg-accent`, `text-accent`, etc. | `#3FBFF6` |
| `--text-destructive`      | `text-destructive` | `Red-600` |
| `--border-destructive`    | `border-destructive` | `Red-500` |
| `--bg-muted`              | `bg-muted`      | `Gray-100` |


### B. Folosiți clasele utilitare predefinite

Pentru elemente comune precum butoane, carduri, input-uri, folosiți clasele definite în secțiunea `@layer components` din `src/index.css` (ex: `.btn`, `.btn-primary`, `.card`, `.input-field`, `.tag`). Acestea asigură consistență vizuală și reduc duplicarea codului.

### C. Stiluri condiționale cu `cn()`

Nu folosiți template literals (` `` `) pentru a construi dinamic `className`. Folosiți **întotdeauna** utilitarul `cn()` pentru a gestiona clasele condiționale și a preveni conflictele în Tailwind.

```tsx
import { cn } from '@/utils/cn';

// CORECT ✅
<div className={cn(
  'card',
  isFeatured && 'border-accent shadow-lg',
  className
)}>
  ...
</div>

// GREȘIT ❌
<div className={`card ${isFeatured ? 'border-accent shadow-lg' : ''} ${className}`}>
  ...
</div>
```

## 5. Componente React

-   Scrieți **exclusiv componente funcționale** cu hooks.
-   O componentă reutilizabilă **trebuie** să accepte o prop `className` și să o paseze la `cn()` pentru a permite suprascrierea stilurilor.
-   Separați logica complexă în **hooks custom** (ex: `useUserData`).

## 6. State Management (Zustand)

-   Folosiți `useState` pentru starea locală a componentelor (ex: deschiderea unui meniu, starea unui input).
-   Folosiți **Zustand** pentru starea globală, accesibilă în multiple părți ale aplicației (ex: datele utilizatorului autentificat, tema selectată).
-   Pentru a crea sau modifica un store, urmați instrucțiunile din `README.md`.

## 7. Comunicarea cu API-ul (Service Layer)

-   **Nu chemați `fetch` sau clientul API direct din componente.**
-   Toată logica de comunicare cu un anumit domeniu al API-ului (ex: `users`, `events`) trebuie încapsulată într-un **fișier de serviciu** în `src/api/`.
-   Serviciile trebuie să gestioneze apelul, procesarea datelor și erorile de bază (ex: afișarea unui toast de eroare).
-   Când se modifică API-ul, rulați `npm run gen:api` pentru a actualiza tipurile TypeScript.

## 8. Internaționalizare (i18n)

-   **Nu scrieți text hardcodat** în componente.
-   Toate textele vizibile pentru utilizator trebuie adăugate în `src/i18n/locales/en.json` și `ro.json`.
-   Folosiți hook-ul `useTranslation` pentru a accesa traducerile: `const { t } = useTranslation(); <h1>{t('auth.login.title')}</h1>`.

## 9. Git Workflow & Commits

*(Notă: Această secțiune este o propunere și trebuie validată de echipă.)*

### A. Branching Model

Folosim un model bazat pe Git-Flow simplificat. Numele branch-urilor trebuie să respecte formatul:

-   **Feature:** `feature/TICKET-123-descriere-scurta` (ex: `feature/UN-54-add-event-filtering`)
-   **Fix:** `fix/TICKET-123-descriere-scurta` (ex: `fix/UN-58-login-button-bug`)
-   **Chore:** `chore/nume-task` (ex: `chore/update-readme`)

### B. Commit Messages

Folosim convenția **Conventional Commits**. Fiecare mesaj de commit trebuie să aibă un prefix care indică tipul modificării.

-   `feat:` - O funcționalitate nouă
-   `fix:` - O rezolvare de bug
-   `docs:` - Modificări la documentație
-   `style:` - Modificări de formatare, fără impact pe logică
-   `refactor:` - Refactorizare de cod, fără a schimba funcționalitatea
-   `test:` - Adăugare sau modificare de teste
-   `chore:` - Task-uri de mentenanță (update dependencies, etc.)

**Exemplu:**
```
feat: Add password strength indicator to registration form

Adds a visual component to show the user how strong their chosen password is.

Resolves UN-45
```

### C. Pull Requests (PRs)

-   Fiecare task se finalizează printr-un Pull Request către branch-ul `main` (sau `develop`).
-   PR-ul trebuie să aibă o descriere clară a modificărilor.
-   Este necesară **cel puțin o aprobare** de la un alt membru al echipei.
-   Toate verificările automate (lint, build) trebuie să treacă.