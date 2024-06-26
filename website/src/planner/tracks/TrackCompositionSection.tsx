import { MergeTable } from './MergeTable.tsx';
import { ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { MergeTracksButton } from './MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from './CalculatedFilesDownloader.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositionFilterTerm, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackCalculationSettings } from './TrackCalculationSettings.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArrivalDateTimePicker } from '../parameters/ArrivalDateTimePicker.tsx';

export function TrackCompositionSection() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const filterTerm = useSelector(getTrackCompositionFilterTerm);
    const setFilterTerm = (term: string) => dispatch(trackMergeActions.setTrackCompositionFilterTerm(term));

    return (
        <div className={'p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.tracks.title'} />
            </h4>
            <ArrivalDateTimePicker />
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
                    placeholder={intl.formatMessage({ id: 'msg.filterTracks' })}
                    value={filterTerm ?? ''}
                    onChange={(value) => setFilterTerm(value.target.value)}
                />
            </div>
            <MergeTable />
        </div>
    );
}
