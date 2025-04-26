import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

try {
    // @ts-ignore
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
} catch (error) {
    console.error('pdfmake error', error);
}

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
