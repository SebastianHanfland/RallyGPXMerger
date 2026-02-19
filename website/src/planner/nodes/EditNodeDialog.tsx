import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getNodeEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { listAllNodesOfTracks } from '../logic/calculate/helper/nodeFinder.ts';
import { getInitialTrackOffsetsAtNode } from './getInitialOffsetForNodeInfo.tsx';
import { getBranchesAtNode } from './getBranchesAtNode.ts';

interface NodeSpecifications {
    trackOffsets: Record<string, number>;
    nodeInfo?: string;
    totalCount: number;
}

export const EditNodeDialog = () => {
    const intl = useIntl();
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
    const branchesAtNode = useSelector(getBranchesAtNode);
    const initialOffset = useSelector(getInitialTrackOffsetsAtNode);
    const [nodeSpecs, setNodeSpecs] = useState<NodeSpecifications | undefined>(initialOffset);

    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo?.segmentAfterId);

    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(trackMergeActions.setNodeEditInfo(undefined));
    };
    useEffect(() => {
        if (branchesAtNode) {
            setNodeSpecs({ totalCount: branchesAtNode.totalCount, trackOffsets: branchesAtNode.branchOffsets });
        } else {
            setNodeSpecs(undefined);
        }
    }, [branchesAtNode]);

    if (!nodeEditInfo || !foundTrackNode || !branchesAtNode || !nodeSpecs) {
        return null;
    }
    const { totalCount, branchParticipants, branchTracks } = branchesAtNode;

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editNode'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(branchTracks).map(([segmentId, tracks]) => {
                    return (
                        <>
                            <div key={segmentId}>{tracks.map((track) => track.name).join(', ')}</div>
                            <div key={segmentId + '2'} style={{ display: 'flex', justifyContent: 'row' }}>
                                <Button size={'sm'}>{'<-'}</Button>
                                <ProgressBar key={segmentId} className={'flex-fill'}>
                                    <ProgressBar
                                        now={(nodeSpecs.trackOffsets[segmentId] / totalCount) * 100}
                                        variant={'gray'}
                                        className={'bg-transparent'}
                                        visuallyHidden
                                        key={0}
                                    />
                                    <ProgressBar
                                        striped
                                        variant="success"
                                        now={(branchParticipants[segmentId] / totalCount) * 100}
                                        key={1}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </ProgressBar>
                                <Button size={'sm'}>{'->'}</Button>
                                <div>
                                    <Form.Control
                                        type="text"
                                        placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                                        defaultValue={nodeSpecs.trackOffsets[segmentId]}
                                        onChange={(value) => {
                                            setNodeSpecs({
                                                ...nodeSpecs,
                                                trackOffsets: {
                                                    ...nodeSpecs?.trackOffsets,
                                                    [segmentId]: Number(value.target.value),
                                                },
                                            });
                                        }}
                                    />
                                </div>
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
