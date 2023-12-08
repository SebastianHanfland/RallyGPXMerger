interface BigDataCloudResponse {
    postcode: number;
    localityInfo: {
        informative: [
            {
                name: string;
                order: number;
            }
        ];
    };
}

export const fetchPostCodeForCoordinate =
    (apiKey: string) =>
    async (lat: number, lon: number): Promise<{ postCode: number; district?: string }> => {
        return fetch(`https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&key=${apiKey}`)
            .then((response) => response.json())
            .then((result: BigDataCloudResponse) => {
                return {
                    postCode: result.postcode,
                    district: result.localityInfo.informative.find((entry) => entry.order === 7)?.name,
                };
            })
            .catch((error) => {
                console.log('error', error);
                return {
                    postCode: -1,
                };
            });
    };
