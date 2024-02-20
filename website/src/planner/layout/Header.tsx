import { ButtonGroup, ButtonToolbar, Row } from 'react-bootstrap';
import { LanguageSelection } from './LanguageSelection.tsx';
import { FormattedMessage } from 'react-intl';
import { HelpButton } from '../tutorial/HelpButton.tsx';
import { RemoveDataButton } from './RemoveDataButton.tsx';
import { SectionNavigation } from './SectionNavigation.tsx';

export const AppHeader = () => {
    return (
        <>
            <Row className={'d-lg-none'}>
                <h3 className={'m-2'}>
                    <FormattedMessage id={'msg.appName'} />
                </h3>
            </Row>
            <Row>
                <div className="footer-copyright text-center py-3">
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <SectionNavigation />
                        <h3 className={'d-none d-lg-block'}>
                            <FormattedMessage id={'msg.appName'} />
                        </h3>
                        <ButtonToolbar aria-label="Toolbar with Button groups" className={'m-0'}>
                            <ButtonGroup aria-label="help-buttons" className={'m-0'}>
                                <HelpButton />
                                <RemoveDataButton />
                                <LanguageSelection />
                            </ButtonGroup>
                        </ButtonToolbar>
                    </ButtonToolbar>
                </div>
            </Row>
        </>
    );
};
