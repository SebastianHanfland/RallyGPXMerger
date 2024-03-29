import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { useEffect } from 'react';
import { estimateRequestsForStreetResolving } from '../logic/resolving/selectors/requestEstimator.ts';
import { TrackDataOverviewTable } from './TrackDataOverviewTable.tsx';
import { FormattedMessage } from 'react-intl';
import { DashboardStreetsContent } from '../layout/dashboard/DashboardStreetsContent.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';

export function TrackDataOverview() {
    const gpxSegments = useSelector(getGpxSegments);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(estimateRequestsForStreetResolving);
    }, [gpxSegments.length, gpxSegments.filter((segment) => segment.streetsResolved).length, calculatedTracks.length]);

    return (
        <div className={'m-2 p-2'}>
            <h4>
                <FormattedMessage id={'msg.externalDataOverview'} />
            </h4>
            <TrackDataOverviewTable />

            <DashboardStreetsContent />
        </div>
    );
}
