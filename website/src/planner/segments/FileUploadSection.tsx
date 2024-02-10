import { GpxSegments } from './GpxSegments.tsx';
import { FormattedMessage } from 'react-intl';

export function FileUploadSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.uploadGpx.title'} />
            </h4>
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
            <GpxSegments />
        </div>
    );
}
