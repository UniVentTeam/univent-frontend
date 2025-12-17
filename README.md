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
├── constants/       # Valori constante globale (Regex, Configs, Enums)
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
├── stores/          # State management global (ex: UserStore, EventStore)
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

### 5. API Layer (Servicii)
Pentru a menține o arhitectură curată și scalabilă, **NU chemăm clientul API (`api.ts`) direct din componentele React**. În schimb, folosim un **"Service Layer"**. Toată logica legată de un anumit domeniu al API-ului (ex: autentificare, evenimente) este încapsulată în propriul său fișier de serviciu în folderul `src/api/`.

**De ce?**
*   **Separarea Responsabilităților:** Componentele se ocupă de UI, serviciile se ocupă de comunicarea cu API-ul.
*   **Centralizarea Logicii:** Un singur loc unde se gestionează endpoint-uri, procesarea datelor și erorilor.
*   **Cod Ușor de Reutilizat:** O funcție de serviciu (ex: `authService.login`) poate fi chemată din orice componentă, fără a rescrie cod.
*   **Integrare cu Alte Sisteme:** Serviciile pot conține logică de business complexă, cum ar fi actualizarea unui store Zustand după un apel API reușit.

#### A. Exemplu: Folosirea `authService`
Am implementat deja `authService.ts` pentru autentificare. Iată cum se folosește într-o pagină de Login:

```tsx
// src/pages/Auth/Login.tsx
import { authService } from '@/api/authService'; // 1. Importăm serviciul
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      // 2. Chemăm funcția de serviciu. Componenta nu știe ce se întâmplă în spate.
      await authService.login({ email, password });
      // Notificarea și actualizarea store-ului sunt gestionate în serviciu!
    } catch (err: any) {
      // 3. Prindem eroarea aruncată de serviciu pentru a actualiza UI-ul.
      setError(err.message);
    }
  };
  
  // ... restul componentei (JSX)
}
```

#### B. Cum creez un serviciu nou?
Să zicem că vrei să gestionezi evenimentele.

**1. Creează fișierul `src/api/eventService.ts`:**

**2. Adaugă funcțiile necesare, urmând modelul din `authService`:**

```typescript
// src/api/eventService.ts
import api from './client';
import { components } from '@/types/schema';
import { toast } from 'sonner';

type EventFilterQuery = components['schemas']['EventFilterQuery'];

/**
 * Preia lista de evenimente, cu posibilitate de filtrare.
 */
async function getEvents(filters: EventFilterQuery) {
  const { data, error } = await api.GET('/events', {
    params: { query: filters },
  });

  if (error) {
    toast.error('Failed to fetch events');
    throw new Error('Could not retrieve events.');
  }

  return data; // Returnează datele pentru a fi folosite în componentă
}

export const eventService = {
  getEvents,
  // getEventById,
  // createEvent,
};
```

#### C. Actualizare Tipuri (Sync cu Backend)
Când se modifică API-ul (backend), rulează comanda pentru a regenera definițiile TypeScript din `schema.ts`. Serviciile tale vor beneficia automat de noile tipuri.
```bash
npm run gen:api
```


### 6. Dark Mode
Este **automat**.
Dacă folosiți variabilele semantice (ex: `bg-page`), componenta își va schimba culoarea singură când clasa `.dark` este activă pe `<html>`. Nu trebuie să scrieți `dark:bg-black` manual.

### 7. State Management Global (Zustand)
Folosim **Zustand** pentru a gestiona starea globală a aplicației (ex: datele utilizatorului logat). Este o soluție minimalistă, fără boilerplate.

#### A. Cum folosesc un store?
Store-urile se află în `src/stores`. Pentru a folosi unul, importă hook-ul corespunzător.

```tsx
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';

function UserProfileCard() {
  // Selectezi ce date vrei din store
  const { user, isAuthenticated } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();

  if (!isAuthenticated) {
    // În practică, această componentă nu ar fi randată deloc
    // dacă utilizatorul nu este autentificat.
    return null; 
  }

  return (
    <div className="card flex items-center justify-between">
      <div>
        <h3 className="text-h3">{user?.fullName}</h3>
        <p className="text-body-sm">{user?.email}</p>
      </div>
      <button onClick={logout} className="btn btn-secondary gap-2">
        <LogOut className="w-4 h-4" />
        <span>{t('auth.logout')}</span>
      </button>
    </div>
  );
}
```

#### B. Cum creez un store nou?
1.  Creează un fișier nou în `src/stores/`, de exemplu: `eventsStore.ts`.
2.  Folosește acest template de bază:

```typescript
import { create } from 'zustand';

// 1. Definește interfața pentru stare și acțiuni
interface EventsState {
  favoriteEvents: string[];
  addFavorite: (eventId: string) => void;
  removeFavorite: (eventId:string) => void;
}

// 2. Creează store-ul
export const useEventsStore = create<EventsState>((set) => ({
  // Starea inițială
  favoriteEvents: [],
  
  // Acțiunile care modifică starea folosind `set()`
  addFavorite: (eventId) =>
    set((state) => ({
      favoriteEvents: [...state.favoriteEvents, eventId],
    })),
    
  removeFavorite: (eventId) =>
    set((state) => ({
      favoriteEvents: state.favoriteEvents.filter((id) => id !== eventId),
    })),
}));
```

#### C. Cum adaug o funcție/variabilă nouă într-un store existent?
1.  Deschide fișierul store-ului (ex: `src/stores/authStore.ts`).
2.  Adaugă proprietatea în interfața de stare (ex: `lastLogin: Date | null`).
3.  Adaugă proprietatea și valoarea ei inițială în obiectul returnat de `create` (ex: `lastLogin: null`).
4.  Dacă ai nevoie de o acțiune nouă, adaug-o în interfață și apoi implementeaz-o în obiect.
