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
            </p>
            <GpxSegments />
        </div>
    );
}
