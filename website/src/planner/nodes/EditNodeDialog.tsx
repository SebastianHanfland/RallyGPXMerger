import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getNodeEditInfo, getNodeSpecifications, nodesActions } from '../store/nodes.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { useEffect, useState } from 'react';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchesAtNode, getBranchTracks } from './getBranchesAtNode.ts';
import { NodeSpecification } from '../store/types.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { EditNodeDialogContent } from './EditNodeDialogConten.tsx';

export const EditNodeDialog = () => {
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const trackCompositions = useSelector(getTrackCompositions);
    const branchesAtNode = useSelector(getBranchesAtNode);
    const branchNumbers = useSelector(getBranchNumbersSelector);

    const [nodeSpecs, setNodeSpecs] = useState<NodeSpecification | undefined>(undefined);
    const storedNodeSpecs = useSelector(getNodeSpecifications);

    const foundNodeSpec =
        storedNodeSpecs && nodeEditInfo?.segmentAfterId ? storedNodeSpecs[nodeEditInfo?.segmentAfterId] : undefined;

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
                <EditNodeDialogContent nodeSpecs={nodeSpecs} setNodeSpecs={setNodeSpecs} />
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
