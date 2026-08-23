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

export const TrackStreetTableEntryPointRow = ({ wayPoint, intl, colWidths }: Props) => {
    const streetName = wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' });
    let width = 0;
    colWidths.slice(0, 9).forEach((colWidth) => {
        width += Number(colWidth.width.replace('%', ''));
    });
    return (
        <View key={wayPoint.streetName} style={pdfStyles.row} wrap={false}>
            <Text style={{ width: `${width}%` }}>
                <Text style={pdfStyles.bold}>
                    <Link src={createStreetPointUrl(wayPoint.pointFrom, streetName)} style={{ color: 'blue' }}>
                        {`${intl.formatMessage({ id: 'msg.entryPoint' })} (${intl.formatMessage({
                            id: 'msg.collectionTime',
                        })} ${formatTimeOnly(wayPoint.frontArrival)}): ${
                            streetName
                        }, ${intl.formatMessage({ id: 'msg.startingTime' })}: ${formatTimeOnly(wayPoint.frontPassage)}`}
                    </Link>
                </Text>
            </Text>
        </View>
    );
};
