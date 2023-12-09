import { MergeTable } from './MergeTable.tsx';
import { ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { MergeTracksButton } from '../MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from '../CalculatedFilesDownloader.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { useEffect, useState } from 'react';
import { TrackComposition } from '../../store/types.ts';
import { TrackCalculationSettings } from './TrackCalculationSettings.tsx';

export function TrackCompositionSection() {
    const trackCompositions = useSelector(getTrackCompositions);
    const [filterTerm, setFilterTerm] = useState('');
    const [filteredTracks, setFilteredTracks] = useState<TrackComposition[]>([]);

    useEffect(() => {
        const allFilterTerms = filterTerm.split(',');
        if (filterTerm === '') {
            setFilteredTracks(trackCompositions);
        } else {
            setFilteredTracks(
                trackCompositions.filter((track) => {
                    let match = false;
                    allFilterTerms.forEach((term) => {
                        if (term === '') {
                            return;
                        }
                        const matches = track.name?.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
                        if (matches) {
                            match = true;
                        }
                    });
                    return match;
                })
            );
        }
    }, [filterTerm, trackCompositions]);

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
                    value={filterTerm}
                    onChange={(value) => setFilterTerm(value.target.value)}
                />
            </div>
            <MergeTable trackCompositions={filteredTracks} />
        </div>
    );
}
