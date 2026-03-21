import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    table: {
        width: '100%',
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
    // So Declarative and unDRY 👌
    col1: {
        width: '27%',
    },
    col2: {
        width: '15%',
    },
    col3: {
        width: '15%',
    },
    col4: {
        width: '20%',
    },
    col5: {
        width: '27%',
    },
});

export const ReportTable = ({
    data,
    maximumDays,
}: {
    data: { lastName: string; firstName: string; startDate: string; endDate: string; days: number; info: string }[];
    maximumDays: number;
}) => {
    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={styles.col1}>Name</Text>
                <Text style={styles.col2}>Start Date</Text>
                <Text style={styles.col3}>End Date</Text>
                <Text style={styles.col4}>Days</Text>
                <Text style={styles.col5}>Info</Text>
            </View>
            {data.map((row, i) => (
                <View key={i} style={styles.row} wrap={false}>
                    <Text style={styles.col1}>
                        <Text style={styles.bold}>{row.lastName}</Text>, {row.firstName}
                    </Text>
                    <Text style={styles.col2}>{row.startDate}</Text>
                    <Text style={styles.col3}>{row.endDate}</Text>
                    <Text style={styles.col4}>
                        <Text style={styles.bold}>{row.days}</Text> of {maximumDays}
                    </Text>
                    <Text style={styles.col5}>{row.info}</Text>
                </View>
            ))}
        </View>
    );
};
