import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/products" element={<Product />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
