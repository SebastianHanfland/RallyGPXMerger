import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';

const correctionTuples: [string, string][] = [
    ['constituency for the Bundestag election ', ''],
    ['Bundestagswahlkreis ', ''],
    ['Wahlkreis ', ''],
    ['District of  ', ''],
    ['Munchen', 'München'],
    ['Munich', 'München'],
];

function correctDistrict(district: string | undefined): string | undefined {
    if (!district) {
        return undefined;
    }
    let correctDistrict = district;
    correctionTuples.forEach(([find, replacement]) => (correctDistrict = correctDistrict.replace(find, replacement)));
    return correctDistrict;
}

export async function fetchAndStorePostCodeAndDistrict(
    bigDataCloudKey: string,
    streetIndex: number,
    lat: number,
    lon: number
): Promise<{ district: string | undefined; postCode: string; key: number }> {
    return fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then(({ postCode, district }) => {
        return { key: streetIndex, district: correctDistrict(district), postCode: `${postCode}` };
    });
}
