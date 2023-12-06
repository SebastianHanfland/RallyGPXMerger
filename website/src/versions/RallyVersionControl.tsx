import rally1 from '/rally1.zip?url';
import { useEffect } from 'react';
import JSZip from 'jszip';

export function RallyVersionControl() {
    useEffect(() => {
        const zip = new JSZip();
        const file = zip.file(rally1);
        console.log(file, rally1);
        fetch(rally1)
            .then((res) => res.blob())
            .then((blob) => {
                zip.loadAsync(blob).then((zipContent) => {
                    Object.entries(zipContent.files).map(([filename, content]) => {
                        content.async('text').then((text) => console.log(filename, text));
                    });
                });
            });
    }, []);
    return null;
}
