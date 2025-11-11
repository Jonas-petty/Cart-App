import { useState } from "react";
import { useCart } from "../service/CartContext";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";
import styled from "styled-components";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const Container = styled.div`
    background-color: #ffffff;
    border-radius: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Title = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
`;

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 260px;
    overflow-y: auto;
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 1rem;
`;

const ItemName = styled.span`
    font-weight: 500;
`;

const QuantityInput = styled.input`
    width: 60px;
    border-radius: 1rem;
    border: 1px solid #d1d5db;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
`;

const Footer = styled.div`
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const Total = styled.div`
    font-size: 1rem;
    font-weight: 600;
`;

function CartPanel() {
    const { items, total, updateQuantity, removeItem, clear } = useCart();
    const [customerId, setCustomerId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleCheckout() {
        if (!customerId) {
            alert("Informe o ID do cliente.");
            return;
        }

        if (items.length === 0) {
            alert("Carrinho vazio.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                customerId,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };
            const { data } = await api.post("/orders", payload);
            clear();
            navigate(`/orders/${data.id}`);
        } catch (error) {
            console.error(error);
            alert("Não foi possível criar o pedido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <Title>Carrinho</Title>

            {items.length === 0 ? (
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Nenhum item no carrinho
                </span>
            ) : (
                <ItemsList>
                    {items.map((item) => (
                        <ItemRow key={item.productId}>
                            <div>
                                <ItemName>{item.name}</ItemName>
                                <div style={{ fontSize: 12, color: "#6b7280" }}>
                                    R${" "}
                                    {item.unitPrice
                                        .toFixed(2)
                                        .replace(".", ",")}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                <QuantityInput
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(event) =>
                                        updateQuantity(
                                            item.productId,
                                            Number(event.target.value) || 1
                                        )
                                    }
                                />
                                <button
                                    style={{
                                        border: "none",
                                        background: "none",
                                        color: "#9ca3af",
                                        fontSize: 11,
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    }}
                                    onClick={() => removeItem(item.productId)}
                                >
                                    remover
                                </button>
                            </div>
                        </ItemRow>
                    ))}
                </ItemsList>
            )}

            <Footer>
                <Total>Total: R$ {total.toFixed(2).replace(".", ",")}</Total>

                <Label htmlFor="customer-id">ID do cliente</Label>
                <Input
                    id="customer-id"
                    placeholder="Cole aqui o ID do cliente"
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                />

                <Button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                >
                    {loading ? "Criando pedido..." : "Finalizar pedido"}
                </Button>
            </Footer>
        </Container>
    );
}

export default CartPanel;
