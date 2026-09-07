import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';

export const PlannerSidebarOverviewStartTimesHeader = () => {
    const tracks = useSelector(getTrackCompositions);
    const tracksWithoutStartTimeConfiguration = tracks.filter(
        (track) => track.buffer === undefined && track.rounding === undefined
    ).length;

    if (tracksWithoutStartTimeConfiguration === 0) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.communicatedStart" /> {': '}
                <FormattedMessage id="msg.allTracksHaveStartTimeConfiguration" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage id="msg.communicatedStart" /> {': '}
            <FormattedMessage
                id="msg.tracksWithoutStartTimeConfiguration"
                values={{ amount: tracksWithoutStartTimeConfiguration }}
            />
        </div>
    );
};
