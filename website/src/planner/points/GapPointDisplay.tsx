import { GapPoint } from '../store/types.ts';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { useDispatch } from 'react-redux';
import { mapActions } from '../store/map.reducer.ts';

export function GapPointDisplay({ gapPoint }: { gapPoint: GapPoint }) {
    const { title, description, lng, lat } = gapPoint;
    const dispatch = useDispatch();

    return (
        <tr>
            <td key={'key'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
            <td key={'description'}>
                <div onClick={() => dispatch(mapActions.setPointToCenter({ lat, lng: lng + 0.02, zoom: 14 }))}>
                    <GeoLinkIcon />
                </div>
            </td>
        </tr>
    );
}
