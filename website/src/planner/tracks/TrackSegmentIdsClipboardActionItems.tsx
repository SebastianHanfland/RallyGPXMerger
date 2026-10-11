import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getSegmentIdClipboard, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import copyToClipboard from '../../assets/copy-to-clipboard.svg';
import inputFromClipboard from '../../assets/input-from-clipboard.svg';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function TrackSegmentIdsClipboardActionItems({ track, onAction }: Props) {
    const dispatch = useDispatch();
    const segmentIdClipboard = useSelector(getSegmentIdClipboard);

    const closeMenu = () => onAction?.();

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    dispatch(trackMergeActions.setSegmentIdClipboard(track.segments));
                    closeMenu();
                }}
            >
                <img src={copyToClipboard} alt="copy to clipboard" color={'#ffffff'} className="m-1" />
                <span>
                    <FormattedMessage id={'msg.copySegments'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    dispatch(trackMergeActions.setSegments({ id: track.id, segments: segmentIdClipboard! }));
                    closeMenu();
                }}
                disabled={!segmentIdClipboard}
            >
                <img src={inputFromClipboard} alt="input from clipboard" color={'#ffffff'} className={'m-1'} />
                <span>
                    <FormattedMessage id={'msg.pasteSegments'} />
                </span>
            </Dropdown.Item>
        </>
    );
}
