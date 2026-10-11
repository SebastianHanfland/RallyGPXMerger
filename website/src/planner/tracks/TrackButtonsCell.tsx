import { ButtonGroup, DropdownButton } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { TrackActionItems } from './TrackActionItems.tsx';
import { SingleTrackActionItems } from './SingleTrackActionItems.tsx';

interface Props {
    track: TrackComposition;
    single?: boolean;
}

export function TrackButtonsCell({ track, single }: Props) {
    return (
        <DropdownButton
            as={ButtonGroup}
            key={'primary'}
            id={`dropdown-variants-${'primary'}`}
            variant={'primary'.toLowerCase()}
            title={''}
        >
            {single ? <SingleTrackActionItems track={track} /> : <TrackActionItems track={track} />}
        </DropdownButton>
    );
}
