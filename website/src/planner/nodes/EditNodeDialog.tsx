import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getNodeEditInfo, getNodeSpecifications, nodesActions } from '../store/nodes.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchesAtNode, getBranchTracks } from './getBranchesAtNode.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { NodeSpecification, TrackComposition } from '../store/types.ts';
import { getParticipantsDelay } from '../store/settings.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';

const getAllParticipants = (tracks: TrackComposition[]): number => {
    let count = 0;
    tracks.forEach((track) => {
        count += track.peopleCount ?? 0;
    });
    return count;
};

function getNodeDelayValue(numberValue: number, tracks: TrackComposition[], total: number) {
    const maximum = (total ?? 0) - getAllParticipants(tracks);
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
    const branchNumbers = useSelector(getBranchNumbersSelector);

    const [nodeSpecs, setNodeSpecs] = useState<NodeSpecification | undefined>(undefined);
    const storedNodeSpecs = useSelector(getNodeSpecifications);
    const direction = intl.formatMessage({ id: 'msg.direction' });

    const foundNodeSpec =
        storedNodeSpecs && nodeEditInfo?.segmentAfterId ? storedNodeSpecs[nodeEditInfo?.segmentAfterId] : undefined;

    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo?.segmentAfterId);

    const dispatch: AppDispatch = useDispatch();

    const closeModal = () => {
        dispatch(nodesActions.setNodeEditInfo(undefined));
    };

    const aggregated = true;

    const saveNodeSpecifications = () => {
        dispatch(nodesActions.setNodeSpecification({ segmentAfter: nodeEditInfo?.segmentAfterId, nodeSpecs }));
        closeModal();
    };
    const resetNodeSpecs = () => {
        dispatch(
            nodesActions.setNodeSpecification({
                segmentAfter: nodeEditInfo?.segmentAfterId,
                nodeSpecs: undefined,
            })
        );
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

    let total = 0;
    Object.values(branchTracks).forEach((bTracks) => {
        total += branchNumbers[getBranchId(bTracks.map(({ id }) => id))];
    });
    console.log({ total });

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        <FormattedMessage id={'msg.editNode'} />
                        {foundNodeSpec && <FormattedMessage id={'msg.nodeSpecActive'} />}
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>{`<= ${direction}`}</div>
                {Object.entries(branchTracks).map(([segmentId, tracks]) => {
                    const shiftOffset = (offSet: number) => () => {
                        const newValue = getNodeDelayValue(
                            (nodeSpecs?.trackOffsets[segmentId] ?? 0) + offSet,
                            tracks,
                            total
                        );
                        setNodeSpecs({
                            ...nodeSpecs,
                            trackOffsets: { ...nodeSpecs?.trackOffsets, [segmentId]: newValue },
                        });
                    };
                    return (
                        <>
                            <div key={segmentId} className={'mt-5'}>
                                {tracks.map((track) => (
                                    <span
                                        key={track.id}
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
                                        values={{
                                            seconds: formatNumber(
                                                nodeSpecs.trackOffsets[segmentId] * participantsDelay,
                                                0
                                            ),
                                        }}
                                    />
                                </span>
                            </div>
                            <div
                                key={segmentId + '2'}
                                style={{ display: 'flex', justifyContent: 'row', alignItems: 'flex-end' }}
                            >
                                <div key={segmentId + '3'}>
                                    <Button size={'sm'} onClick={shiftOffset(-100000000)}>
                                        {'<-'}
                                    </Button>
                                </div>
                                <ProgressBar key={segmentId} className={'flex-fill mx-2'} style={{ height: '30px' }}>
                                    <ProgressBar
                                        now={(nodeSpecs.trackOffsets[segmentId] / total) * 100}
                                        variant={'gray'}
                                        className={'bg-transparent'}
                                        style={{ height: '20px' }}
                                        visuallyHidden
                                        key={0}
                                    />
                                    {aggregated && (
                                        <ProgressBar
                                            now={
                                                ((branchNumbers[getBranchId(tracks.map(({ id }) => id))] ?? 0) /
                                                    total) *
                                                100
                                            }
                                            style={{ cursor: 'pointer', background: getColor({ id: segmentId }) }}
                                        />
                                    )}

                                    {!aggregated &&
                                        tracks.map((track) => (
                                            <ProgressBar
                                                now={((track.peopleCount ?? 0) / total) * 100}
                                                title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
                                                    id: 'msg.trackPeople',
                                                })}`}
                                                key={track.id}
                                                style={{ cursor: 'pointer', background: getColor(track) }}
                                            />
                                        ))}
                                </ProgressBar>
                                <div key={segmentId + '4'}>
                                    <Button size={'sm'} onClick={shiftOffset(100000000)}>
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
                                                const newValue = getNodeDelayValue(getCount(value) ?? 0, tracks, total);
                                                setNodeSpecs({
                                                    ...nodeSpecs,
                                                    trackOffsets: { ...nodeSpecs?.trackOffsets, [segmentId]: newValue },
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
                {foundNodeSpec && (
                    <Button variant="danger" onClick={resetNodeSpecs}>
                        <FormattedMessage id={'msg.reset'} />
                    </Button>
                )}
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
