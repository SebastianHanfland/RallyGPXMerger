import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { getPlanningTitle, settingsActions } from '../store/settings.reducer.ts';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';
import { debounceSettingOfName } from '../tracks/components/TrackName.tsx';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import { SingleTrackColor } from '../tracks/SingleTrackColor.tsx';

interface Props {
    setTrackNameAsWell?: boolean;
    singleTrack?: TrackComposition;
}

export function PlanningTitle({ setTrackNameAsWell, singleTrack }: Props) {
    const trackCompositions = useSelector(getTrackCompositions);

    const intl = useIntl();
    const dispatch = useDispatch();
    const planningTitle = useSelector(getPlanningTitle);
    return (
        <div className={'d-flex m-3'}>
            <div className={'m-3'}>
                <b style={{ whiteSpace: 'nowrap' }}>
                    <FormattedMessage id={'msg.titleOfPlanning'} />
                </b>
            </div>
            <Form.Control
                type="text"
                placeholder={intl.formatMessage({ id: 'msg.titleOfPlanning' })}
                value={planningTitle ?? ''}
                onChange={(value) => {
                    dispatch(settingsActions.setPlanningTitle(value.target.value));
                    if (setTrackNameAsWell && trackCompositions.length > 0) {
                        const singleTrackId = trackCompositions[0].id;
                        debounceSettingOfName(dispatch, value.target.value, singleTrackId);
                    }
                }}
            />
            <DescriptionInfoButton
                titleMessageId={'msg.titleOfPlanning'}
                descriptionMessageId={'msg.titleOfPlanning.hint'}
            />
            {singleTrack && (
                <div>
                    <SingleTrackColor track={singleTrack} />
                </div>
            )}
        </div>
    );
}
