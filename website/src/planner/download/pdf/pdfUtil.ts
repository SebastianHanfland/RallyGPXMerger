import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const styles = {
    linkStyle: {
        color: 'blue',
    },
    headerStyle: {
        bold: true,
    },
    titleStyle: {
        bold: true,
        fontSize: 15,
    },
};
