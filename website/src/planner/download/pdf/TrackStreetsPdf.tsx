import { Document, Page, Text, View } from '@react-pdf/renderer';
import { IntlShape } from 'react-intl';
import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { InfoTablePdf } from './InfoTablePdf.tsx';
import { EntryPointOverviewPdf } from './EntryPointOverviewPdf.tsx';
import { BreakOverviewPdf } from './BreakOverviewPdf.tsx';
import { NodeOverviewTablePdf } from './NodeOverviewTablePdf.tsx';
import { TrackStreetTablePdf } from './TrackStreetTablePdf.tsx';
import { pdfStyles } from './pdfStyles.ts';
import { chunkList } from './chunkUtil.t.ts';

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    trackStreets: TrackStreetInfo;
}

export const TrackStreetsPdf = ({ trackStreets, intl, planningLabel }: Props) => (
    <Document>
        <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
            <View style={pdfStyles.section}>
                <Text style={pdfStyles.documentTitle}>{trackStreets.name.replaceAll('.gpx', '')}</Text>
                {planningLabel && <Text>{planningLabel}</Text>}
                <InfoTablePdf trackStreets={trackStreets} intl={intl} />
                <EntryPointOverviewPdf trackStreets={trackStreets} intl={intl} />
            </View>
        </Page>
        <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
            <View style={pdfStyles.section}>
                <BreakOverviewPdf trackStreets={trackStreets} intl={intl} />
                <NodeOverviewTablePdf trackStreets={trackStreets} intl={intl} />
            </View>
        </Page>
        {...chunkList(trackStreets.wayPoints, 12).map((wayPoints) => (
            <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
                <View style={pdfStyles.section}>
                    <TrackStreetTablePdf wayPoints={wayPoints} intl={intl} />
                </View>
            </Page>
        ))}
    </Document>
);
