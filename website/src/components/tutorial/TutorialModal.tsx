import { Carousel } from 'react-bootstrap';
import UploadGpxSegments from '../../assets/pics/UploadGpxSegments.png';
import TrackCompositions from '../../assets/pics/TrackComposition.png';
import RallyParameters from '../../assets/pics/RallyParameters.png';
import MapSettings from '../../assets/pics/MapSettings.png';
import Simulation from '../../assets/pics/Simulation.gif';
import MergeAndDownload from '../../assets/pics/MergeAndDownload.png';
import Modal from 'react-bootstrap/Modal';

interface Props {
    closeModal: () => void;
}

export function TutorialModal({ closeModal }: Props) {
    const height = '70vh';
    const divClass = 'd-flex justify-content-center';
    const carouselItemClass = 'text-center';
    return (
        <Modal
            show={true}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
            size={'xl'}
            onEscapeKeyDown={closeModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>{'How to use'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Carousel data-bs-theme="dark">
                    <Carousel.Item className={carouselItemClass}>
                        <h2>1). Upload segments (including some timestamps) of the rally</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={UploadGpxSegments} style={{ height: height }} alt="Upload GPX segments" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item className={carouselItemClass}>
                        <h2>2). Compose tracks from segments and add breaks</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={TrackCompositions} style={{ height: height }} alt="Track Compositions" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item className={carouselItemClass}>
                        <h2>3). Adjust parameters for the calculation</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={RallyParameters} style={{ height: height }} alt="Set rally parameters" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item className={carouselItemClass}>
                        <h2>4). Merge the segments and download the resulting tracks</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={MergeAndDownload} style={{ height: '100px' }} alt="Merge and download" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item className={carouselItemClass}>
                        <h2>5). Start the simulation</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={MapSettings} style={{ height: height }} alt="Settings for map" />
                        </div>
                    </Carousel.Item>
                    <Carousel.Item className={carouselItemClass}>
                        <h2>6). See the simulation on the map</h2>
                        <div className={divClass} style={{ height: height }}>
                            <img src={Simulation} style={{ height: height }} alt="Simulation" />
                        </div>
                    </Carousel.Item>
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}
