import { getLanguage } from '../../../../language.ts';

type LocalityInfo = { name: string; order: number; description?: string };

interface BigDataCloudResponse {
    postcode: number;
    city?: string;
    localityInfo: {
        informative: [LocalityInfo];
        administrative: [LocalityInfo];
    };
}

function descriptionIncludes(district: string = 'district') {
    return (entry: LocalityInfo) => entry.description?.includes(district);
}

export const fetchPostCodeForCoordinate =
    (apiKey: string) =>
    async (lat: number, lon: number): Promise<{ postCode: number; district?: string }> => {
        const language = getLanguage();
        return fetch(
            `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&key=${apiKey}&localityLanguage=${language}`
        )
            .then((response) => response.json())
            .then((result: BigDataCloudResponse) => {
                return {
                    postCode: result.postcode,
                    district:
                        result.localityInfo.administrative.find(descriptionIncludes('district'))?.name ??
                        result.localityInfo.administrative.find(descriptionIncludes('capital'))?.name ??
                        result.localityInfo.informative.find(descriptionIncludes('district'))?.name ??
                        result.localityInfo.informative.find(descriptionIncludes('capital'))?.name ??
                        result.city,
                };
            })
            .catch((error) => {
                console.log('error', error);
                return {
                    postCode: -1,
                };
            });
    };
