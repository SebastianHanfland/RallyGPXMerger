import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { isTrackEntryPoint } from '../../../store/types.ts';

export const PlannerSidebarOverviewEntryPointsHeader = () => {
    const tracks = useSelector(getTrackCompositions);
    const entryPoints = tracks.flatMap((track) => track.segments.filter(isTrackEntryPoint));
    const incompleteEntryPoints = entryPoints.filter(
        (entryPoint) =>
            !entryPoint.streetName?.trim() || (entryPoint.buffer === undefined && entryPoint.rounding === undefined)
    );

    if (incompleteEntryPoints.length === 0) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.allEntryPointsConfigured" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage
                id="msg.entryPointsMissingConfiguration"
                values={{ amount: incompleteEntryPoints.length }}
            />
        </div>
    );
};
