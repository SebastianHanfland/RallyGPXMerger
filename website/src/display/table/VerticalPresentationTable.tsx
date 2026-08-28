import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Table } from 'react-bootstrap';
import {
    getDisplayEntryPoints,
    getDisplayPlanningLabel,
    getDisplayTracks,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { createStreetPointUrl } from '../../utils/streetPathUrl.ts';
import { TrackFileDownloader } from '../../planner/download/gpx/TrackFileDownloader.tsx';
import { TrackInfoPdfDownloadButton } from '../../planner/download/pdf/TrackInfoPdfDownloadButton.tsx';
import { useTableIndices } from './useTableIndices.ts';
import { EntryPointPosition } from '../../planner/logic/resolving/selectors/getEntryPointPositions.ts';

const hideSeconds = true;
const timeColumnStyle = { width: '180px', whiteSpace: 'nowrap' as const };
const locationColumnStyle = { width: 'auto', textAlign: 'left' as const };

const filterByIndex = (tableIndices: number[] | undefined) => (_: unknown, index: number) =>
    !tableIndices || tableIndices.includes(index);

export const VerticalPresentationTable = () => {
    const tableIndices = useTableIndices();
    const tracks = useSelector(getDisplayTracks).filter(filterByIndex(tableIndices));
    const entryPoints = useSelector(getDisplayEntryPoints);

    return (
        <div>
            {tracks.map((track) => (
                <TrackSection
                    track={track}
                    entryPoints={entryPoints.filter((entryPoint) => entryPoint.trackId === track.id)}
                    key={track.id}
                />
            ))}
        </div>
    );
};

function TrackSection({ track, entryPoints }: { track: CalculatedTrack; entryPoints: EntryPointPosition[] }) {
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
    return (
        <section className={'mb-4'}>
            <h2 style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {foundInfo.name}{' '}
                <div style={{ marginLeft: '15px' }}>
                    <TrackFileDownloader track={track} />
                    <TrackInfoPdfDownloadButton trackStreets={foundInfo} planningLabel={planningLabel} />
                </div>
            </h2>
            <Table striped bordered hover style={{ width: '100%', tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: locationColumnStyle.width }} />
                    <col style={{ width: timeColumnStyle.width }} />
                    <col style={{ width: timeColumnStyle.width }} />
                </colgroup>
                <thead>
                    <tr>
                        <th style={locationColumnStyle}>
                            <FormattedMessage id={'msg.location'} />
                        </th>
                        <th style={timeColumnStyle}>
                            <FormattedMessage id={'msg.collectionTime'} />
                        </th>
                        <th style={timeColumnStyle}>
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
                    />
                    {entryPoints.map((entryPoint) => (
                        <tr key={entryPoint.id}>
                            <td style={locationColumnStyle}>
                                <a
                                    href={createStreetPointUrl(entryPoint.point, entryPoint.streetName ?? undefined)}
                                    target={'_blank'}
                                    referrerPolicy={'no-referrer'}
                                >
                                    {entryPoint.streetName}
                                </a>
                            </td>
                            <td>{formatTimeOnly(entryPoint.at, hideSeconds)}</td>
                            <td>{formatTimeOnly(entryPoint.passageAt, hideSeconds)}</td>
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
}: {
    name: string | null | undefined;
    point: { lat: number; lon: number };
    meetingTime: string;
    passageTime: string;
}) {
    return (
        <tr>
            <td style={locationColumnStyle}>
                <a
                    href={createStreetPointUrl(point, name ?? undefined)}
                    target={'_blank'}
                    referrerPolicy={'no-referrer'}
                >
                    {name}
                </a>
            </td>
            <td>{formatTimeOnly(meetingTime, hideSeconds)}</td>
            <td>{formatTimeOnly(passageTime, hideSeconds)}</td>
        </tr>
    );
}
