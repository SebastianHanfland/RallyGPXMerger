import { FormattedMessage } from 'react-intl';
import { getLanguage } from '../../language.ts';

export function GpxCreationHint() {
    const language = getLanguage();
    const link = language === 'de' ? 'https://gpx.studio/de' : 'https://gpx.studio/';

    return (
        <p>
            <FormattedMessage id={'msg.createGpx.part1'} />{' '}
            <a href={'http://brouter.de/brouter-web'} target={'_blank'} referrerPolicy={'no-referrer'}>
                brouter
            </a>
            <span>
                <FormattedMessage id={'msg.createGpx.part2'} />
            </span>
            <a href={link} target={'_blank'} referrerPolicy={'no-referrer'}>
                Gpx Studio
            </a>
        </p>
    );
}
