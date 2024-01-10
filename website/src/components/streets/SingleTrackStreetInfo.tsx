import { TrackStreetInfo, TrackWayPointType } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';
import info from '../../assets/info.svg';
import { useSelector } from 'react-redux';
import { getOnlyShowUnknown } from '../../store/geoCoding.reducer.ts';

interface Props {
    trackStreetInfo: TrackStreetInfo;
}

export const SingleTrackStreetInfo = ({ trackStreetInfo }: Props) => {
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);
    const { name, wayPoints, distanceInKm, startFront, arrivalBack, arrivalFront, peopleCount } = trackStreetInfo;
    const average = (distanceInKm / getTimeDifferenceInSeconds(arrivalFront, startFront)) * 60 * 60;
    return (
        <div>
            <h5>{name}</h5>
            <div className={'d-flex justify-content-between'}>
                <div className={'m-3'}>{`Distance: ${distanceInKm.toFixed(2)} km`}</div>
                <div className={'m-3'}>{`Start: ${formatTimeOnly(startFront)}`}</div>
                <div className={'m-3'}>{`Arrival: ${formatTimeOnly(arrivalFront)}`}</div>
                <div className={'m-3'}>{`End: ${formatTimeOnly(arrivalBack)}`}</div>
                <div className={'m-3'}>{`Average speed: ${average.toFixed(1)} km/h`}</div>
                <div className={'m-3'}>{`#People: ${peopleCount ?? '---'}`}</div>
            </div>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Street</th>
                        <th>Post code</th>
                        <th>District</th>
                        <th>Length</th>
                        <th>
                            <span title={'Time required for a cyclist to pass this street'}>
                                Duration
                                <img src={info} className={'m-1'} alt="help" />
                            </span>{' '}
                            <span title={'Time between the first and last cyclist on this street'}>
                                ( Blockage
                                <img src={info} className={'m-1'} alt="help" />)
                            </span>
                        </th>
                        <th>Arrival of front</th>
                        <th>Passage of front</th>
                        <th>Arrival of back</th>
                    </tr>
                </thead>
                <tbody>
                    {wayPoints
                        .filter((wayPoint) =>
                            onlyShowUnknown
                                ? wayPoint.streetName === 'Unknown' ||
                                  wayPoint.postCode === undefined ||
                                  wayPoint.district === undefined
                                : true
                        )
                        .map(
                            ({
                                streetName,
                                backArrival,
                                frontArrival,
                                frontPassage,
                                postCode,
                                district,
                                pointTo,
                                pointFrom,
                                type,
                                breakLength,
                                nodeTracks,
                            }) => (
                                <tr key={backArrival + streetName + frontArrival}>
                                    <td>
                                        <HighlightUnknown value={streetName} />
                                        <StreetMapLink
                                            pointTo={pointTo}
                                            pointFrom={pointFrom}
                                            streetName={streetName}
                                        />
                                        <b>
                                            {type === TrackWayPointType.Break
                                                ? `Pause${breakLength ? ` (${breakLength} min)` : ''}`
                                                : null}
                                        </b>
                                        <b>
                                            {type === TrackWayPointType.Node
                                                ? `Knoten${nodeTracks ? ':  ' + nodeTracks.join(', ') : ''}`
                                                : null}
                                        </b>
                                    </td>
                                    <td>
                                        <HighlightUnknown value={postCode?.toString() ?? 'Unknown'} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={district?.toString() ?? 'Unknown'} />
                                    </td>
                                    <td>
                                        {(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number).toFixed(2)} km
                                    </td>
                                    <td>
                                        {(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60).toFixed(1)} min (
                                        {(getTimeDifferenceInSeconds(backArrival, frontArrival) / 60).toFixed(1)} min )
                                    </td>
                                    <td>{formatTimeOnly(frontArrival)}</td>
                                    <td>{formatTimeOnly(frontPassage)}</td>
                                    <td>{formatTimeOnly(backArrival)}</td>
                                </tr>
                            )
                        )}
                </tbody>
            </Table>
        </div>
    );
};
