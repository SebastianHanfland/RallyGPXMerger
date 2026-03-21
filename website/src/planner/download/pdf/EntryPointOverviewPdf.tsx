import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { getLink } from '../../../utils/linkUtil.ts';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}
export const EntryPointOverviewPdf = ({ trackStreets, intl }: Props) => {
    const entryPoints = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Entry);
    const startingPoint = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)[0];

    const startingLabel =
        trackStreets.startName ?? startingPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });

    const publishedStart = `${formatTimeOnly(trackStreets.publicStart ?? startingPoint.frontArrival)}`;

    return (
        <View>
            <Text style={pdfStyles.sectionTitle}>{intl.formatMessage({ id: 'msg.entryPoints' })}</Text>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    <Text style={pdfStyles.col1}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={pdfStyles.col2}>{intl.formatMessage({ id: 'msg.collectionTime' })} </Text>
                    <Text style={pdfStyles.col3}>{intl.formatMessage({ id: 'msg.startingTime' })} </Text>
                </View>
                <View key={-1} style={pdfStyles.row} wrap={false}>
                    <Text style={pdfStyles.col1}>
                        <Link src={getLink({ pointTo: startingPoint.pointFrom, pointFrom: startingPoint.pointFrom })}>
                            <Text style={pdfStyles.bold}>{startingLabel}</Text>
                        </Link>
                    </Text>
                    <Text style={pdfStyles.col2}>{publishedStart}</Text>
                    <Text style={pdfStyles.col3}>{formatTimeOnly(startingPoint.frontArrival)}</Text>
                </View>
                {...entryPoints.map((entryPoint, index) => {
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={pdfStyles.col1}>
                                <Text style={pdfStyles.bold}>
                                    <Link src={getLink(entryPoint)} style={{ color: 'blue' }}>
                                        {entryPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={pdfStyles.col2}>{formatTimeOnly(entryPoint.frontArrival)}</Text>
                            <Text style={pdfStyles.col3}>{formatTimeOnly(entryPoint.frontPassage)}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
