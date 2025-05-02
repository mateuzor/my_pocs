
import React, { useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import { AuthContext } from "./contexts/AuthContext";
import { LanguageContext } from "./contexts/LanguageContext";

const translations = {
  en: { welcome: "Welcome", login: "Login", logout: "Logout", theme: "Toggle Theme" },
  pt: { welcome: "Bem-vindo", login: "Entrar", logout: "Sair", theme: "Alternar Tema" },
};

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, login, logout } = useContext(AuthContext);
  const { language, switchLanguage } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div style={{
      background: theme === "dark" ? "#333" : "#eee",
      color: theme === "dark" ? "#eee" : "#333",
      height: "100vh",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <h1>{t.welcome}{user ? `, ${user.name}` : ""}!</h1>

      {user ? (
        <button onClick={logout}>{t.logout}</button>
      ) : (
        <button onClick={() => login("Mateus")}>{t.login}</button>
      )}

      <button onClick={toggleTheme}>{t.theme}</button>

      <div>
        <label>Language: </label>
        <select value={language} onChange={(e) => switchLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>
    </div>
  );
}
