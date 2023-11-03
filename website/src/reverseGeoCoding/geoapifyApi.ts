export const geoapifyFetchAddress =
    (apiKey: string) =>
    async (lat: number = -34.93129, lng: number = 138.59669) =>
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`)
            .then((response: any) => response.json())
            .then((result: any) => result.features[0].properties.street)
            .catch((error: any) => console.log('error', error));
