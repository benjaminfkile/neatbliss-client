import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ConfigProvider } from "./config/ConfigProvider";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { StatusBanner } from "./components/StatusBanner";
import { PreviewPill } from "./components/PreviewPill";
import { HomePage } from "./pages/Home";
import { ServicesPage } from "./pages/Services";
import { QuotePage } from "./pages/Quote";
import { AdminPage } from "./pages/Admin";
import { ADMIN_ROUTE } from "./routes";
import { useEffect } from "react";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StatusBanner />
      <NavBar />
      {children}
      <Footer />
      <PreviewPill />
    </>
  );
}

function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, pathname]);
  return null;
}

export default function App() {
  const rawBase = import.meta.env.BASE_URL || "/";
  const basename = rawBase.endsWith("/") && rawBase !== "/"
    ? rawBase.slice(0, -1)
    : rawBase === "/"
      ? undefined
      : rawBase;

  return (
    <ConfigProvider>
      <BrowserRouter basename={basename}>
        <ScrollToHash />
        <Routes>
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <ServicesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/quote"
            element={
              <PublicLayout>
                <QuotePage />
              </PublicLayout>
            }
          />
          <Route path={ADMIN_ROUTE} element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
