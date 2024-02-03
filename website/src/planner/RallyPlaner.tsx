import '../App.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { Dashboard } from './layout/dashboard/Dashboard.tsx';

export function RallyPlaner() {
    return (
        <Provider store={store}>
            <RallyPlannerRouter />
            <Dashboard />
        </Provider>
    );
}
