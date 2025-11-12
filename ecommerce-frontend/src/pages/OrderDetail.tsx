import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../service/api";
import type { Order } from "../types";
import styled from "styled-components";
import { Card } from "../components/Card";
import OrderStatusBadge from "../components/domain/OrderStatusBadge";

const Title = styled.h1`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
`;

const ItemsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    margin-top: 0.75rem;

    th,
    td {
        padding: 0.5rem 0.25rem;
        text-align: left;
    }

    th {
        border-bottom: 1px solid #e5e7eb;
        font-weight: 500;
        color: #4b5563;
    }

    td {
        border-bottom: 1px solid #f3f4f6;
    }
`;

function OrderDetail() {
    const { id = "" } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: number | undefined;

        async function fetchOrder() {
            try {
                setError(null);
                const { data } = await api.get(`/orders/${id}`);
                const normalized: Order = {
                    ...data,
                    items: data.items.map((item: any) => ({
                        ...item,
                        unitPrice: Number(item.unitPrice),
                    })),
                };
                setOrder(normalized);

                const finalStatuses = [
                    "CONFIRMED",
                    "CANCELLED",
                    "PAYMENT_FAILED",
                ] as const;

                if (
                    finalStatuses.includes(normalized.status as any) &&
                    interval
                ) {
                    window.clearInterval(interval);
                }
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar o pedido");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
        interval = window.setInterval(fetchOrder, 4000);

        return () => {
            if (interval) window.clearInterval(interval);
        };
    }, [id]);

    if (loading && !order) {
        return <p>Carregando pedido...</p>;
    }

    if (error && !order) {
        return <p style={{ color: "#b91c1c" }}>{error}</p>;
    }

    if (!order) {
        return <p>Pedido não encontrado.</p>;
    }

    const total = order.items.reduce(
        (acc, item) => acc + Number(item.unitPrice) * item.quantity,
        0
    );

    return (
        <>
            <Title>Detalhe do pedido</Title>
            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                            Pedido #{order.id.slice(0, 8)}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Cliente: {order.customerId}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Criado em{" "}
                            {new Date(order.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                <ItemsTable>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd.</th>
                            <th>Preço unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => {
                            const subtotal =
                                Number(item.unitPrice) * item.quantity;
                            return (
                                <tr key={item.id}>
                                    <td>{item.productId}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        R${" "}
                                        {Number(item.unitPrice)
                                            .toFixed(2)
                                            .replace(".", ",")}
                                    </td>
                                    <td>
                                        R${" "}
                                        {subtotal.toFixed(2).replace(".", ",")}
                                    </td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td
                                colSpan={3}
                                style={{ textAlign: "right", fontWeight: 600 }}
                            >
                                Total
                            </td>
                            <td style={{ fontWeight: 600 }}>
                                R$ {total.toFixed(2).replace(".", ",")}
                            </td>
                        </tr>
                    </tbody>
                </ItemsTable>

                {order.status === "PENDING_PAYMENT" && (
                    <p
                        style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "#6b7280",
                        }}
                    >
                        Aguardando conclusão do pagamento e validação de
                        estoque...
                    </p>
                )}
            </Card>
        </>
    );
}

export default OrderDetail;
