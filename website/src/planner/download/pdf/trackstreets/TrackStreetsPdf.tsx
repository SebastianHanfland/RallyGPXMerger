import { Document, Page, Text, View } from '@react-pdf/renderer';
import { IntlShape } from 'react-intl';
import { TrackStreetInfo, TrackWayPointType } from '../../../logic/resolving/types';
import { InfoTablePdf } from './InfoTablePdf';
import { EntryPointOverviewPdf } from './EntryPointOverviewPdf';
import { BreakOverviewPdf } from './BreakOverviewPdf';
import { NodeOverviewTablePdf } from './NodeOverviewTablePdf';
import { TrackStreetTablePdf } from './TrackStreetTablePdf';
import { pdfStyles } from '../pdfStyles';
import { chunkList } from '../chunkUtil.t';

interface Props {
    intl: IntlShape;
    planningLabel?: string;
    trackStreets: TrackStreetInfo;
}

export const TrackStreetsPdf = ({ trackStreets, intl, planningLabel }: Props) => {
    const entryPoints = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Entry);

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.documentTitle}>{trackStreets.name.replaceAll('.gpx', '')}</Text>
                    {planningLabel && <Text>{planningLabel}</Text>}
                    <InfoTablePdf trackStreets={trackStreets} intl={intl} />
                    {entryPoints.length <= 4 && <EntryPointOverviewPdf trackStreets={trackStreets} intl={intl} />}
                </View>
            </Page>
            {entryPoints.length > 4 && (
                <Page size="A4" style={pdfStyles.page} orientation={'landscape'}>
                    <View style={pdfStyles.section}>
                        <EntryPointOverviewPdf trackStreets={trackStreets} intl={intl} />
                    </View>
                </Page>
            )}
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
};
