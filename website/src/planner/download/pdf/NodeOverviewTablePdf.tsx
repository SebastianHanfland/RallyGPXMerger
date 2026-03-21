import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    trackStreets: TrackStreetInfo;
    intl: IntlShape;
}

const colWidths = ['25%', '25%', '50%'].map((width) => ({ width }));

export const NodeOverviewTablePdf = ({ trackStreets, intl }: Props) => {
    const nodes = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Node);
    const nodesTitle = intl.formatMessage({ id: 'msg.nodePoints' });

    if (nodes.length === 0) {
        return (
            <View>
                <Text style={pdfStyles.sectionTitle}>{nodesTitle}</Text>
                <Text>{intl.formatMessage({ id: 'msg.noNodePoints' })}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={pdfStyles.sectionTitle}>{nodesTitle}</Text>
            <View style={pdfStyles.table}>
                <View style={[pdfStyles.row, pdfStyles.bold, pdfStyles.header]}>
                    <Text style={colWidths[0]}>{intl.formatMessage({ id: 'msg.location' })} </Text>
                    <Text style={colWidths[1]}>{intl.formatMessage({ id: 'msg.pointInTime' })} </Text>
                    <Text style={colWidths[2]}>{intl.formatMessage({ id: 'msg.otherTracks' })} </Text>
                </View>
                {...nodes.map((nodePoint, index) => {
                    return (
                        <View key={index} style={pdfStyles.row} wrap={false}>
                            <Text style={colWidths[0]}>
                                <Text style={pdfStyles.bold}>
                                    <Link src={getLink(nodePoint)} style={{ color: 'blue' }}>
                                        {nodePoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    </Link>
                                </Text>
                            </Text>
                            <Text style={colWidths[1]}>{formatTimeOnly(nodePoint.frontArrival)}</Text>
                            <Text style={colWidths[2]}>
                                {nodePoint.nodeTracks ? `${nodePoint.nodeTracks.join(', ')}` : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
