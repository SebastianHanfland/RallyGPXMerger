import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getNodeEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { ProgressBar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { listAllNodesOfTracks } from '../logic/calculate/helper/nodeFinder.ts';
import { getInitialTrackOffsetsAtNode, getTracksAtNode } from './getInitialOffsetForNodeInfo.tsx';

interface NodeSpecifications {
    trackOffsets: Record<string, number>;
    nodeInfo?: string;
    totalCount: number;
}

export const EditNodeDialog = () => {
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
    const initialOffset = useSelector(getInitialTrackOffsetsAtNode);
    const [trackOffsets, setTrackOffsets] = useState<NodeSpecifications | undefined>(initialOffset);

    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo?.segmentAfterId);

    console.log(trackNodes, nodeEditInfo?.segmentAfterId);
    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(trackMergeActions.setNodeEditInfo(undefined));
    };
    useEffect(() => {
        setTrackOffsets(initialOffset);
    }, [initialOffset]);

    if (!nodeEditInfo || !foundTrackNode) {
        return null;
    }
    const tracksAtNode = getTracksAtNode(foundTrackNode, trackCompositions);

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
                    tracksAtNode.map((track) => {
                        if (!trackOffsets) {
                            return null;
                        }
                        return (
                            <>
                                <div key={track.id}>{track.name}</div>
                                <div key={track.id + '2'} style={{ display: 'flex', justifyContent: 'row' }}>
                                    <Button size={'sm'}>{'<-'}</Button>
                                    <ProgressBar key={track.name} className={'flex-fill'}>
                                        <ProgressBar
                                            now={(trackOffsets.trackOffsets[track.id] / trackOffsets.totalCount) * 100}
                                            variant={'gray'}
                                            className={'bg-transparent'}
                                            visuallyHidden
                                            key={0}
                                        />
                                        <ProgressBar
                                            striped
                                            variant="success"
                                            now={((track.peopleCount ?? 0) / trackOffsets.totalCount) * 100}
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
