import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    getShowBlockStreets,
    getShowCalculatedTracks,
    getShowConstructions,
    getShowGpxSegments,
    getShowMapMarker,
    mapActions,
} from '../store/map.reducer.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getConstructionSegments } from '../store/gpxSegments.reducer.ts';
export function MapContentSelection() {
    const showMapMarker = useSelector(getShowMapMarker);
    const showConstructions = useSelector(getShowConstructions);
    const hasConstructions = useSelector(getConstructionSegments)?.length > 0;
    const showBlockStreets = useSelector(getShowBlockStreets);
    const showCalculatedTracks = useSelector(getShowCalculatedTracks);
    const showGpxSegments = useSelector(getShowGpxSegments);
    const dispatch = useDispatch();
    const calculatedTracks = useSelector(getCalculatedTracks);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Form.Group>
            <Form className={'d-flex'}>
                <Form.Check
                    type={'checkbox'}
                    id={'segments'}
                    className={'m-3'}
                    label={'GPX'}
                    title={'GPX Segments'}
                    checked={showGpxSegments}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowGpxSegments(!showGpxSegments))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'tracks'}
                    className={'m-3'}
                    label={'Tracks'}
                    title={'Calculated Tracks'}
                    checked={showCalculatedTracks}
                    disabled={calculatedTracks.length === 0}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowCalculatedTracks(!showCalculatedTracks))}
                ></Form.Check>
                <Form.Check
                    type={'checkbox'}
                    id={'blocked streets'}
                    className={'m-3'}
                    label={'Streets'}
                    title={'Blocked Streets'}
                    checked={showBlockStreets}
                    disabled={blockedStreetInfos.length === 0}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowBlockStreets(!showBlockStreets))}
                ></Form.Check>
            </Form>
            <Form className={'d-flex'}>
                <Form.Check
                    type={'checkbox'}
                    id={'marker'}
                    className={'m-3'}
                    label={'Marker'}
                    title={showMapMarker ? 'Hide marker' : 'Show marker'}
                    checked={showMapMarker}
                    readOnly
                    onClick={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                ></Form.Check>
                {hasConstructions && (
                    <Form.Check
                        type={'checkbox'}
                        id={'marker'}
                        className={'m-3'}
                        label={'Constructions'}
                        title={'Constructions'}
                        checked={showConstructions}
                        readOnly
                        onClick={() => dispatch(mapActions.setShowConstructions(!showConstructions))}
                    ></Form.Check>
                )}
            </Form>
        </Form.Group>
    );
}
