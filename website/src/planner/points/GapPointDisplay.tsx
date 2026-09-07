import { GapPoint } from '../store/types.ts';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { useDispatch } from 'react-redux';
import { mapActions } from '../store/map.reducer.ts';
import { formatNumber } from '../../utils/numberUtil.ts';

export function GapPointDisplay({ gapPoint }: { gapPoint: GapPoint }) {
    const { description, radiusInM } = gapPoint;
    const dispatch = useDispatch();

    return (
        <tr>
            <td key={'description'}>
                <div>{description}</div>
            </td>
            <td key={'radiusInM'}>
                <div>{formatNumber(radiusInM * 2, 0)}</div>
            </td>
            <td key={'actions'}>
                <div onClick={() => dispatch(mapActions.setPointToCenter(gapPoint))}>
                    <GeoLinkIcon />
                </div>
            </td>
        </tr>
    );
}
