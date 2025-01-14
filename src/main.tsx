import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router"; // react-router-dom doğru import edilmeli
import "./index.css";
import App from "./App.tsx";
import Login from "@/pages/login.tsx";
import Mycard from "./pages/mycard.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import { PrimeReactProvider } from "primereact/api";

const queryClient = new QueryClient();

function MainApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <App />
                </PrivateRoute>
              }
            />
            <Route
              path="product/:id"
              element={
                <PrivateRoute>
                  <ProductDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="my-card"
              element={
                <PrivateRoute>
                  <Mycard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<MainApp />);
