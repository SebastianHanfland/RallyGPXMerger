import { WayPoint } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { createStreetPointUrl } from '../../../utils/streetPathUrl.ts';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    wayPoint: WayPoint;
    intl: IntlShape;
    colWidths: { width: string }[];
}

export const TrackStreetTableNodeRow = ({ wayPoint, intl, colWidths }: Props) => {
    const streetName = wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });
    let width = 0;
    colWidths.slice(0, 7).forEach((colWidth) => {
        width += Number(colWidth.width.replace('%', ''));
    });
    return (
        <View key={wayPoint.streetName} style={pdfStyles.row} wrap={false}>
            <Text style={{ width: `${width}%` }}>
                <Text style={pdfStyles.bold}>
                    <Link src={createStreetPointUrl(wayPoint.pointFrom, streetName)} style={{ color: 'blue' }}>
                        {`${streetName}: Knoten${wayPoint.nodeTracks ? ` (${wayPoint.nodeTracks.join(', ')})` : ''}`}
                    </Link>
                </Text>
            </Text>
            <Text style={colWidths[7]}>{formatTimeOnly(wayPoint.frontArrival)}</Text>
            <Text style={colWidths[8]}>{formatTimeOnly(wayPoint.frontPassage)}</Text>
            <Text style={colWidths[9]}>{formatTimeOnly(wayPoint.backPassage)}</Text>
        </View>
    );
};
