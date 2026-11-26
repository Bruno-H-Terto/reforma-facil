import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { BusinessHome, BusinessDetail, States } from "./pages/Business";
import { TaxCalculators } from "./pages/TaxCalculators";
import { Mei } from "./pages/Mei";
import { News } from "./pages/News";
import { Home } from "./pages/Home";
import { Guide } from "./pages/Guide";
import { Library } from "./pages/Library";
import { QuickSimulator } from "./pages/QuickSimulator";
import { NotFound } from "./pages/NotFound";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="empresas" element={<BusinessHome />} />
          <Route path="empresas/:group/:id" element={<BusinessDetail />} />
          <Route path="calculadoras" element={<TaxCalculators />} />
          <Route
            path="calculadoras/:regime/:annex?"
            element={<TaxCalculators />}
          />
          <Route path="mei" element={<Mei />} />
          <Route path="noticias" element={<News />} />
          <Route path="estados" element={<States />} />
          <Route path="entenda" element={<Guide />} />
          <Route path="simulador" element={<QuickSimulator />} />
          <Route
            path="simulador/avancado"
            element={<Navigate to="/simulador?modo=comparar" replace />}
          />
          <Route path="biblioteca" element={<Library />} />
          <Route path="duvidas" element={<Navigate to="/#duvidas" replace />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
