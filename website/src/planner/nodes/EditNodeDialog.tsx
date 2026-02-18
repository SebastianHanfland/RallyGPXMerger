import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getNodeEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import { ProgressBar } from 'react-bootstrap';

export const EditNodeDialog = () => {
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const nodes = useSelector(getNodePositions);
    const trackCompositions = useSelector(getTrackCompositions);

    const foundNode = nodes.find((node) => node.segmentIdAfter === nodeEditInfo?.segmentAfterId);

    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(trackMergeActions.setNodeEditInfo(undefined));
    };

    if (!nodeEditInfo || !foundNode) {
        return null;
    }

    let totalCount = 0;
    const countInfo = foundNode.tracks.map((track) => {
        const found = trackCompositions.find((trackComp) => trackComp.name === track);
        totalCount = totalCount + (found?.peopleCount ?? 0);
        return { id: found?.id, name: track, peopleCount: found?.peopleCount ?? 0 };
    });

    // sumUpAllPeopleWithHigherPriority
    // For the default situation: calculate the ones with higher priority
    // allow setting of offset, via buttons and a number input
    // if specified use these times on the nodes instead of the ones originating from the people counter
    // allow displaying of merging tracks without time difference

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editNode'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {foundNode &&
                    countInfo.map((track, index) => {
                        return (
                            <>
                                <div>{track.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'row' }}>
                                    <Button size={'sm'}>{'<-'}</Button>
                                    <ProgressBar key={track.name} className={'flex-fill'}>
                                        <ProgressBar
                                            now={index * 3}
                                            variant={'gray'}
                                            className={'bg-transparent'}
                                            visuallyHidden
                                            key={0}
                                        />
                                        <ProgressBar
                                            striped
                                            variant="success"
                                            now={(track.peopleCount / totalCount) * 100}
                                            key={1}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </ProgressBar>
                                    <Button size={'sm'}>{'->'}</Button>
                                </div>
                            </>
                        );
                    })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                <Button variant="primary" onClick={() => 1}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
