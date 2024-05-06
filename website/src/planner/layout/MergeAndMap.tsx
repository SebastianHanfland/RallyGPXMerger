import { StreetResolvingSection } from '../streets/StreetResolvingSection.tsx';
import { parseCalculatedTracksHook } from '../map/hooks/parseCalculatedTracksHook.ts';
import { ImportExport } from '../io/ImportExport.tsx';
import { Settings } from '../settings/Settings.tsx';
import { useSelector } from 'react-redux';
import { getSelectionSection } from '../store/layout.reducer.ts';
import { PointsOverview } from '../points/PointsOverview.tsx';
import { TracksOverview } from '../trackoverview/TracksOverview.tsx';
import { NodePointsOverview } from '../nodes/NodePointsOverview.tsx';
import { GpxSection } from './GpxSection.tsx';

export function MergeAndMap() {
    parseCalculatedTracksHook();
    const selectedSection = useSelector(getSelectionSection);

    switch (selectedSection) {
        case 'streets':
            return <StreetResolvingSection />;
        case 'gps':
            return <GpxSection />;
        case 'importExport':
            return <ImportExport />;
        case 'settings':
            return <Settings />;
        case 'tracks':
            return <TracksOverview />;
        case 'points':
            return <PointsOverview />;
        case 'nodePoints':
            return <NodePointsOverview />;
        default:
            return null;
    }
}
