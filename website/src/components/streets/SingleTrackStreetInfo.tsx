import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';
import info from '../../assets/info.svg';

interface Props {
    trackStreetInfo: TrackStreetInfo;
}

export const SingleTrackStreetInfo = ({ trackStreetInfo }: Props) => {
    const { name, wayPoints, distanceInKm, startFront, arrivalBack, arrivalFront } = trackStreetInfo;
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
            </div>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Street</th>
                        <th>Post code</th>
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
                        <th>Map</th>
                    </tr>
                </thead>
                <tbody>
                    {wayPoints.map(
                        ({ streetName, backArrival, frontArrival, frontPassage, postCode, pointTo, pointFrom }) => (
                            <tr key={backArrival}>
                                <td>
                                    <HighlightUnknown value={streetName} />
                                </td>
                                <td>
                                    <HighlightUnknown value={postCode?.toString() ?? 'Unknown'} />
                                </td>
                                <td>{(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number).toFixed(2)} km</td>
                                <td>
                                    {(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60).toFixed(1)} min (
                                    {(getTimeDifferenceInSeconds(backArrival, frontArrival) / 60).toFixed(1)} min )
                                </td>
                                <td>{formatTimeOnly(frontArrival)}</td>
                                <td>{formatTimeOnly(frontPassage)}</td>
                                <td>{formatTimeOnly(backArrival)}</td>
                                <td>
                                    <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </div>
    );
};
