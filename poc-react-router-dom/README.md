# React Router DOM v7 - POC (Proof of Concept)

A comprehensive application demonstrating all major features of **React Router DOM v7** with TypeScript and Vite.

## Tech Stack

- **React 19.2** - UI Framework
- **TypeScript** - Type safety
- **React Router DOM 7.10** - Routing
- **Vite 7.2** - Build tool and dev server

## Installation and Usage

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Implemented Features

### 1. Basic Routes and Layout
- **Nested routes** with `Layout` component
- **`<Outlet />`** for child route rendering
- **`NavLink`** with automatic active styling
- Home, About, and 404 (NotFound) pages

**Files:** `src/App.tsx`, `src/layout/layout.tsx`

### 2. Dynamic Route Parameters
- Routes with parameters: `/users/:userId`
- **`useParams()`** to capture IDs from URL
- Navigation between list and details

**Files:** `src/pages/Users.tsx`, `src/pages/UserDetails.tsx`

```tsx
const { userId } = useParams<{ userId: string }>();
```

### 3. Query Strings (Search Params)
- Search filter using **`useSearchParams()`**
- State persisted in URL (`/users?q=name`)
- `replace: true` option to avoid polluting history

**File:** `src/pages/Users.tsx`

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";
```

### 4. Modal Routing (Background Location)
- Advanced technique for **modal with preserved route**
- Uses `state: { background: location }` to keep background page
- Renders two route stacks simultaneously

**File:** `src/App.tsx` (lines 19-39)

```tsx
<Link to={`/users/${id}`} state={{ background: location }}>
  Open Modal
</Link>
```

### 5. Programmatic Navigation
- **`useNavigate()`** for imperative navigation
- `navigate(-1)` - go back in history
- `navigate("/path")` - go to specific route

**File:** `src/pages/UserDetails.tsx`

```tsx
const navigate = useNavigate();
navigate(-1); // Go back
navigate("/users"); // Go to list
```

### 6. Scroll Restoration
- **`ScrollToTop`** component using `useLocation()`
- Restores scroll to top on route change
- Demo page with long content

**Files:** `src/components/ScrollToTop.tsx`, `src/pages/LongContent.tsx`

```tsx
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

### 7. Loader Functions (Data Fetching)
- **Loaders** load data BEFORE rendering
- **`useLoaderData()`** to access data in component
- Eliminates need for `useState` + `useEffect`
- Products page with mock API

**Files:** `src/loaders/productsLoader.ts`, `src/pages/Products.tsx`

```tsx
// Loader
export async function productsLoader() {
  const products = await fetchProducts();
  return { products };
}

// Component
const { products } = useLoaderData() as { products: Product[] };
```

### 8. Action Functions (Form Handling)
- **Actions** process forms without `preventDefault()`
- **`<Form>`** component (React Router)
- **`useActionData()`** for submit result
- **`useNavigation()`** for loading state
- Contact page with validation and feedback

**Files:** `src/actions/contactAction.ts`, `src/pages/Contact.tsx`

```tsx
// Action
export async function contactAction({ request }) {
  const formData = await request.formData();
  // Process data...
  return { success: true, message: "Sent!" };
}

// Component
<Form method="post">
  <input name="email" />
  <button type="submit">Send</button>
</Form>
```

### 9. State Passing Between Routes
- **`navigate(path, { state })`** to pass data between routes
- **`useLocation().state`** to access received data
- Dashboard → Success flow with checkout data

**Files:** `src/pages/Dashboard.tsx`, `src/pages/Success.tsx`

```tsx
// Sending state
navigate("/success", {
  state: { plan: "Pro", price: 19.99 }
});

// Receiving state
const state = useLocation().state as { plan: string; price: number };
```

### 10. Protected Routes (Admin)
- Protected route simulation
- Authentication pattern demonstration
- **`useMatch()`** to detect active route

**Files:** `src/pages/Admin.tsx`, `src/pages/Users.tsx`

```tsx
const matchDetails = useMatch("/users/:userId");
```

## Project Structure

```
src/
├── actions/           # Action functions for forms
│   └── contactAction.ts
├── components/        # Reusable components
│   ├── Modal.tsx
│   └── ScrollToTop.tsx
├── data/             # Mock data / simulated API
│   ├── users.ts
│   └── products.ts
├── layout/           # Layout components
│   └── layout.tsx
├── loaders/          # Loader functions for data fetching
│   └── productsLoader.ts
├── pages/            # Application pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Users.tsx
│   ├── UserDetails.tsx
│   ├── Products.tsx
│   ├── Contact.tsx
│   ├── Dashboard.tsx
│   ├── Success.tsx
│   ├── LongContent.tsx
│   ├── Admin.tsx
│   └── NotFound.tsx
├── App.tsx           # Route configuration
└── main.tsx          # Entry point
```

## React Router DOM Concepts Covered

| Concept | Hook/Component | Example File |
|---------|---------------|--------------|
| Basic Routes | `<Routes>`, `<Route>` | `App.tsx` |
| Nested Routes | `<Outlet>` | `layout/layout.tsx` |
| Navigation Links | `<NavLink>`, `<Link>` | `layout/layout.tsx` |
| URL Parameters | `useParams()` | `pages/UserDetails.tsx` |
| Query Strings | `useSearchParams()` | `pages/Users.tsx` |
| Programmatic Navigation | `useNavigate()` | `pages/Dashboard.tsx` |
| Location/State | `useLocation()` | `pages/Success.tsx` |
| Data Loading | `loader`, `useLoaderData()` | `pages/Products.tsx` |
| Form Actions | `action`, `useActionData()` | `pages/Contact.tsx` |
| Form Component | `<Form>` | `pages/Contact.tsx` |
| Navigation State | `useNavigation()` | `pages/Contact.tsx` |
| Modal Routing | Background Location | `App.tsx` |
| Route Matching | `useMatch()` | `pages/Users.tsx` |
| Catch-all Routes | `path="*"` | `App.tsx` |
| Scroll Behavior | Custom Hook | `components/ScrollToTop.tsx` |

## Patterns and Best Practices

1. **Feature-based Organization** - Clear separation of loaders, actions, pages
2. **TypeScript Strict** - Type safety in all components
3. **Educational Comments** - Well-documented code for learning
4. **Realistic Mock APIs** - Simulates network delays and errors
5. **Progressive Enhancement** - Forms work without JS
6. **State Management** - Smart use of URL as state

## Learning Resources

- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Vite Documentation](https://vitejs.dev/)

## License

MIT - Educational project for studying React Router DOM
