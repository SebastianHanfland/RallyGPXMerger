import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getContextMenuPoint, getEditPointOfInterest, pointsActions } from '../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { PointOfInterest } from '../../store/types.ts';
import { useEffect, useState } from 'react';
import { PointsOfInterestForm } from './PointsOfInterestForm.tsx';
import {
    DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M,
    DEFAULT_POINT_OF_INTEREST_TYPE,
} from '../../points/pointOfInterestConfig.ts';

export function PointsOfInterestModal() {
    const dispatch = useDispatch();
    const markedPoint = useSelector(getContextMenuPoint);
    const editPointOfInterest = useSelector(getEditPointOfInterest);
    const hasMarkedPoint = !!markedPoint || !!editPointOfInterest;

    const [pointOfInterestValues, setPointOfInterestValues] = useState<Partial<PointOfInterest>>({});

    useEffect(() => {
        if (editPointOfInterest) {
            setPointOfInterestValues(editPointOfInterest);
        } else if (markedPoint) {
            setPointOfInterestValues({
                type: DEFAULT_POINT_OF_INTEREST_TYPE,
                radiusInM: DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M,
            });
        }
    }, [editPointOfInterest, markedPoint]);

    const closeModal = () => {
        dispatch(pointsActions.setContextMenuPoint(undefined));
        setPointOfInterestValues({});
        dispatch(pointsActions.setEditPointOfInterest(undefined));
    };

    const deletePoint = () => {
        if (editPointOfInterest) {
            dispatch(pointsActions.removePoint(editPointOfInterest.id));
            closeModal();
        }
    };

    const savePoint = () => {
        if (!markedPoint && !editPointOfInterest) {
            return;
        }
        // TODO validation?
        if (editPointOfInterest) {
            dispatch(pointsActions.updatePoint(pointOfInterestValues as PointOfInterest));
        } else if (markedPoint) {
            const newPoint: PointOfInterest = {
                ...markedPoint,
                id: uuidv4(),
                title: pointOfInterestValues?.title ?? '',
                description: pointOfInterestValues?.description ?? '',
                radiusInM: pointOfInterestValues?.radiusInM ?? DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M,
                type: pointOfInterestValues?.type ?? DEFAULT_POINT_OF_INTEREST_TYPE,
            };
            dispatch(pointsActions.addPoint(newPoint));
        }
        dispatch(pointsActions.setContextMenuPoint(undefined));
        dispatch(pointsActions.setEditPointOfInterest(undefined));
        setPointOfInterestValues({});
    };
    return (
        <Modal show={hasMarkedPoint} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.pointOfInterest'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PointsOfInterestForm values={pointOfInterestValues} setValues={setPointOfInterestValues} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                {editPointOfInterest && (
                    <Button variant="danger" onClick={deletePoint}>
                        <FormattedMessage id={'msg.delete'} />
                    </Button>
                )}
                <Button variant="primary" onClick={savePoint}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
