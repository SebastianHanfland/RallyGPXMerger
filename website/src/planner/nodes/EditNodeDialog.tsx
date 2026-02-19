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
import { getColorFromUuid } from '../../utils/colorUtil.ts';

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
    const { totalCount, branchTracks } = branchesAtNode;

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
                            <div key={segmentId} className={'my-4'}>
                                {tracks.map((track) => (
                                    <span
                                        title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                                            id: 'msg.trackPeople',
                                        })}`}
                                        style={{ backgroundColor: getColorFromUuid(track.id), cursor: 'pointer' }}
                                        className={'rounded-2 p-1'}
                                    >
                                        {track.name}
                                    </span>
                                ))}
                            </div>
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
                                    {tracks.map((track) => (
                                        <ProgressBar
                                            now={((track.peopleCount ?? 0) / totalCount) * 100}
                                            title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                                                id: 'msg.trackPeople',
                                            })}`}
                                            key={1}
                                            style={{ cursor: 'pointer', background: getColorFromUuid(track.id) }}
                                        />
                                    ))}
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
