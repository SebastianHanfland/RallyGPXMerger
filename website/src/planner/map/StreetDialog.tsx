import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { getClickOnStreet, mapActions } from '../store/map.reducer.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getParsedGpxSegments, getNextStreetLookupIndex } from '../store/segmentData.redux.ts';
import { getTrackStreetInfos } from '../calculation/getTrackStreetInfos.ts';
import { TrackWayPointType } from '../logic/resolving/types.ts';
import { getRoutePointReferences, getStreetRange } from '../logic/resolving/streets/streetRangeEditing.ts';
import { beginNewStreet, beginStreetBoundaryEdit } from '../streets/streetEditing.ts';
import { EditStreetNameModal } from '../streets/EditStreetNameButton.tsx';
import { EditDistrictModal } from '../streets/EditDistrictButton.tsx';
import { EditPostCodeModal } from '../streets/EditPostCodeButton.tsx';
import { AppDispatch } from '../store/planningStore.ts';

export const StreetDialog = () => {
    const clickOnStreet = useSelector(getClickOnStreet);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === clickOnStreet?.trackId);
    const trackInfo = useSelector(getTrackStreetInfos).find(({ id }) => id === clickOnStreet?.trackId);
    const segments = useSelector(getParsedGpxSegments);
    const nextStreetLookupIndex = useSelector(getNextStreetLookupIndex);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [editField, setEditField] = useState<'street' | 'district' | 'postCode'>();

    const waypoint = trackInfo?.wayPoints.find(
        (candidate) => candidate.type === TrackWayPointType.Track && candidate.s === clickOnStreet?.streetIndex
    );
    const routePoints = useMemo(() => (track ? getRoutePointReferences(track, segments) : []), [track, segments]);

    const closeModal = () => {
        setEditField(undefined);
        dispatch(mapActions.setClickOnStreet(undefined));
    };

    if (!clickOnStreet || !track || !waypoint) return null;

    const editBoundary = (boundary: 'start' | 'end') => {
        beginStreetBoundaryEdit(dispatch, track, routePoints, waypoint, boundary);
        closeModal();
    };
    const addStreet = (insertionIndex: number) => {
        beginNewStreet(dispatch, nextStreetLookupIndex, track, routePoints, insertionIndex);
        closeModal();
    };
    const streetStart = waypoint.s === undefined ? 0 : (getStreetRange(routePoints, waypoint.s)?.start ?? 0);

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.actionOnStreetClick'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {track.name || track.id}: {waypoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                </p>
                <div className={'d-grid gap-2'}>
                    <Button variant={'outline-primary'} onClick={() => editBoundary('start')}>
                        <FormattedMessage id={'msg.editStreetStart'} />
                    </Button>
                    <Button variant={'outline-primary'} onClick={() => editBoundary('end')}>
                        <FormattedMessage id={'msg.editStreetEnd'} />
                    </Button>
                    <Button variant={'outline-secondary'} onClick={() => addStreet(streetStart)}>
                        <FormattedMessage id={'msg.addStreetBefore'} />
                    </Button>
                    <Button variant={'outline-secondary'} onClick={() => addStreet(streetStart + 1)}>
                        <FormattedMessage id={'msg.addStreetAfter'} />
                    </Button>
                    <Button variant={'outline-secondary'} onClick={() => setEditField('street')}>
                        <FormattedMessage id={'msg.changeStreetName'} />
                    </Button>
                    <Button variant={'outline-secondary'} onClick={() => setEditField('district')}>
                        <FormattedMessage id={'msg.changeDistrict'} />
                    </Button>
                    <Button variant={'outline-secondary'} onClick={() => setEditField('postCode')}>
                        <FormattedMessage id={'msg.changePostCode'} />
                    </Button>
                </div>
                {editField === 'street' && (
                    <EditStreetNameModal
                        waypoint={waypoint}
                        trackId={track.id}
                        closeModal={() => setEditField(undefined)}
                    />
                )}
                {editField === 'district' && (
                    <EditDistrictModal waypoint={waypoint} closeModal={() => setEditField(undefined)} />
                )}
                {editField === 'postCode' && (
                    <EditPostCodeModal waypoint={waypoint} closeModal={() => setEditField(undefined)} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
