import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import AppShell from "./components/AppShell";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    input, button, textarea, select {
        font: inherit;
    }

    p, h1, h2, h3, h4, h5, h6 {
        overflow-wrap: break-word;
    }

    p {
        text-wrap: pretty;
    }

    h1, h2, h3, h4, h5, h6 {
        text-wrap: balance; 
    }

    #root {
        isolation: isolate;
    }
`;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <GlobalStyle />
            <AppShell>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/products" replace />}
                    />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    </StrictMode>
);
