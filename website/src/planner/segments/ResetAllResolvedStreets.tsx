import { ProgressBar, Button } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getParsedGpxSegments, segmentDataActions } from '../store/segmentData.redux.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { resolveStreetNames } from '../logic/resolving/streets/resolveStreetNames.ts';
import { successNotification } from '../store/toast.reducer.ts';

export function ResetAllResolvedStreets() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const segments = useSelector(getParsedGpxSegments);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [isResolving, setIsResolving] = useState(false);

    const resetStreets = async () => {
        if (isResolving) {
            return;
        }

        setIsResolving(true);
        setResolvedCount(0);
        dispatch(segmentDataActions.clearResolvedStreetData());

        try {
            for (const segment of segments) {
                await dispatch(resolveStreetNames(segment.id));
                setResolvedCount((count) => count + 1);
            }
            successNotification(
                dispatch,
                intl.formatMessage({ id: 'msg.streetsResolved' }),
                intl.formatMessage({ id: 'msg.streetsResolved' })
            );
        } finally {
            setIsResolving(false);
        }
    };

    const totalCount = segments.length;
    const progress = totalCount === 0 ? 0 : (resolvedCount / totalCount) * 100;

    return (
        <div className="m-2">
            <Button onClick={resetStreets} disabled={isResolving || totalCount === 0}>
                <FormattedMessage id="msg.resetAllStreets" />
            </Button>
            {isResolving && (
                <div className="mt-2">
                    <ProgressBar now={progress} label={`${resolvedCount}/${totalCount}`} />
                    <div className="mt-1">
                        <FormattedMessage
                            id="msg.resetAllStreets.progress"
                            values={{ resolved: resolvedCount, waiting: totalCount - resolvedCount, total: totalCount }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
