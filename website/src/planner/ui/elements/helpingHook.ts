import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getHasChangesSinceLastUpload, getPlanningId } from '../../store/backend.reducer.ts';
import { getHasSingleTrack, layoutActions } from '../../store/layout.reducer.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getArrivalDateTime, getHasDefaultArrivalDateTime, getPlanningTitle } from '../../store/settings.reducer.ts';

export const useHelpingHook = (): [string, string, () => void] => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getParsedGpxSegments);
    const tracks = useSelector(getTrackCompositions);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const hasDefaultArrivalTime = useSelector(getHasDefaultArrivalDateTime);
    const planningTitle = useSelector(getPlanningTitle);
    const planningId = useSelector(getPlanningId);
    const hasSingleTrack = useSelector(getHasSingleTrack);
    const hasChangesSinceLastUpload = useSelector(getHasChangesSinceLastUpload);

    function inform(topic: string, callBack: () => void = () => {}): [string, string, () => void] {
        return [
            intl.formatMessage({ id: `msg.help.${topic}.title` }),
            intl.formatMessage({ id: `msg.help.${topic}.message` }),
            callBack,
        ];
    }

    const helpWithNotificationSimple = () => {
        if (gpxSegments.length === 0) {
            return inform('gpx', () => dispatch(layoutActions.setSelectedSidebarSection('simpleTrack')));
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            return inform('timeSimple', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        if (!planningTitle) {
            return inform('name', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        if (!planningId) {
            return inform('upload', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        if (hasChangesSinceLastUpload) {
            return inform('changes', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        return inform('share', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
    };

    const helpWithNotificationComplex = () => {
        if (gpxSegments.length === 0) {
            return inform('gpx', () => dispatch(layoutActions.setSelectedSidebarSection('segments')));
        }
        if (tracks.length === 0) {
            return inform('track', () => dispatch(layoutActions.setSelectedSidebarSection('tracks')));
        }
        if (!tracks[0].name || tracks[0].name === intl.formatMessage({ id: 'msg.nn' })) {
            return inform('trackName', () => dispatch(layoutActions.setSelectedSidebarSection('tracks')));
        }
        if (tracks[0].segments.length === 0) {
            return inform('trackSegments', () => dispatch(layoutActions.setSelectedSidebarSection('tracks')));
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            return inform('timeComplex', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        if (!planningTitle) {
            return inform('name', () => dispatch(layoutActions.setSelectedSidebarSection('settings')));
        }
        if (!planningId) {
            return inform('upload', () => dispatch(layoutActions.setSelectedSidebarSection('documents')));
        }
        if (hasChangesSinceLastUpload) {
            return inform('changes', () => dispatch(layoutActions.setSelectedSidebarSection('documents')));
        }
        return inform('share', () => dispatch(layoutActions.setSelectedSidebarSection('documents')));
    };

    return hasSingleTrack ? helpWithNotificationSimple() : helpWithNotificationComplex();
};
