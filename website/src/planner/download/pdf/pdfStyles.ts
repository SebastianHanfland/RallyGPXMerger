import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontSize: 10,
        margin: 20,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    table: {
        width: '90%',
        margin: 10,
        padding: 10,
    },
    streetTable: {
        width: '95%',
        margin: 10,
        padding: 10,
        fontSize: 9,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #EEE',
        paddingTop: 8,
        paddingBottom: 8,
    },
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5,
        fontSize: 14,
    },
    documentTitle: {
        fontWeight: 'bold',
        margin: 10,
        fontSize: 16,
    },
    col1: {
        width: '33%',
    },
    col2: {
        width: '33%',
    },
    col3: {
        width: '34%',
    },
});
