import { TimeSlider } from './TimeSlider.tsx';
import { SourceSelection } from './SourceSelection.tsx';

export function MapToolbar() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '75vh', overflow: 'auto' }}>
            <h4>Map settings</h4>
            <hr />
            <TimeSlider />
            <hr />
            <SourceSelection />
            <hr />
        </div>
    );
}
