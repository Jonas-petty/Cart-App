import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.header`
    background-color: #111827;
    color: #f9fafb;
    padding: 1rem;
`;

const Inner = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled(Link)`
    font-weight: 700;
    font-size: 1rem;
    text-decoration: none;
    color: inherit;
`;

const Nav = styled.nav`
    display: flex;
    gap: 1rem;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
    text-decoration: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    color: ${({ $active }) => ($active ? "#111827" : "#e5e7eb")};
    background-color: ${({ $active }) => ($active ? "#f9fafb" : "transparent")};
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
        background-color: ${({ $active }) => ($active ? "#e5e7eb" : "#1f2937")};
    }
`;

function Header() {
    const location = useLocation();
    return (
        <Container>
            <Inner>
                <Logo to="/products">Ecommerce</Logo>
                <Nav>
                    <NavLink
                        to="/products"
                        $active={location.pathname.startsWith("/products")}
                    >
                        Produtos
                    </NavLink>
                    <NavLink
                        to="/orders"
                        $active={location.pathname.startsWith("/orders")}
                    >
                        Meus pedidos
                    </NavLink>
                </Nav>
            </Inner>
        </Container>
    );
}

export default Header;
