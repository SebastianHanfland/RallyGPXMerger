import { PointOfInterest } from '../store/types';
import { FormattedMessage } from 'react-intl';
import { getPointTypeMessageId, pointOfInterestConfig } from './pointOfInterestConfig';
import { ColorBlob } from '../../utils/ColorBlob';
import { getColor } from '../../utils/colorUtil';
import { WcIcon } from '../../utils/icons/WcIcon';
import { mapActions } from '../store/map.reducer';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon';
import { useDispatch } from 'react-redux';
import { pointsActions } from '../store/points.reducer';
import { EditIcon } from '../../utils/icons/EditIcon';

export function PointOfInterestDisplay({
    pointOfInterest,
    onNavigateToPoint,
}: {
    pointOfInterest: PointOfInterest;
    onNavigateToPoint?: () => void;
}) {
    const { title, description, type } = pointOfInterest;
    const config = pointOfInterestConfig[type];
    const dispatch = useDispatch();

    return (
        <tr>
            <td key={'title'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
            <td key={'type'}>
                {config.mapShape === 'toilet' && <WcIcon />}
                {config.color && <ColorBlob color={getColor({ color: config.color })} />}
                <FormattedMessage id={getPointTypeMessageId(type)} />
            </td>
            <td key={'actions'}>
                <span
                    onClick={() => {
                        dispatch(mapActions.setShowPointsOfInterest(true));
                        dispatch(mapActions.setPointToCenter(pointOfInterest));
                        onNavigateToPoint?.();
                    }}
                >
                    <GeoLinkIcon />
                </span>
                <span onClick={() => dispatch(pointsActions.setEditPointOfInterest(pointOfInterest))}>
                    <EditIcon />
                </span>
            </td>
        </tr>
    );
}
