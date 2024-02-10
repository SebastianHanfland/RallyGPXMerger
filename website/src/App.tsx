import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ErrorBoundary } from './common/ErrorBoundary.tsx';
import { RallyVersionControl } from './versions/RallyVersionControl.tsx';
import { RallyPlaner } from './planner/RallyPlaner.tsx';
import { IntlProvider } from 'react-intl';
import { getLanguage } from './language.ts';
import { getMessages } from './lang/getMessages.ts';

export function App() {
    const urlParams = window.location.search;
    const hasExternalUrl = urlParams.includes('?version=');

    return (
        <ErrorBoundary>
            <IntlProvider locale={getLanguage()} messages={getMessages()}>
                {hasExternalUrl ? <RallyVersionControl /> : <RallyPlaner />}
            </IntlProvider>
        </ErrorBoundary>
    );
}
