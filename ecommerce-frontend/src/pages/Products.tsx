import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCart } from "../service/CartContext";
import { api } from "../service/api";
import ProductCard from "../components/ProductCard";
import CartPanel from "../components/domain/CartPanel";
import type { Product } from "../types";

const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 340px);
    gap: 1rem;

    @media (max-width: 880px) {
        grid-template-columns: minmax(0 1fr);
    }
`;

const Grid = styled.div`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;

const Title = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1rem;
`;

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addItem } = useCart();

    useEffect(() => {
        try {
            api.get("/products").then(({ data }) =>
                setProducts(
                    data.map((product: any) => ({
                        ...product,
                        price: Number(product.price),
                    }))
                )
            );
        } catch (error) {
            console.error(error);
            setError("Não foi possível carregar os produtos");
        } finally {
            setLoading(false);
        }
    }, []);
    return (
        <>
            <Title>Produtos</Title>
            <Layout>
                <div>
                    {loading && <p>Carregando produtos...</p>}
                    {error && (
                        <p style={{ color: "#b91c1c", fontSize: 14 }}>
                            {error}
                        </p>
                    )}
                    {!loading && !error && products.length === 0 && (
                        <p style={{ fontSize: 14, color: "#6b7280" }}>
                            Nehum produto cadastrado.
                        </p>
                    )}
                    {!loading && !error && products.length > 0 && (
                        <Grid>
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() =>
                                        addItem(
                                            {
                                                productId: product.id,
                                                name: product.name,
                                                unitPrice: Number(
                                                    product.price
                                                ),
                                            },
                                            1
                                        )
                                    }
                                />
                            ))}
                        </Grid>
                    )}
                </div>

                <CartPanel />
            </Layout>
        </>
    );
}

export default Products;
