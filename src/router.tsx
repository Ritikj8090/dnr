import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Home";
import LogIn from "./pages/LoginIn";
import MainLayout from "./MainLayout";
import Test from "./pages/test";
import CredentialGenerator from "./pages/CredentialGenerator";
import BillGenerator from "./pages/billGenerator/BillGenerator";
import OfferLetterGenerator from "./pages/offerLetterGenerator/OfferLetterGenerator";
import Settings from "./pages/Settings";
import ProtectedRoute from "./lib/ProtectedRoute";
import PublicRoute from "./lib/PublicRoute";
import AdminDashboardPage from "./pages/adminDashboard/AdminDashboardPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import QuotationGeneratePage from "./pages/quotationGenerator/QuotationGeneratePage";
import OfferLetterLogs from "./pages/sub-pages/offer-letter-log/OfferLetterLogs";
import QuotaionsLog from "./pages/sub-pages/quotations-log/QuotaionsLog";
import BillsLog from "./pages/sub-pages/bills-log/BillsLog";
import AboutPage from "./pages/about-page";
import ContactUsPage from "./pages/contact-us-page";
import ServicesPage from "./pages/services-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public Route
      {
        path: "login",
        element: (
          <PublicRoute>
            <LogIn />
          </PublicRoute>
        ),
      },
      {
        index: true,
        element: <Home />,
      },

      // Admin-only route
      {
        element: <ProtectedRoute roles={["ADMIN"]} />,
        children: [
          { path: "offer-letter-generator", element: <OfferLetterGenerator /> },
          { path: "offer-letter-generator/:id", element: <OfferLetterGenerator /> },
          { path: "generate-credential", element: <CredentialGenerator /> },
          { path: "users-credentials", element: <AdminDashboardPage /> },
          { path: "offer-letter-log", element: <OfferLetterLogs /> },
          // { path: "quotations-log", element: <QuotaionsLog /> },
          // { path: "bills-log", element: <BillsLog /> },
          // { path: "bill-generator/:id", element: <BillGenerator /> },
        ],
      },

      // Authenticated users (ADMIN, USER, MANAGER)
      {
        element: <ProtectedRoute roles={["ADMIN", "USER", "MANAGER"]} />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "quotation-generator", element: <QuotationGeneratePage /> },
          {
            path: "quotation-generator/:id",
            element: <QuotationGeneratePage />,
          },
          { path: "bill-generator", element: <BillGenerator /> },
          { path: "quotations-log", element: <QuotaionsLog /> },
          { path: "bills-log", element: <BillsLog /> },
          { path: "bill-generator/:id", element: <BillGenerator /> },
          { path: "settings", element: <Settings /> },
        ],
      },

      // Public route (not protected)
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "contact-us",
        element: <ContactUsPage />,
      },

      // Fallback
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export default router;
