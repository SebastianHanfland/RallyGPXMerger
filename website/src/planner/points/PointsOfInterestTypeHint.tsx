import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { WcIcon } from '../../utils/icons/WcIcon.tsx';
import { FormattedMessage } from 'react-intl';
import { getPointTypeMessageId, pointOfInterestConfig, pointOfInterestTypesByGroup } from './pointOfInterestConfig.ts';

export function PointsOfInterestTypeHint() {
    return (
        <p>
            {(['public', 'todo', 'impediment', 'internal'] as const).map((group) => (
                <ul key={group}>
                    {pointOfInterestTypesByGroup[group].map((type) => {
                        const config = pointOfInterestConfig[type];
                        return (
                            <li key={type}>
                                {config.mapShape === 'toilet' && <WcIcon />}
                                {config.color && <ColorBlob color={getColor({ color: config.color })} />}
                                <FormattedMessage id={getPointTypeMessageId(type)} />
                            </li>
                        );
                    })}
                </ul>
            ))}
        </p>
    );
}
