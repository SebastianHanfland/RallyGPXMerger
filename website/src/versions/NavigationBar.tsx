import { MapVersionSelection } from './MapVersionSelection.tsx';

export const NavigationBar = () => {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-light justify-content-between"
            style={{ height: '150px' }}
        >
            <div>
                <MapVersionSelection />
            </div>
        </nav>
    );
};
