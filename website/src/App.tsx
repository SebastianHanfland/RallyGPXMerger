import './App.css';
import { FileDragAndDrop } from './components/FileDragAndDrop.tsx';

export function App() {
    return (
        <>
            <h1>Rally GPX Merger</h1>
            <div>
                <div>Input of Files</div>
                <div>Restructure files</div>
                <div>Download target files</div>
            </div>
            <FileDragAndDrop />
        </>
    );
}
