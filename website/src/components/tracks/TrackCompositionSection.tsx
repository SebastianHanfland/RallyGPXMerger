import { MergeTable } from './MergeTable.tsx';
import { ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { MergeTracksButton } from '../MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from '../CalculatedFilesDownloader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import {
    getFilteredTrackCompositions,
    getTrackCompositionFilterTerm,
    trackMergeActions,
} from '../../planner/store/trackMerge.reducer.ts';
import { TrackCalculationSettings } from './TrackCalculationSettings.tsx';

export function TrackCompositionSection() {
    const dispatch = useDispatch();
    const filteredTracks = useSelector(getFilteredTrackCompositions);
    const filterTerm = useSelector(getTrackCompositionFilterTerm);
    const setFilterTerm = (term: string) => dispatch(trackMergeActions.setTrackCompositionFilterTerm(term));

    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Create Tracks from GPX Segments</h4>
            <ButtonToolbar aria-label="Toolbar with Button groups" className={'m-2 justify-content-center'}>
                <ButtonGroup aria-label="help-buttons">
                    <MergeTracksButton />
                    <CalculatedFilesDownloader />
                    <TrackCalculationSettings />
                </ButtonGroup>
            </ButtonToolbar>
            <div className={'my-2'}>
                <Form.Control
                    type="text"
                    placeholder="Filter tracks, separate term by ','"
                    value={filterTerm ?? ''}
                    onChange={(value) => setFilterTerm(value.target.value)}
                />
            </div>
            <MergeTable trackCompositions={filteredTracks} />
        </div>
    );
}
