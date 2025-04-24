import { Card } from 'react-bootstrap';
import { ReactNode } from 'react';

const cardStyle = {
    style: { minWidth: '12rem', minHeight: '20rem', cursor: 'pointer' },
    className: 'startPageCard shadow p-1 m-1',
    role: 'button',
};

const imageStyle = { height: '7rem', width: '7rem' };

interface Props {
    onClick: () => void;
    title: ReactNode;
    text: ReactNode;
    icon: string;
}

export const WizardCard = ({ text, title, onClick, icon }: Props) => {
    return (
        <Card {...cardStyle} onClick={onClick}>
            <Card.Body>
                <img src={icon} className="m-1" alt="" style={imageStyle} color={'#ffffff'} />
                <Card.Title className={'mt-3'}>{title}</Card.Title>
                <Card.Text style={{ minHeight: '3rem' }}>{text}</Card.Text>
            </Card.Body>
        </Card>
    );
};
