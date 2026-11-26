import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { BusinessHome } from "./pages/Business";
import { News } from "./pages/News";
import { Home } from "./pages/Home";
import { Guide } from "./pages/Guide";
import { Library } from "./pages/Library";
import { QuickSimulator } from "./pages/QuickSimulator";
import { NotFound } from "./pages/NotFound";
import { regimes, annexes, profiles } from "./data/business";
import { annexTables } from "./data/taxTables";

function LegacyBusinessRedirect() {
  const { group, id } = useParams();
  if (!id) return <NotFound />;
  if (group === "regimes" && regimes.some((entry) => entry.id === id)) {
    return <Navigate to={"/empresas?regime=" + id} replace />;
  }
  if (group === "anexos" && annexes.some((entry) => entry.id === id)) {
    return (
      <Navigate
        to={"/empresas?regime=simples-nacional&anexo=" + id + "#anexos"}
        replace
      />
    );
  }
  if (group === "perfis" && profiles.some((entry) => entry.id === id)) {
    return <Navigate to="/empresas" replace />;
  }
  return <NotFound />;
}
function LegacyCalculatorRedirect() {
  const { regime, annex } = useParams();

  if (regime === "presumido" || regime === "real") {
    return <Navigate to={"/simulador?modo=" + regime} replace />;
  }
  if (
    regime === "simples" &&
    (!annex || Object.hasOwn(annexTables, annex.toUpperCase()))
  ) {
    return (
      <Navigate
        to={
          "/simulador?modo=das" +
          (annex ? "&anexo=" + annex.toUpperCase() : "") +
          "#das-detalhado"
        }
        replace
      />
    );
  }
  return <NotFound />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="empresas" element={<BusinessHome />} />
          <Route
            path="empresas/:group/:id"
            element={<LegacyBusinessRedirect />}
          />
          <Route
            path="calculadoras"
            element={
              <Navigate to="/simulador?modo=das#das-detalhado" replace />
            }
          />
          <Route
            path="calculadoras/:regime/:annex?"
            element={<LegacyCalculatorRedirect />}
          />
          <Route
            path="mei"
            element={
              <Navigate to="/empresas?regime=mei#calculadora-mei" replace />
            }
          />
          <Route path="noticias" element={<News />} />
          <Route
            path="estados"
            element={<Navigate to="/empresas#impacto-regional" replace />}
          />
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
