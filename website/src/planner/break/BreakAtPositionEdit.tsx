import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useIntl } from 'react-intl';
import { TrackBreak, TrackComposition } from '../store/types.ts';
import { EditIcon } from '../../utils/icons/EditIcon.tsx';
import { BreakPosition, getBreakPositions } from '../logic/resolving/selectors/getBreakPositions.ts';
import { useState } from 'react';
import { BreakMultiEditDialog } from './BreakMultiEditDialog.tsx';

const getTrackName = (trackId: string, tracks: TrackComposition[]): string => {
    return tracks.find((track) => track.id === trackId)?.name ?? 'n.n.';
};

interface Props {
    trackElement: TrackBreak;
}

export function getBreaksAtPlace(
    foundBreak: BreakPosition | undefined,
    breakPositions: BreakPosition[]
): Record<string, BreakPosition[]> {
    if (!foundBreak) {
        return {};
    }
    const breaks: Record<string, BreakPosition[]> = {};
    breakPositions
        .filter(
            (breakPosition) =>
                breakPosition.point.lat === foundBreak.point.lat && breakPosition.point.lon === foundBreak.point.lon
        )
        .forEach(
            (breakAtPlace) => (breaks[breakAtPlace.trackId] = [...(breaks[breakAtPlace.trackId] ?? []), breakAtPlace])
        );
    return breaks;
}

export function BreakAtPositionEdit({ trackElement }: Props) {
    const intl = useIntl();
    const [openDialog, setOpenDialog] = useState(false);
    const breakPositions = useSelector(getBreakPositions);
    const tracks = useSelector(getTrackCompositions);
    const foundBreak = breakPositions.find((breakPosition) => breakPosition.breakId === trackElement.id);
    const breaks = getBreaksAtPlace(foundBreak, breakPositions);

    const numberOfTracksWithBreaks = Object.keys(breaks).length;
    if (numberOfTracksWithBreaks <= 1) {
        return null;
    }

    const tooltip = Object.entries(breaks)
        .map(
            ([trackId, breaksOfTrack]) =>
                `${getTrackName(trackId, tracks)}: ${breaksOfTrack.map((b) => `${b.minutes} min`).join(', ')}`
        )
        .join('\n');

    const tracksLabel = intl.formatMessage({ id: 'msg.tracks' });
    return (
        <>
            <span
                title={tooltip}
                className={'mx-1 p-2 rounded-2 border-1 border-black border'}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                    event.stopPropagation();
                    setOpenDialog(true);
                }}
            >
                {` (${numberOfTracksWithBreaks}) ${tracksLabel}`}
                <EditIcon />
            </span>
            {openDialog && <BreakMultiEditDialog breaks={breaks} closeModal={() => setOpenDialog(false)} />}
        </>
    );
}
