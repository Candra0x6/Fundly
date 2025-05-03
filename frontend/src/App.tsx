import { useAuth, AuthProvider } from "./utility/use-auth-client";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
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
import { BarChart3, Home, Store, User2 } from "lucide-react";
import CreateNFTPage from "./pages/dashboard/msme/create-nft/page";
import InvestorDashboardPage from "./pages/dashboard/user/page";
import InvestorPortfolioPage from "./pages/dashboard/user/portofolio/page";
import AdminDashboardPage from "./pages/dashboard/admin/page";
import { backend } from "@declarations/backend";
import DocumentsPage from "./pages/msme-registration/documents/page";
import VerificationDashboardPage from "./pages/dashboard/verify/page";
import MSMEVerificationPage from "./pages/dashboard/verify/msme/[id]/page";
import RevenueVerificationPage from "./pages/dashboard/verify/revenue/[id]/page";
import EditMSMEProfilePage from "./pages/dashboard/msme/profile/page";
import { VerificationWorkflowDashboard } from "./examples/VerificationWorkflowExamples";
import MainLayout from "./components/layout/main-layout";
import TransactionsPage from "./pages/dashboard/[role]/transactions/transactions-page";
import { getSession } from "./utility/session";
import InvestorProfilePage from "./pages/dashboard/user/profile/page";
import ProfileEditPage from "./pages/dashboard/user/profile/edit/page";
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
  const user = getSession("user")


  let role: string = "user"; // Default role

  // Determine the actual role based on session structure {MSME: null}, {Investor: null}, {Admin: null}
  if (user?.role && "MSME" in user.role) {
    role = "msme";
  } else if (user?.role && "Investor" in user.role) {
    role = "user";
  } else if (user?.role && "Admin" in user.role) {
    role = "admin";
  } else if (user?.role && "Verify" in user.role) {
    role = "verify";
  }
  return (
    <>

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <AnimatePresence mode="wait">

        {/* <Navbar /> */}
        {!loading && (
          <Routes location={location} key={location.pathname}>
            {/* DEFAULT PAGES SECTION */}

            <Route path="/" element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            } />

            {/* Auth Pages */}
            <Route
              path="/auth"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MainLayout>
                    <AuthPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/internet-identity"
              element={
                <MainLayout>
                  <InternetIdentityPage />
                </MainLayout>
              }
            />

            {/* Marketplace Pages */}
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MainLayout>
                    <MarketplacePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* MSME Registration Pages */}
            <Route
              path="/msme-registration"
              element={
                <MainLayout>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MSMERegistrationPage />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            {/* MSME Profile Pages */}
            <Route
              path="/msme/:id"
              element={
                <MainLayout>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MSMEProfilePage />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            <Route
              path="/msme-registration/documents"
              element={
                <MainLayout>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <DocumentsPage />
                  </ProtectedRoute>
                </MainLayout>
              }
            />

            {/* Dashboard Msme Pages */}
            <Route
              path="/dashboard/msme"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MSMEDashboardPage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/msme/create-nft"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CreateNFTPage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/msme/profile"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EditMSMEProfilePage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />

            <Route
              path="/m"
              element={
                <DashboardLayout navItems={msmeNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <VerificationWorkflowDashboard />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />
            {/* Dashboard Investor Pages */}
            <Route
              path="/dashboard/user"
              element={
                <DashboardLayout navItems={investorNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <InvestorDashboardPage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/user/portfolio"
              element={
                <DashboardLayout navItems={investorNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <InvestorPortfolioPage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/user/profile/edit"
              element={
                <DashboardLayout navItems={investorNavItems}>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProfileEditPage />
                  </ProtectedRoute>
                </DashboardLayout>
              }
            />
            {/* Verify Dashboard */}
            <Route
              path="/dashboard/verify"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <VerificationDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/verify/msme/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MSMEVerificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/verify/revenue/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <RevenueVerificationPage />
                </ProtectedRoute>
              }
            />
            {/* Admin Pages */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DashboardLayout navItems={adminNavItems}>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:role/transactions"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DashboardLayout navItems={role === "user" ? investorNavItems : role === "msme" ? msmeNavItems : role === "admin" ? adminNavItems : []}>

                    <TransactionsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* User Profile Pages */}
            <Route
              path="/dashboard/user/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DashboardLayout navItems={investorNavItems}>
                    <InvestorProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
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
