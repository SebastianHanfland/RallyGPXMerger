import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getNodeEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import { ProgressBar } from 'react-bootstrap';
import { useState } from 'react';
import { sumUpAllPeopleWithHigherPriority } from '../logic/calculate/helper/peopleDelayCounter.ts';
import { listAllNodesOfTracks } from '../logic/calculate/helper/nodeFinder.ts';
import { getTracksAtNode } from '../tracks/TrackSelectionNodeButton.tsx';

interface NodeSpecifications {
    trackOffsets: Record<string, number>;
    nodeInfo?: string;
}

export const EditNodeDialog = () => {
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
    const [trackOffsets, setTrackOffsets] = useState<NodeSpecifications>();
    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo?.segmentAfterId);

    console.log(trackNodes, nodeEditInfo?.segmentAfterId);
    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(trackMergeActions.setNodeEditInfo(undefined));
    };

    if (!nodeEditInfo || !foundTrackNode) {
        return null;
    }
    const tracksAtNode = getTracksAtNode(foundTrackNode, trackCompositions);

    let totalCount = 0;
    const countInfo = tracksAtNode.map((track) => {
        totalCount = totalCount + (track?.peopleCount ?? 0);
        const peopleBefore = sumUpAllPeopleWithHigherPriority(trackCompositions, foundTrackNode, track.id);
        return { id: track.id, name: track.name, peopleCount: track.peopleCount ?? 0, initialOffset: peopleBefore };
    });

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
                {foundTrackNode &&
                    countInfo.map((track) => {
                        return (
                            <>
                                <div>{track.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'row' }}>
                                    <Button size={'sm'}>{'<-'}</Button>
                                    <ProgressBar key={track.name} className={'flex-fill'}>
                                        <ProgressBar
                                            now={(track.initialOffset / totalCount) * 100}
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
