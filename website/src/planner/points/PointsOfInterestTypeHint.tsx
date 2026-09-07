import { pointOfInterestColors, PointOfInterestType } from '../store/types.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { WcIcon } from '../../utils/icons/WcIcon.tsx';

const plannerTypes = [
    PointOfInterestType.COMMENT,
    PointOfInterestType.GAP,
    PointOfInterestType.TODO,
    PointOfInterestType.IMPEDIMENT,
    PointOfInterestType.OTHER,
];

const publicTypes = [PointOfInterestType.PUBLIC_COMMENT, PointOfInterestType.TOILET, PointOfInterestType.GATHERING];

export function PointsOfInterestTypeHint() {
    return (
        <p>
            <ul>
                {plannerTypes.map((type) => {
                    const color = pointOfInterestColors[type];
                    return (
                        <li key={type}>
                            {color && <ColorBlob color={getColor({ color })} />}
                            {type}
                        </li>
                    );
                })}
            </ul>

            <ul>
                {publicTypes.map((type) => {
                    const color = pointOfInterestColors[type];
                    return (
                        <li key={type}>
                            {type === PointOfInterestType.TOILET && <WcIcon />}
                            {color && <ColorBlob color={getColor({ color })} />}
                            {type}
                        </li>
                    );
                })}
            </ul>
        </p>
    );
}
