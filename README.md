# UniVent Frontend 🎓

Acesta este frontend-ul pentru aplicația UniVent, construit modern cu **Vite + React**.

## 🚀 Pornire Rapidă

```bash
# Instalare dependențe
npm install

# Pornire server local
npm run dev
```

## 🛠 Tech Stack

* **Core:** React 18, TypeScript, Vite.
* **Stiluri:** **Tailwind CSS v4** (Fără config JS, totul e în CSS).
* **Routing:** React Router DOM (v6+).
* **Limbi:** react-i18next (JSON simplu per limbă).
* **Icons:** `lucide-react`.
* **Utils:** `clsx` + `tailwind-merge` (pentru stiluri condiționale).

---

## 📂 Structura Proiectului

```text
src/
├── api/             # Apeluri către server (Axios/Fetch functions)
├── assets/          # Resurse statice (imagini, logo-uri, fonturi)
├── components/      # Componente UI reutilizabile (Navbar, Button, Input)
│                    # ⚠️ Componentele acceptă "className" prin utilitarul cn()
├── i18n/            # Configurare internaționalizare
│   ├── locales/     # Fișiere JSON cu traduceri (en.json, ro.json)
│   └── index.ts     # Inițializare i18next
├── layouts/         # Schelete de pagini
│   ├── AuthLayout.tsx       # Layout simplu/centrat (Login/Register)
│   └── DashboardLayout.tsx  # Layout principal cu Navbar și Footer
├── pages/           # Ecranele aplicației (Views)
│   ├── Auth/        # Pagini de autentificare
│   ├── Events/      # Pagini legate de evenimente
│   └── Home/        # Landing page
├── router/          # Logica de navigare
│   ├── index.tsx          # Definirea rutelor (Public vs Private)
│   └── ProtectedRoute.tsx # Guard pentru rutele care necesită login
├── types/           # Definiții TypeScript globale (interfețe User, Event etc.)
├── utils/           # Funcții ajutătoare
│   └── cn.ts        # Utilitar pentru combinarea claselor Tailwind
├── index.css        # Configurare Tailwind v4, Variabile CSS, Dark Mode
└── main.tsx         # Punctul de intrare (Mount React + RouterProvider)
```

---

## 💡 Ghid de Dezvoltare (How-To)

### 1. Cum stilizez? (Tailwind v4)

Nu folosim fișiere `.css` separate (decât `index.css` global). Scriem clase direct în JSX.

#### A. Culori Semantice (OBLIGATORIU pentru Dark Mode)
**Nu folosiți culori hardcodate** (gen `bg-white`, `text-black` sau `border-gray-200`).
Folosiți **clasele semantice** definite în `index.css`. Acestea își schimbă automat culoarea când se activează tema Dark.

| Element | Clasă de folosit | Ce face (Light ↔ Dark) |
| :--- | :--- | :--- |
| **Fundal Pagină** | `bg-page` | `Gray-50` ↔ `Gray-950` |
| **Card / Container** | `bg-card` | `White` ↔ `Gray-900` |
| **Text Principal** | `text-primary` | `Black` ↔ `White` |
| **Text Secundar** | `text-secondary` | `Gray-500` ↔ `Gray-400` |
| **Border** | `border-border` | `Gray-200` ↔ `Gray-800` |

#### B. Clase Utilitare (Components)
Pentru consistență, avem clase predefinite în `index.css` (folosind `@apply`):
* **Butoane:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
* **Containere:** `.card` (include background, border, shadow, padding)
* **Formulare:** `.input-field`, `.label`
* **Tipografie:** `.text-h1`, `.text-h2`, `.text-body`

#### C. Stiluri Condiționale
Nu folosiți template literals cu operatori ternari în string.
Folosiți funcția `cn()` importată din `@/utils/cn`. Aceasta gestionează condițiile și conflictele de clase Tailwind.

```tsx
import { cn } from '@/utils/cn';

// Exemplu: Butonul devine roșu dacă are eroare
<button className={cn(
  "btn btn-primary",            // Clasele de bază
  hasError && "bg-red-500",     // Aplicat doar dacă hasError e true
  className                     // Clase extra venite prin props
)}>
  Click me
</button>
```

### 2. Stiluri Condiționale
Folosiți utilitarul `cn()` (import din `@/utils/cn`) când aveți condiții sau vreți să permiteți suprascrierea claselor.

```tsx
// Așa DA
<button className={cn("bg-primary", isDisabled && "opacity-50")}>...
```

### 3. Cum adaug o pagină nouă?

**Pasul 1:** Creează componenta paginii în `src/pages/` (de preferat într-un folder sugestiv).
*(Exemplu: `src/pages/Events/MyNewPage.tsx`)*

**Pasul 2:** Adaugă ruta în `src/router/index.tsx`.
Trebuie să decizi în ce categorie se încadrează pagina:

* **A. Pagina de Autentificare** (Fără Navbar, Centrată)
    * Adaugă în lista `children` de la ruta `path: '/auth'`.
* **B. Pagina Publică în Aplicație** (Are Navbar, vizibilă oricui)
    * Adaugă direct în lista `children` de la ruta `path: '/'`.
* **C. Pagina Privată** (Are Navbar, **necesită Login**)
    * Adaugă în lista `children` din interiorul wrapper-ului `<ProtectedRoute />`.
    * 
```tsx
{
  element: <DashboardLayout />
    children: [
  // ...
  {
    element: <ProtectedRoute />, // <--- Zona Privată
    children: [
      {
        path: 'events/new-page',
        element: <MyNewPage /> // <--- Aici adaugi pagina protejată
      }
    ]
  }
]
}
```

### 4. Traduceri (i18n)
Toate textele vizibile trebuie să fie în `src/i18n/locales/en.json` (și `ro.json`).
Nu scrieți text "hardcoded" în componente.

```tsx
const { t } = useTranslation();
<h1>{t('auth.login.title')}</h1>
```

### 5. Dark Mode
Este **automat**.
Dacă folosiți variabilele semantice (ex: `bg-page`), componenta își va schimba culoarea singură când clasa `.dark` este activă pe `<html>`. Nu trebuie să scrieți `dark:bg-black` manual.
