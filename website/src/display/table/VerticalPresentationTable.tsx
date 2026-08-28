import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Table } from 'react-bootstrap';
import {
    getDisplayPlanningLabel,
    getDisplayTracks,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { TrackStreetInfo, TrackWayPointType } from '../../planner/logic/resolving/types.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { createStreetPointUrl } from '../../utils/streetPathUrl.ts';
import { TrackFileDownloader } from '../../planner/download/gpx/TrackFileDownloader.tsx';
import { TrackInfoPdfDownloadButton } from '../../planner/download/pdf/TrackInfoPdfDownloadButton.tsx';
import { useTableIndices } from './useTableIndices.ts';

const hideSeconds = true;

const filterByIndex = (tableIndices: number[] | undefined) => (_: unknown, index: number) =>
    !tableIndices || tableIndices.includes(index);

export const VerticalPresentationTable = () => {
    const tableIndices = useTableIndices();
    const tracks = useSelector(getDisplayTracks).filter(filterByIndex(tableIndices));

    return (
        <div>
            {tracks.map((track) => (
                <TrackSection track={track} key={track.id} />
            ))}
        </div>
    );
};

function TrackSection({ track }: { track: CalculatedTrack }) {
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);
    const planningLabel = useSelector(getDisplayPlanningLabel);
    const foundInfo = trackStreetInfos.find((info) => track.id.includes(info.id));

    if (!foundInfo) {
        return null;
    }

    const startingPoint = foundInfo.wayPoints[0];
    if (!startingPoint) {
        return null;
    }

    const startName = foundInfo.startName ?? startingPoint.streetName;
    const entryPoints = foundInfo.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Entry);

    return (
        <section className={'mb-4'}>
            <h2>{foundInfo.name}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.location'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.collectionTime'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.startingTime'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <VerticalTrackRow
                        name={startName}
                        point={startingPoint.pointFrom}
                        meetingTime={foundInfo.publicStart ?? foundInfo.startFront}
                        passageTime={foundInfo.startFront}
                        track={track}
                        trackInfo={foundInfo}
                        planningLabel={planningLabel}
                    />
                    {entryPoints.map((entryPoint) => (
                        <tr key={entryPoint.entryId ?? entryPoint.streetName}>
                            <td>
                                <a
                                    href={createStreetPointUrl(
                                        entryPoint.pointFrom,
                                        entryPoint.streetName ?? undefined
                                    )}
                                    target={'_blank'}
                                    referrerPolicy={'no-referrer'}
                                >
                                    {entryPoint.streetName}
                                </a>
                            </td>
                            <td>{formatTimeOnly(entryPoint.frontArrival, hideSeconds)}</td>
                            <td>{formatTimeOnly(entryPoint.frontPassage, hideSeconds)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </section>
    );
}

function VerticalTrackRow({
    name,
    point,
    meetingTime,
    passageTime,
    track,
    trackInfo,
    planningLabel,
}: {
    name: string | null | undefined;
    point: { lat: number; lon: number };
    meetingTime: string;
    passageTime: string;
    track: CalculatedTrack;
    trackInfo: TrackStreetInfo;
    planningLabel?: string;
}) {
    return (
        <tr>
            <td>
                <a
                    href={createStreetPointUrl(point, name ?? undefined)}
                    target={'_blank'}
                    referrerPolicy={'no-referrer'}
                >
                    {name}
                </a>
                <div>
                    <TrackFileDownloader track={track} />
                    <TrackInfoPdfDownloadButton trackStreets={trackInfo} planningLabel={planningLabel} />
                </div>
            </td>
            <td>{formatTimeOnly(meetingTime, hideSeconds)}</td>
            <td>{formatTimeOnly(passageTime, hideSeconds)}</td>
        </tr>
    );
}
