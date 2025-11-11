import styled from "styled-components";
import Header from "./Header";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Main = styled.main`
    flex: 1;
    padding: 2rem 1rem;
    max-width: 1120px;
    margin: 0 auto;
    width: 100%;
`;

function AppShell({ children }: any) {
    return (
        <Container>
            <Header />
            <Main>{children}</Main>
        </Container>
    );
}

export default AppShell;
