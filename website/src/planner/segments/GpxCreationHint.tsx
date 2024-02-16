import { FormattedMessage } from 'react-intl';

export function GpxCreationHint() {
    return (
        <p>
            <FormattedMessage id={'msg.createGpx.part1'} />{' '}
            <a href={'http://brouter.de/brouter-web'} target={'_blank'} referrerPolicy={'no-referrer'}>
                brouter
            </a>
            <span>
                <FormattedMessage id={'msg.createGpx.part2'} />
            </span>
            <a href={'https://gpx.studio/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                Gpx Studio
            </a>
        </p>
    );
}
