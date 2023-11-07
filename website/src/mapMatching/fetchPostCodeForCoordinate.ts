export const fetchPostCodeForCoordinate =
    (apiKey: string) =>
    async (lat: number = -34.93129, lon: number = 138.59669): Promise<number> => {
        return fetch(`https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&key=${apiKey}`)
            .then((response) => response.json())
            .then((result: { postcode: number }) => {
                return result.postcode;
            })
            .catch((error) => {
                console.log('error', error);
                return -1;
            });
    };
