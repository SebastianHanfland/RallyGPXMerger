import { FormattedMessage } from 'react-intl';

export function WizardHeader() {
    return (
        <h3 className={'mb-5'}>
            <FormattedMessage id={'msg.appName'} />
        </h3>
    );
}
