import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import LongContent from "./pages/LongContent";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import { productsLoader } from "./loaders/productsLoader";
import { contactAction } from "./actions/contactAction";
import "./App.css";

function App() {
  const location = useLocation();

  // Pegamos o background se existir
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Layout />}>
          {/* index = rota filha padrão dentro do Layout (equivale a "/") */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UserDetails />} />
          <Route path="admin" element={<Admin />} />
          <Route path="long" element={<LongContent />} />
          {/* Rota com loader function - dados carregados antes de renderizar */}
          <Route path="products" element={<Products />} loader={productsLoader} />
          {/* Rota com action function - processa formulários sem useState */}
          <Route path="contact" element={<Contact />} action={contactAction} />
          {/* Rotas demonstrando navegação programática com state */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="success" element={<Success />} />
        </Route>
        {/* path="*" pega qualquer rota não mapeada (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* se existe background, renderizamos a rota atual por cima */}
      {background && (
        <Routes>
          <Route path="/users/:userId" element={<UserDetails />} />
        </Routes>
      )}
    </>
  );
}

export default App;
