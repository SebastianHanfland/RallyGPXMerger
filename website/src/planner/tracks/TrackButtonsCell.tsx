import { ButtonGroup, DropdownButton } from 'react-bootstrap';
import { TrackComposition } from '../store/types';
import { TrackActionItems } from './TrackActionItems';

interface Props {
    track: TrackComposition;
}

export function TrackButtonsCell({ track }: Props) {
    return (
        <DropdownButton
            as={ButtonGroup}
            key={'primary'}
            id={`dropdown-variants-${'primary'}`}
            variant={'primary'.toLowerCase()}
            title={''}
        >
            <TrackActionItems track={track} />
        </DropdownButton>
    );
}
