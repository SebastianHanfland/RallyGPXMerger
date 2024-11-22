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

    const helpWithNotificationSimple = () => {
        if (gpxSegments.length === 0) {
            infoNotification(
                dispatch,
                'GPX Hochladen',
                'Erstellen Sie eine GPX Datei und laden Sie sie hoch. Z.B. mit GPX Studio'
            );
            return;
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            infoNotification(
                dispatch,
                'Ankunftszeit auswählen',
                'Wählen Sie unter Streckenplanung die Ankunftszeit aus'
            );
            return;
        }
        if (!planningTitle) {
            infoNotification(dispatch, 'Namen bestimmen', 'Wählen Sie unter Einstellungen einen Namen für die Planung');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningId) {
            infoNotification(
                dispatch,
                'Planung hochladen',
                'Laden Sie über den grünen Button mit Datei und Pfeil nach oben die Planung hoch'
            );
            return;
        }
        infoNotification(
            dispatch,
            'Planung teilen',
            'Über den Teilen button oder die heruntergeladene Datei können Sie die Planung mit anderen teilen'
        );
        infoNotification(
            dispatch,
            'Planung anpassen',
            'Passen Sie die Planung an, und aktualisieren Sie die hochgeladene Version über den grünen Button mit Datei und Pfeil nach oben'
        );
        infoNotification(
            dispatch,
            'Planung herunterladen',
            'Speichern Sie die aktuelle Version über den blauen Button mit Datei und Pfeil nach unten als json Datei'
        );
        infoNotification(
            dispatch,
            'Planung löschen',
            'Löschen Sie die hochgeladene Version über den roten Button mit Datei und x'
        );
    };

    const helpWithNotificationComplex = () => {
        if (gpxSegments.length === 0) {
            infoNotification(
                dispatch,
                'GPX Hochladen',
                'Erstellen Sie eine GPX Datei und laden Sie sie hoch. Z.B. mit GPX Studio'
            );
            return;
        }
        if (tracks.length === 0) {
            infoNotification(
                dispatch,
                'Routen erstellen und GPX zuweisen',
                'Erstellen Sie eine Route, benennen Sie sie, und weisen Sie GPX Abschnitte hinzu'
            );
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (!tracks[0].name) {
            infoNotification(dispatch, 'Route benennen', 'Benennen Sie die Route');
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (tracks[0].segmentIds.length === 0) {
            infoNotification(dispatch, 'GPX zuweisen', 'Weisen Sie GPX Abschnitte der Route hinzu');
            dispatch(layoutActions.setSelectedSidebarSection('tracks'));
            return;
        }
        if (!arrivalDateTime || hasDefaultArrivalTime) {
            infoNotification(
                dispatch,
                'Ankunftszeit auswählen',
                'Wählen Sie unter Streckenplanung die Ankunftszeit aus'
            );
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningTitle) {
            infoNotification(dispatch, 'Namen bestimmen', 'Wählen Sie unter Einstellungen einen Namen für die Planung');
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (hasChanges) {
            infoNotification(
                dispatch,
                'Routen berechnen',
                'Klicken Sie oben links auf den orangenen Berechnen Button, um die Planung zu berechnen. Wenn die Route nicht zu groß ist, können Sie auch auf Automatische Berechnung umstellen'
            );
            dispatch(layoutActions.setSelectedSidebarSection('settings'));
            return;
        }
        if (!planningId) {
            infoNotification(
                dispatch,
                'Planung hochladen',
                'Laden Sie über den grünen Button mit Datei und Pfeil nach oben die Planung hoch'
            );
            return;
        }
        infoNotification(
            dispatch,
            'Planung teilen',
            'Über den Teilen button oder die heruntergeladene Datei können Sie die Planung mit anderen teilen'
        );
        infoNotification(
            dispatch,
            'Planung anpassen',
            'Passen Sie die Planung an, und aktualisieren Sie die hochgeladene Version über den grünen Button mit Datei und Pfeil nach oben'
        );
        infoNotification(
            dispatch,
            'Planung herunterladen',
            'Speichern Sie die aktuelle Version über den blauen Button mit Datei und Pfeil nach unten als json Datei'
        );
        infoNotification(
            dispatch,
            'Planung löschen',
            'Löschen Sie die hochgeladene Version über den roten Button mit Datei und x'
        );
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
