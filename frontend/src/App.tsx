import { useAuth, AuthProvider } from "./utility/use-auth-client";
import { Principal } from "@dfinity/principal";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { SetStateAction, useEffect, useState } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import { AnimatePresence, motion } from "framer-motion";

// Others

import { RegistrationProvider } from "./utility/RegistrationContext";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/marketplace/page";
import MSMEProfilePage from "./pages/msme/[id]/page";
import AuthPage from "./pages/auth/page";
import ProtectedRoute from "./utility/ProtectedRoute";
import InternetIdentityPage from "./pages/auth/internet-identity-login";
import MSMERegistrationPage from "./pages/msme-registration/page";
import MSMEDashboardPage from "./pages/dashboard/msme/page";
import DashboardLayout from "./components/layout/dashboard-layout";
import { BarChart3, Building, Home, Notebook, Store, User2, Wallet } from "lucide-react";
import CreateNFTPage from "./pages/dashboard/msme/create-nft/page";
import CreateMSMEProfilePage from "./pages/dashboard/msme/profile/page";
import InvestorDashboardPage from "./pages/dashboard/user/page";
import InvestorPortfolioPage from "./pages/dashboard/user/portofolio/page";
import AdminDashboardPage from "./pages/dashboard/admin/page";
import { backend } from "@declarations/backend";
import DocumentsPage from "./pages/msme-registration/documents/page";
import VerificationDashboardPage from "./pages/dashboard/verify/page";
import MSMEVerificationPage from "./pages/dashboard/verify/msme/[id]/page";
import RevenueVerificationPage from "./pages/dashboard/verify/revenue/[id]/page";
import EditMSMEProfilePage from "./pages/dashboard/msme/profile/page";
import { RevenueReportingDashboard } from "./examples/RevenueReportingExamples";
import { VerificationWorkflowDashboard } from "./examples/VerificationWorkflowExamples";
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex justify-center items-center bg-white z-50"
    ></motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const msmeNavItems = [
    { path: "/dashboard/msme", label: "Dashboard", icon: Home },
    { path: "/dashboard/msme/profile", label: "MSME Profile", icon: Store },
  ]
  const investorNavItems = [
    { path: "/dashboard/user", label: "Dashboard", icon: Home },
    { path: "/dashboard/user/portfolio", label: "Portfolio", icon: BarChart3 },
    { path: "/dashboard/user/profile", label: "Profile", icon: User2 },
  ]
  const adminNavItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: Home },
  ]
  return (
    <>

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <AnimatePresence mode="wait">

        {/* <Navbar /> */}
        {!loading && (
          <Routes location={location} key={location.pathname}>
            {/* DEFAULT PAGES SECTION */}

            <Route path="/" element={<LandingPage />} />

            {/* Auth Pages */}
            <Route
              path="/auth"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AuthPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/internet-identity"
              element={
                <InternetIdentityPage />
              }
            />

            {/* Marketplace Pages */}
            <Route
              path="/marketplace"
              element={
                <MarketplacePage />
              }
            />

            {/* MSME Registration Pages */}
            <Route
              path="/msme-registration"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MSMERegistrationPage />
                </ProtectedRoute>
              }
            />
            {/* MSME Profile Pages */}
            <Route
              path="/msme/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MSMEProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/msme-registration/documents"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Msme Pages */}
            <Route
              path="/dashboard/msme"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <MSMEDashboardPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/msme/create-nft"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <CreateNFTPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/msme/profile"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <EditMSMEProfilePage />
                </DashboardLayout>
              }
            />

            <Route
              path="/m"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <VerificationWorkflowDashboard />
                </DashboardLayout>
              }
            />
            {/* Dashboard Investor Pages */}
            <Route
              path="/dashboard/user"
              element={
                <DashboardLayout navItems={investorNavItems}>
                  <InvestorDashboardPage />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/user/portfolio"
              element={
                <DashboardLayout navItems={investorNavItems}>
                  <InvestorPortfolioPage />
                </DashboardLayout>
              }
            />


            {/* Verify Dashboard */}
            <Route
              path="/dashboard/verify"
              element={
                <VerificationDashboardPage />}
            />
            <Route
              path="/dashboard/verify/msme/:id"
              element={
                <MSMEVerificationPage />
              }
            />
            <Route
              path="/dashboard/verify/revenue/:id"
              element={
                <RevenueVerificationPage />
              }
            />
            {/* Admin Pages */}
            <Route
              path="/dashboard/admin"
              element={
                <DashboardLayout navItems={adminNavItems}>
                  <AdminDashboardPage />
                </DashboardLayout>
              }
            />

            {/* ERROR PAGE SECTION */}

            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const auth = useAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  if (!auth) return null;

  const { isAuthenticated, principal } = auth;
  console.log("isAuthenticated ", isAuthenticated);

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (isAuthenticated && principal) {
        try {
          // const principalObj = Principal.fromText(principal);
          // const principalObj = principal;
          // @ts-ignore
          const result = await backend.getUserByPrincipal(principal);
          result ? setIsRegistered(true) : setIsRegistered(false);
        } catch (error) {
          console.error("Error checking registration:", error);
        }
      }
      setLoading(false);
    };

    if (isAuthenticated && principal) {
      checkIfRegistered();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, principal]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="pageContent">
      <BrowserRouter>
        {/* @ts-ignore */}
        <Toaster position="top-center" />
        <AnimatedRoutes />
      </BrowserRouter>
    </main>
  );
};

export default () => (
  <AuthProvider>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </AuthProvider>
);
