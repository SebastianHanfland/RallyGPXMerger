import { Carousel } from 'react-bootstrap';
import SimulationGif from '../../assets/Simulation1.gif';
import Modal from 'react-bootstrap/Modal';

interface Props {
    closeModal: () => void;
}

export function TutorialModal({ closeModal }: Props) {
    return (
        <Modal show={true} onHide={closeModal} backdrop="static" keyboard={false} size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>{'How to use'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Carousel>
                    <Carousel.Item>
                        <img src={SimulationGif} alt="Simulation1" />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={SimulationGif} alt="Simulation1" />
                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={SimulationGif} alt="Simulation1" />
                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}
