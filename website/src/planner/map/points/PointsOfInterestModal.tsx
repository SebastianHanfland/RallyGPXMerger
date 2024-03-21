import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getContextMenuPoint, getEditPointOfInterest, pointsActions } from '../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { PointOfInterest, PointOfInterestType } from '../../store/types.ts';
import { useEffect, useState } from 'react';
import { PointsOfInterestForm } from './PointsOfInterestForm.tsx';

export function PointsOfInterestModal() {
    const dispatch = useDispatch();
    const markedPoint = useSelector(getContextMenuPoint);
    const hasMarkedPoint = !!markedPoint;
    const editPointOfInterest = useSelector(getEditPointOfInterest);

    const [pointOfInterestValues, setPointOfInterestValues] = useState<Partial<PointOfInterest>>({});

    useEffect(() => {
        if (editPointOfInterest) {
            setPointOfInterestValues(editPointOfInterest);
        }
    }, [editPointOfInterest]);

    const closeModal = () => {
        dispatch(pointsActions.setContextMenuPoint(undefined));
        setPointOfInterestValues({});
    };
    const savePoint = () => {
        if (!markedPoint) {
            return;
        }
        // TODO validation?
        if (editPointOfInterest) {
            dispatch(pointsActions.updatePoint(pointOfInterestValues as PointOfInterest));
        } else {
            const newPoint: PointOfInterest = {
                ...markedPoint,
                id: uuidv4(),
                title: pointOfInterestValues?.title ?? '',
                description: pointOfInterestValues?.description ?? '',
                radiusInM: pointOfInterestValues?.radiusInM ?? 0,
                type: pointOfInterestValues?.type ?? PointOfInterestType.OTHER,
            };
            dispatch(pointsActions.addPoint(newPoint));
        }
        dispatch(pointsActions.setContextMenuPoint(undefined));
        dispatch(pointsActions.setEditPointOfInterest(undefined));
        setPointOfInterestValues({});
    };
    return (
        <Modal show={hasMarkedPoint} onHide={closeModal} backdrop="static" keyboard={false}>
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
                <Button variant="primary" onClick={savePoint}>
                    <FormattedMessage id={'msg.confirm'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
