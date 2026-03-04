import fs from 'node:fs';

function readRelevantInfo(data) {
    const parsedState = JSON.parse(data);

    const version = parsedState.gpxSegments ? 'v1' : 'v2';

    if (version === 'v1') {
        const v1Title = parsedState.trackMerge.planningTitle;
        const v1numberOfSegments = parsedState.gpxSegments.segments.length;
        const numberOfTracks = parsedState.trackMerge.trackCompositions.length;
        const v1arrivalDateTime = parsedState.trackMerge.arrivalDateTime;
        const planningId = parsedState.backend ? parsedState.backend.planningId : 'none';

        return `Version: ${version}; Id: ${planningId}; #Segments: ${v1numberOfSegments}; #Tracks: ${numberOfTracks}; Arrival: ${v1arrivalDateTime}; Name: ${v1Title}`;
    } else {
        const v2Title = parsedState.settings ? parsedState.settings.planningTitle : 'none';
        const v2numberOfSegments = parsedState.segmentData.segments.length;
        const numberOfTracks = parsedState.trackMerge.trackCompositions.length;
        const v2arrivalDateTime = parsedState.trackMerge.arrivalDateTime;
        const planningId = parsedState.backend ? parsedState.backend.planningId : 'none';

        return `Version: ${version}; Id: ${planningId}; #Segments: ${v2numberOfSegments}; #Tracks: ${numberOfTracks}; Arrival: ${v2arrivalDateTime}; Name: ${v2Title}`;
    }
}

function readAndLogFile(path) {
    if (path.endsWith('.json')) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            try {
                console.log(readRelevantInfo(data));
            } catch (exception) {
                console.log(`Could not read "${path}": ${exception}`);
            }
        });
    }
}

// readAndLogFile('/home/sebastian/Downloads/SF25.json');

const testFolder = '/home/sebastian/Downloads/';

fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
        // console.log(file);
        readAndLogFile(testFolder + file);
    });
});
