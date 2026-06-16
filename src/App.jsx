import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Planos from "./pages/Planos";
import Vinculo from "./pages/Vinculo";
import Cobertura from "./pages/Cobertura";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-white text-brand-700"
            : "text-brand-50 hover:bg-brand-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-700 shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩺</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                Convênios
              </h1>
              <p className="text-brand-50 text-xs">Módulo G9 · Saúde Integrado</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <NavItem to="/planos">Planos</NavItem>
            <NavItem to="/vinculo">Vínculo</NavItem>
            <NavItem to="/cobertura">Cobertura</NavItem>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/planos" replace />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/vinculo" element={<Vinculo />} />
          <Route path="/cobertura" element={<Cobertura />} />
        </Routes>
      </main>
    </div>
  );
}
