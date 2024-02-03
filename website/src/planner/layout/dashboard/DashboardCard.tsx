import { ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Done } from './Done.tsx';
import { Warning } from './Warning.tsx';

interface Props {
    text: string;
    done: boolean;
    canBeDone: boolean;
    onClick?: () => void;
    children?: ReactNode;
    childrenOnly?: boolean;
}

export function DashboardCard({ text, done, canBeDone, onClick, children, childrenOnly }: Props) {
    return (
        <Row>
            <Col>
                <Card
                    style={{
                        cursor: 'pointer',
                        backgroundColor: done ? 'lightgreen' : canBeDone ? undefined : 'lightsalmon',
                    }}
                    className={'startPageCard shadow m-2 p-2'}
                    onClick={onClick}
                >
                    {!childrenOnly && (
                        <div className={'d-flex justify-content-between'}>
                            <b>{text}</b>
                            {done && <Done />}
                            {!done && !canBeDone && <Warning />}
                            {children && children}
                        </div>
                    )}
                    {childrenOnly && children && children}
                </Card>
            </Col>
        </Row>
    );
}
