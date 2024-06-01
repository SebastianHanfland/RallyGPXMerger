import { TrackComposition } from '../store/types.ts';
import { Accordion } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { TrackSegmentSelection } from './TrackSegmentSelection.tsx';

interface Props {
    track: TrackComposition;
}

export function TrackSelectionCell({ track }: Props) {
    const intl = useIntl();
    const { segmentIds } = track;

    return (
        <Accordion className={'mt-0'}>
            <Accordion.Item eventKey="0">
                <Accordion.Header className={'m-0'}>
                    <span style={segmentIds.length === 0 ? { color: 'red' } : undefined}>{`${
                        segmentIds.length
                    } ${intl.formatMessage({ id: 'msg.segments' })}`}</span>
                </Accordion.Header>
                <Accordion.Body>
                    <TrackSegmentSelection track={track} />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
