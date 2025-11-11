import styled from "styled-components";
import { Card } from "./Card";
import { Button } from "./Button";

const Name = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
`;

const Price = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
`;

const Stock = styled.div`
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 10px;
`;

function ProductCard({ product, onAddToCart }: any) {
    return (
        <Card>
            <Name>{product.name}</Name>
            <Price>
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
            </Price>
            <Stock>Em estoque: {product.stock}</Stock>
            <Button onClick={onAddToCart} disabled={product.stock <= 0}>
                {product.stock > 0 ? "Adicionar ao carrinho" : "Indisponível"}
            </Button>
        </Card>
    );
}

export default ProductCard;
