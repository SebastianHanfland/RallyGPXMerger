import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { CSSProperties } from 'react';
import info from '../../assets/info.svg';
import { useDispatch, useSelector } from 'react-redux';
import { infoNotification } from '../store/toast.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getHasChangesSinceLastCalculation,
    getHasDefaultArrivalDateTime,
    getPlanningTitle,
    getTrackCompositions,
} from '../store/trackMerge.reducer.ts';
import { getPlanningId } from '../store/backend.reducer.ts';
import { getHasSingleTrack, layoutActions } from '../store/layout.reducer.ts';

const infoButtonStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 70,
    bottom: 50,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export const HelpButton = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const tracks = useSelector(getTrackCompositions);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const hasDefaultArrivalTime = useSelector(getHasDefaultArrivalDateTime);
    const planningTitle = useSelector(getPlanningTitle);
    const planningId = useSelector(getPlanningId);
    const hasSingleTrack = useSelector(getHasSingleTrack);
    const hasChanges = useSelector(getHasChangesSinceLastCalculation);

    function inform(topic: string) {
        infoNotification(
            dispatch,
            intl.formatMessage({ id: `msg.help.${topic}.title` }),
            intl.formatMessage({ id: `msg.help.${topic}.message` })
        );
    }

    const helpWithNotificationSimple = () => {
        if (gpxSegments.length === 0) {
            inform('gpx');
            return;
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            inform('time');
            return;
        }
        if (!planningTitle) {
            inform('name');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningId) {
            inform('upload');
            return;
        }
        inform('share');
        inform('edit');
        inform('download');
        inform('delete');
    };

    const helpWithNotificationComplex = () => {
        if (gpxSegments.length === 0) {
            inform('gpx');
            return;
        }
        if (tracks.length === 0) {
            inform('track');
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (!tracks[0].name) {
            inform('trackName');
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (tracks[0].segmentIds.length === 0) {
            inform('trackSegments');
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            inform('time');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningTitle) {
            inform('name');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (hasChanges) {
            inform('calculate');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningId) {
            inform('upload');
            return;
        }
        inform('share');
        inform('edit');
        inform('download');
        inform('delete');
    };

    const helpWithNotification = hasSingleTrack ? helpWithNotificationSimple : helpWithNotificationComplex;

    return (
        <Button
            style={infoButtonStyle}
            className={'m-0 p-0'}
            variant="info"
            title={intl.formatMessage({ id: 'msg.helpButton.hint' })}
            onClick={helpWithNotification}
        >
            <img src={info} className="m-1" alt="trash" style={{ height: '30px', width: '30px' }} />
        </Button>
    );
};

export const HelpButtonLight = () => {
    const intl = useIntl();
    return (
        <Button
            style={{ width: '45px', height: '45px' }}
            className={'m-0 p-0'}
            variant="info"
            title={intl.formatMessage({ id: 'msg.helpButton.hint' })}
        >
            <img src={info} className="m-1" alt="trash" style={{ height: '30px', width: '30px' }} />
        </Button>
    );
};
