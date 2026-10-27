import { formatTimeOnly } from '../../../../../../utils/dateUtil';
import { getEntryPointTime } from '../../../../../../utils/entryPointUtil';
import { EntryPointPosition } from '../../../../../logic/resolving/selectors/getEntryPointPositions';
import { TrackComposition, TrackEntry } from '../../../../../store/types';
import { EntryPointButtons } from './EntryPointButtons';
import { EntryPointBufferInput, EntryPointRoundingInput, EntryPointStreetInput } from './EntryPointInputs';

interface Props {
    track: TrackComposition;
    entryPoint: TrackEntry;
    position?: EntryPointPosition;
}

export const EntryPointRow = ({ track, entryPoint, position }: Props) => {
    return (
        <tr title={entryPoint.extraInfo ?? undefined}>
            <td>{position ? getEntryPointTime(position) : ''}</td>
            <td>{position ? formatTimeOnly(position.passageAt, true) : ''}</td>
            <td>
                <EntryPointRoundingInput track={track} entryPoint={entryPoint} />
            </td>
            <td>
                <EntryPointBufferInput track={track} entryPoint={entryPoint} />
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>
                <EntryPointStreetInput track={track} entryPoint={entryPoint} position={position} />
            </td>
            <td>
                <EntryPointButtons track={track} entryPoint={entryPoint} />
            </td>
        </tr>
    );
};
