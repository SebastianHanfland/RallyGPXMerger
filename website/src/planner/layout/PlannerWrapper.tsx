import { Container } from 'react-bootstrap';
import { AppHeader } from './Header.tsx';
import { MergeAndMap } from './MergeAndMap.tsx';
import { AppFooter } from './Footer.tsx';
import { FloatingInfoButton } from '../FloatingInfoButton.tsx';
import { Dashboard } from './dashboard/Dashboard.tsx';

export function PlannerWrapper() {
    return (
        <>
            <div className={'canvas-wrapper'} style={{ left: '30px', position: 'fixed', overflow: 'auto' }}>
                <Container fluid className={'m-0'}>
                    <AppHeader />
                    <MergeAndMap />
                    <AppFooter />
                </Container>
            </div>
            <FloatingInfoButton />
            <Dashboard />
        </>
    );
}
