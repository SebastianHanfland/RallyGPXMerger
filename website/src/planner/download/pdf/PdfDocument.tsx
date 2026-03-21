import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

// Create Document Component
export const MyDocument = () => (
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

export const Bla = () => {
    const [instance] = usePDF({ document: <MyDocument /> });

    if (instance.loading) return <div>Loading ...</div>;

    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    return (
        <a href={instance.url ?? ''} download="test.pdf">
            Download
        </a>
    );
};
