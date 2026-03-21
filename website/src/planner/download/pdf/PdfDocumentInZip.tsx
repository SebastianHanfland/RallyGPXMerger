import { BlobProvider, Page, View, Text, Document, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

// Create Document Component
const StatementPdf = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);

const generatePdf = async () => {
    const pdfBlobs = await Promise.all([1, 2, 3].map(() => generatePdfUrl()));
    await createAndDownloadZip(pdfBlobs);
};

const generatePdfUrl = () => {
    return new Promise<Blob>((resolve, reject) => {
        ReactDOM.render(
            <BlobProvider document={<StatementPdf />}>
                {({ blob, loading, error }) => {
                    if (!loading && blob) {
                        resolve(blob);
                    } else if (error) {
                        reject(error);
                    }
                    return null;
                }}
            </BlobProvider>,
            document.createElement('div')
        );
    });
};

async function createAndDownloadZip(pdfBlobs: Blob[]) {
    const zip = new JSZip();
    pdfBlobs.forEach((blob, index) => {
        zip.file(`document-${index + 1}.pdf`, blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'documents.zip');
}

export const DButton = () => {
    return <Button onClick={generatePdf}>DZ</Button>;
};
