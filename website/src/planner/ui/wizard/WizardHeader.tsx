import { FormattedMessage } from 'react-intl';

export function WizardHeader() {
    return (
        <h3 className={'my-5'}>
            <FormattedMessage id={'msg.appName'} />
        </h3>
    );
}
