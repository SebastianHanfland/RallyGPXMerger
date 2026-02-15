import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { segmentDataActions } from '../../../store/segmentData.redux.ts';

const correctionTuples: [string, string][] = [
    ['constituency for the Bundestag election ', ''],
    ['Bundestagswahlkreis ', ''],
    ['Wahlkreis ', ''],
    ['Munchen', 'München'],
    ['Munich', 'München'],
];

function correctDistrict(district: string): string {
    let correctDistrict = district;
    correctionTuples.forEach(([find, replacement]) => (correctDistrict = correctDistrict.replace(find, replacement)));
    return correctDistrict;
}

export async function fetchAndStorePostCodeAndDistrict(
    bigDataCloudKey: string,
    streetIndex: number,
    dispatch: Dispatch,
    lat: number,
    lon: number
) {
    return fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then(({ postCode, district }) => {
        batch(() => {
            dispatch(segmentDataActions.addPostCodeLookup({ [streetIndex]: `${postCode}` }));
            if (district) {
                dispatch(segmentDataActions.addDistrictLookup({ [streetIndex]: correctDistrict(district) }));
            }
        });
    });
}
