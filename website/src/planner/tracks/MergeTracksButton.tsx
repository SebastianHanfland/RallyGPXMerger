import { AppDispatch } from '../store/store.ts';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import magic from '../../assets/magic.svg';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { incompleteTrackDataHook } from './incompleteTrackDataHook.ts';

export function MergeTracksButton() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const incompleteData = incompleteTrackDataHook();

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            onClick={() => {
                setIsLoading(true);
                setTimeout(() => dispatch(calculateMerge).then(() => setIsLoading(false)), 50);
            }}
            disabled={isLoading || incompleteData}
            variant={'success'}
            title={intl.formatMessage({ id: 'msg.mergeTracks.hint' })}
        >
            {isLoading ? (
                <Spinner animation="border" role="status" size={'sm'}>
                    <span className="visually-hidden">
                        <FormattedMessage id={'msg.loading'} />
                        ...
                    </span>
                </Spinner>
            ) : (
                <img src={magic} className="m-1" alt="magic wand" />
            )}
            <span>
                <FormattedMessage id={'msg.mergeTracks'} />
            </span>
        </Button>
    );
}
