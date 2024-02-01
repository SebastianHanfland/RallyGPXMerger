import { GpxSegments } from './GpxSegments.tsx';

export function FileUploadSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Upload GPX Segments</h4>
            <p>
                You can create GPX segments with{' '}
                <a href={'http://brouter.de/brouter-web'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    brouter
                </a>
                <span> or </span>
                <a href={'https://gpx.studio/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    Gpx Studio
                </a>
            </p>
            <GpxSegments />
        </div>
    );
}
