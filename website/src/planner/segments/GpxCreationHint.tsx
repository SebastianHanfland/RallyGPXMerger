import { FormattedMessage } from 'react-intl';
import { getLanguage } from '../../language.ts';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';
import hand from '../../assets/hand.svg';

export function GpxCreationHint() {
    const language = getLanguage();
    const link = language === 'de' ? 'https://gpx.studio/de' : 'https://gpx.studio/';
    const hasNoGPXSegments = useSelector(getGpxSegments).length === 0;

    return (
        <p style={hasNoGPXSegments ? { border: '2px solid transparent', borderColor: 'red' } : undefined}>
            {hasNoGPXSegments && <Warning />}
            <FormattedMessage id={'msg.createGpx.part1'} />{' '}
            <a href={'http://brouter.de/brouter-web'} target={'_blank'} referrerPolicy={'no-referrer'}>
                <img src={hand} className="m-1" alt="warning" style={{ width: `${15}px`, height: `${15}px` }} />
                brouter
            </a>
            <span>
                <FormattedMessage id={'msg.createGpx.part2'} />
            </span>
            <a href={link} target={'_blank'} referrerPolicy={'no-referrer'}>
                <img src={hand} className="m-1" alt="warning" style={{ width: `${15}px`, height: `${15}px` }} />
                Gpx Studio
            </a>
        </p>
    );
}
