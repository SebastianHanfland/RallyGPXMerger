import { WayPoint } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from './pdfStyles.ts';

interface Props {
    wayPoint: WayPoint;
    intl: IntlShape;
    colWidths: { width: string }[];
}

export const TrackStreetTableEntryPointRow = ({ wayPoint, intl, colWidths }: Props) => {
    let width = 0;
    colWidths.slice(0, 9).forEach((colWidth) => {
        width += Number(colWidth.width.replace('%', ''));
    });
    return (
        <View key={wayPoint.streetName} style={pdfStyles.row} wrap={false}>
            <Text style={{ width: `${width}%` }}>
                <Text style={pdfStyles.bold}>
                    <Link src={getLink(wayPoint)} style={{ color: 'blue' }}>
                        {`${intl.formatMessage({ id: 'msg.entryPoint' })} (${intl.formatMessage({
                            id: 'msg.collectionTime',
                        })} ${formatTimeOnly(wayPoint.frontArrival)}): ${
                            wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })
                        }, ${intl.formatMessage({ id: 'msg.startingTime' })}: ${formatTimeOnly(wayPoint.frontPassage)}`}
                    </Link>
                </Text>
            </Text>
        </View>
    );
};
