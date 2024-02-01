import '../App.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';

export function RallyPlaner() {
    return (
        <Provider store={store}>
            <RallyPlannerRouter />
        </Provider>
    );
}
