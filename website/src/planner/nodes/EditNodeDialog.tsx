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
import { NodeSpecification } from '../store/types.ts';

export const EditNodeDialog = () => {
    const intl = useIntl();
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
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
                            <div key={segmentId} className={'my-4'}>
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
                            </div>
                            <div key={segmentId + '2'} style={{ display: 'flex', justifyContent: 'row' }}>
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
                                <ProgressBar key={segmentId} className={'flex-fill'}>
                                    <ProgressBar
                                        now={(nodeSpecs.trackOffsets[segmentId] / nodeSpecs.totalCount) * 100}
                                        variant={'gray'}
                                        className={'bg-transparent'}
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
                                <div>
                                    <Form.Control
                                        type="text"
                                        placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                                        value={nodeSpecs.trackOffsets[segmentId]}
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
                <Button variant="primary" onClick={saveNodeSpecifications}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
