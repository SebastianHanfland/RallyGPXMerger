import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { usePDF } from '@react-pdf/renderer';
import { TrackStreetsPdf } from './TrackStreetsPdf.tsx';
import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import FileSaver from 'file-saver';

interface Props {
    trackStreets: TrackStreetInfo;
    planningLabel?: string;
}

export const TrackInfoPdfDownloadButton = ({ trackStreets, planningLabel }: Props) => {
    const intl = useIntl();

    const [instance] = usePDF({
        document: <TrackStreetsPdf trackStreets={trackStreets} intl={intl} planningLabel={planningLabel} />,
    });

    if (instance.loading) {
        return <div>Loading ...</div>;
    }

    if (instance.error) {
        return <div>Something went wrong: {instance.error}</div>;
    }

    const downloadPdf = () => {
        instance.blob;
        if (instance.blob) {
            FileSaver.saveAs(instance.blob, `${trackStreets.name}.pdf`);
        }
    };

    return (
        <Button size={'sm'} className={'m-1'} onClick={downloadPdf}>
            <DownloadIcon />
            PDF
        </Button>
    );
};
