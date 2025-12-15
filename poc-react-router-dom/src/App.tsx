import { Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* index = rota filha padrão dentro do Layout (equivale a "/") */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<UserDetails />} />
      </Route>
      {/* path="*" pega qualquer rota não mapeada (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
