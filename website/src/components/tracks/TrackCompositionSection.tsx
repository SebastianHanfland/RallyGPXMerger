import { MergeTable } from './MergeTable.tsx';
import { ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { MergeTracksButton } from '../MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from '../CalculatedFilesDownloader.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { useState } from 'react';

export function TrackCompositionSection() {
    const trackCompositions = useSelector(getTrackCompositions);
    const [filterTerm, setFilterTerm] = useState('');

    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Create tracks from GPX segments</h4>
            <ButtonToolbar aria-label="Toolbar with Button groups" className={'m-2 justify-content-center'}>
                <ButtonGroup aria-label="help-buttons">
                    <MergeTracksButton />
                    <CalculatedFilesDownloader />
                </ButtonGroup>
            </ButtonToolbar>
            <div className={'my-2'}>
                <Form.Control
                    type="text"
                    placeholder="Filter tracks, separate term by ','"
                    value={filterTerm}
                    onChange={(value) => setFilterTerm(value.target.value)}
                />
            </div>
            <MergeTable trackCompositions={trackCompositions} />
        </div>
    );
}
