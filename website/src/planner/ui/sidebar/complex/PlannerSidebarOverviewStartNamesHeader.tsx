import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';

export const PlannerSidebarOverviewStartNamesHeader = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);
    const unknown = useIntl().formatMessage({ id: 'msg.unknown' });

    const numberOfUnknownOriginalStartNames = tracks.filter((track) => {
        const trackInfo = trackInfos.find((info) => info.id === track.id);
        const firstStreetName = trackInfo?.wayPoints[0]?.streetName;
        const isUnknown = !firstStreetName || firstStreetName === unknown;
        const hasOverwrite = Boolean(track.startName?.trim());
        return isUnknown && !hasOverwrite;
    }).length;

    if (numberOfUnknownOriginalStartNames === 0) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.startNameOverwrite" /> {': '}
                <FormattedMessage id="msg.noUnknownOriginalStartNames" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage id="msg.startNameOverwrite" /> {': '}
            <FormattedMessage
                id="msg.numberOfUnknownOriginalStartNames"
                values={{ amount: numberOfUnknownOriginalStartNames }}
            />
        </div>
    );
};
