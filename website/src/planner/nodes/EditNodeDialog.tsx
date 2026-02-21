import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getNodeEditInfo, nodesActions } from '../store/nodes.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchesAtNode, getBranchTracks } from './getBranchesAtNode.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { NodeSpecification, TrackComposition } from '../store/types.ts';
import { getParticipantsDelay } from '../store/settings.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';

const getAllParticipants = (tracks: TrackComposition[]): number => {
    let count = 0;
    tracks.forEach((track) => {
        count += track.peopleCount ?? 0;
    });
    return count;
};

function getNodeDelayValue(
    value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    nodeSpecs: {
        trackOffsets: Record<string, number> | undefined;
        nodeInfo?: string | undefined;
        totalCount: number | undefined;
    },
    tracks: TrackComposition[]
) {
    const numberValue = getCount(value) ?? 0;
    const maximum = (nodeSpecs?.totalCount ?? 0) - getAllParticipants(tracks);
    if (numberValue > maximum) {
        return maximum;
    }
    if (numberValue < 0) {
        return 0;
    }
    return numberValue;
}

export const EditNodeDialog = () => {
    const intl = useIntl();
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
    const participantsDelay = useSelector(getParticipantsDelay);
    const branchesAtNode = useSelector(getBranchesAtNode);
    const [nodeSpecs, setNodeSpecs] = useState<NodeSpecification | undefined>(undefined);

    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo?.segmentAfterId);

    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(nodesActions.setNodeEditInfo(undefined));
    };

    const saveNodeSpecifications = () => {
        dispatch(nodesActions.setNodeSpecification({ segmentAfter: nodeEditInfo?.segmentAfterId, nodeSpecs }));
        closeModal();
    };

    useEffect(() => {
        if (branchesAtNode) {
            setNodeSpecs({ totalCount: branchesAtNode.totalCount, trackOffsets: branchesAtNode?.trackOffsets });
        } else {
            setNodeSpecs(undefined);
        }
    }, [branchesAtNode]);

    if (!nodeEditInfo || !foundTrackNode || !branchesAtNode || !nodeSpecs || !nodeEditInfo.segmentAfterId) {
        return null;
    }
    const branchTracks = getBranchTracks(nodeEditInfo.segmentAfterId, trackCompositions);
    if (!branchTracks) {
        return null;
    }

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
                            <div key={segmentId} className={'mt-5'}>
                                {tracks.map((track) => (
                                    <span
                                        title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                                            id: 'msg.trackPeople',
                                        })}`}
                                        style={{ backgroundColor: getColor(track), cursor: 'pointer' }}
                                        className={'rounded-2 p-1'}
                                    >
                                        {track.name}
                                    </span>
                                ))}
                                <span className={'mx-3'}>
                                    <FormattedMessage
                                        id={'msg.offsetByXs'}
                                        values={{ seconds: nodeSpecs.trackOffsets[segmentId] * participantsDelay }}
                                    />
                                </span>
                            </div>
                            <div
                                key={segmentId + '2'}
                                style={{ display: 'flex', justifyContent: 'row', alignItems: 'flex-end' }}
                            >
                                <div>
                                    <Button
                                        size={'sm'}
                                        onClick={() => {
                                            setNodeSpecs({
                                                ...nodeSpecs,
                                                trackOffsets: {
                                                    ...nodeSpecs?.trackOffsets,
                                                    [segmentId]: nodeSpecs?.trackOffsets[segmentId] - 10,
                                                },
                                            });
                                        }}
                                    >
                                        {'<-'}
                                    </Button>
                                </div>
                                <ProgressBar key={segmentId} className={'flex-fill mx-2'} style={{ height: '30px' }}>
                                    <ProgressBar
                                        now={(nodeSpecs.trackOffsets[segmentId] / nodeSpecs.totalCount) * 100}
                                        variant={'gray'}
                                        className={'bg-transparent'}
                                        style={{ height: '20px' }}
                                        visuallyHidden
                                        key={0}
                                    />
                                    {tracks.map((track) => (
                                        <ProgressBar
                                            now={((track.peopleCount ?? 0) / nodeSpecs.totalCount) * 100}
                                            title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                                                id: 'msg.trackPeople',
                                            })}`}
                                            key={1}
                                            style={{ cursor: 'pointer', background: getColor(track) }}
                                        />
                                    ))}
                                </ProgressBar>
                                <div>
                                    <Button
                                        size={'sm'}
                                        onClick={() => {
                                            setNodeSpecs({
                                                ...nodeSpecs,
                                                trackOffsets: {
                                                    ...nodeSpecs?.trackOffsets,
                                                    [segmentId]: nodeSpecs?.trackOffsets[segmentId] + 10,
                                                },
                                            });
                                        }}
                                    >
                                        {'->'}
                                    </Button>
                                </div>
                                <div className={'mx-2'}>
                                    <Form.Group>
                                        <Form.Label>
                                            <FormattedMessage id={'msg.nodeOffset'} />
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                                            value={nodeSpecs.trackOffsets[segmentId]}
                                            onChange={(value) => {
                                                setNodeSpecs({
                                                    ...nodeSpecs,
                                                    trackOffsets: {
                                                        ...nodeSpecs?.trackOffsets,
                                                        [segmentId]: getNodeDelayValue(value, nodeSpecs, tracks),
                                                    },
                                                });
                                            }}
                                        />
                                    </Form.Group>
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
                <Button variant="primary" onClick={saveNodeSpecifications}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
