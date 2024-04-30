import { Card } from 'react-bootstrap';
import { ReactNode } from 'react';

const cardStyle = {
    style: { minWidth: '18rem', minHeight: '30rem', cursor: 'pointer' },
    className: 'startPageCard shadow m-2',
};

const imageStyle = { height: '10rem', width: '10rem' };

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
                <img src={icon} className="m-1" alt="start new plan" style={imageStyle} color={'#ffffff'} />
                <Card.Title className={'mt-3'}>{title}</Card.Title>
                <Card.Text style={{ minHeight: '3rem' }}>{text}</Card.Text>
            </Card.Body>
        </Card>
    );
};
