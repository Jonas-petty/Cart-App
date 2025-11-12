import { useState } from "react";
import styled from "styled-components";
import { api } from "../service/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import OrderStatusBadge from "../components/domain/OrderStatusBadge";
import { Link } from "react-router-dom";
import type { Order } from "../types";

const Title = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1rem;
`;

const FormRow = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    @media (max-width: 640px) {
        flex-direction: column;
    }
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const OrderMeta = styled.div`
    font-size: 0.75rem;
    color: #6b7280;
`;

function Orders() {
    const [customerId, setCustomerId] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch(event: React.FormEvent) {
        event.preventDefault();

        if (!customerId) {
            alert("Informe o ID do cliente.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/customers/${customerId}/orders`);
            setOrders(
                data.map((order: any) => ({
                    ...order,
                    items: order.items.map((item: any) => ({
                        ...item,
                        unitPrice: Number(item.unitPrice),
                    })),
                }))
            );
        } catch (error) {
            console.error(error);
            setError("Não foi possível carregar os pedidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Title>Meus Pedidos</Title>
            <form onSubmit={handleSearch}>
                <FormRow>
                    <Input
                        placeholder="ID do cliente"
                        value={customerId}
                        onChange={(event) => setCustomerId(event.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Buscando..." : "Buscar pedidos"}
                    </Button>
                </FormRow>
            </form>
            {error && (
                <p style={{ color: "#b91c1c", fontSize: 14, marginBottom: 10 }}>
                    {error}
                </p>
            )}

            <List>
                {orders.length === 0 && !loading && !error && (
                    <span style={{ fontSize: 14, color: "#6b7280" }}>
                        Nenhum pedido encontrado para esse cliente.
                    </span>
                )}

                {orders.map((order) => {
                    const total = order.items.reduce(
                        (acc, item) =>
                            acc + Number(item.unitPrice) * item.quantity,
                        0
                    );
                    const date = new Date(order.createdAt).toLocaleString();
                    return (
                        <Card key={order.id}>
                            <OrderHeader>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Pedido #{order.id.slice(0, 8)}
                                    </span>
                                    <OrderMeta>criado em {date}</OrderMeta>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </OrderHeader>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: 13,
                                }}
                            >
                                <div>
                                    {order.items.length} itens - Total: R${" "}
                                    {total.toFixed(2).replace(".", ",")}
                                </div>
                                <Link
                                    to={`/orders/${order.id}`}
                                    style={{
                                        fontSize: 13,
                                        textDecoration: "none",
                                        color: "#111827",
                                        borderRadius: 999,
                                        padding: "4px 10px",
                                        border: "1px solid #d1d5db",
                                    }}
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </Card>
                    );
                })}
            </List>
        </>
    );
}

export default Orders;
