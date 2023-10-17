import './App.css';
import { FileDragAndDrop } from './components/FileDragAndDrop.tsx';
import { TrackDownloadSection } from './components/TrackDownloadSection.tsx';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';

export function App() {
    return (
        <>
            <h1>Rally GPX Merger</h1>
            <div>
                <FileUploadSection />
                <TrackMergeSection />
                <TrackDownloadSection />
            </div>
            <FileDragAndDrop />
        </>
    );
}
