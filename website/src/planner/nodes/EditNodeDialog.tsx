import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getNodeEditInfo, getNodeSpecifications, nodesActions } from '../store/nodes.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { useEffect, useState } from 'react';
import { getBranchesAtNode } from './getBranchesAtNode.ts';
import { NodeSpecification } from '../store/types.ts';
import { EditNodeDialogContent } from './EditNodeDialogContent.tsx';

export const EditNodeDialog = () => {
    const intl = useIntl();
    const nodeEditInfo = useSelector(getNodeEditInfo);
    const branchesAtNode = useSelector(getBranchesAtNode);
    const storedNodeSpecs = useSelector(getNodeSpecifications);
    const [nodeSpecs, setNodeSpecs] = useState<NodeSpecification | undefined>(undefined);
    const dispatch: AppDispatch = useDispatch();

    const segmentAfter = nodeEditInfo?.segmentAfterId;

    const foundNodeSpec = storedNodeSpecs && segmentAfter ? storedNodeSpecs[segmentAfter] : undefined;

    const closeModal = () => {
        dispatch(nodesActions.setNodeEditInfo(undefined));
    };

    const saveNodeSpecifications = () => {
        dispatch(nodesActions.setNodeSpecification({ segmentAfter, nodeSpecs }));
        closeModal();
    };
    const resetNodeSpecs = () => {
        dispatch(nodesActions.setNodeSpecification({ segmentAfter, nodeSpecs: undefined }));
    };

    useEffect(() => {
        if (branchesAtNode) {
            setNodeSpecs({ totalCount: branchesAtNode.totalCount, trackOffsets: branchesAtNode?.trackOffsets });
        } else {
            setNodeSpecs(undefined);
        }
    }, [branchesAtNode]);

    if (!nodeEditInfo || !branchesAtNode || !nodeSpecs || !nodeEditInfo.segmentAfterId) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        {intl.formatMessage({ id: 'msg.editNode' })}
                        {foundNodeSpec && ` ${intl.formatMessage({ id: 'msg.nodeSpecActive' })}`}
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EditNodeDialogContent nodeSpecs={nodeSpecs} setNodeSpecs={setNodeSpecs} nodeEditInfo={nodeEditInfo} />
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
