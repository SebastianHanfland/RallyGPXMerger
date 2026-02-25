import { PointOfInterest } from '../store/types.ts';
import { mapActions } from '../store/map.reducer.ts';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { useDispatch } from 'react-redux';

export function PointOfInterestDisplay({ pointOfInterest }: { pointOfInterest: PointOfInterest }) {
    const { title, description } = pointOfInterest;
    const dispatch = useDispatch();

    return (
        <tr>
            <td key={'title'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
            <td key={'actions'}>
                <div
                    onClick={() => {
                        dispatch(mapActions.setShowPointsOfInterest(true));
                        dispatch(mapActions.setPointToCenter(pointOfInterest));
                    }}
                >
                    <GeoLinkIcon />
                </div>
            </td>
        </tr>
    );
}
