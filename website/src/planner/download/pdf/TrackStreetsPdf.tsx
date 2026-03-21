import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { IntlShape } from 'react-intl';
import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { createInfoTable } from './infoTablePdf.ts';
import { createEntryPointOverviewTable } from './entryPointOverviewPdf.ts';
import { createBreakOverviewTable } from './breakOverviewPdf.ts';
import { createNodeOverviewTable } from './nodeOverviewTablePdf.ts';
import { createStreetTable } from './trackStreetTablePdf.ts';
import { createPdf } from 'pdfmake/build/pdfmake';
import { styles as stylesOld } from './pdfUtil.ts';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

// Create Document Component
export const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    trackStreets: TrackStreetInfo;
}

export const TrackStreetsPdf = ({ trackStreets, planningLabel }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>{trackStreets.name.replaceAll('.gpx', '')}</Text>
                {planningLabel && <Text>{planningLabel}</Text>}
            </View>
        </Page>
    </Document>
);

export const createTrackStreetPdf = (intl: IntlShape, planningLabel?: string) => (trackStreets: TrackStreetInfo) => {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), style: 'titleStyle' },
            '\n\n',
            planningLabel ? `${planningLabel}` : ' ',
            ' ',
            { text: intl.formatMessage({ id: 'msg.trackInfo' }), style: 'titleStyle' },
            ' ',
            createInfoTable(trackStreets, intl),
            ' ',
            ' ',
            ...createEntryPointOverviewTable(trackStreets, intl),
            ' ',
            ' ',
            ...createBreakOverviewTable(trackStreets, intl),
            ' ',
            ' ',
            ...createNodeOverviewTable(trackStreets, intl),
            ' ',
            ' ',
            { text: intl.formatMessage({ id: 'msg.streetOverview' }), style: 'titleStyle' },
            ' ',
            createStreetTable(trackStreets, intl),
        ],
        styles: stylesOld,
    };
    return createPdf(docDefinition);
};
