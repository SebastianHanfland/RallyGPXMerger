export const locationIqFetchAddress =
    (apiKey: string) =>
    async (lat: number = -34.93129, lng: number = 138.59669) => {
        const options = { method: 'GET', headers: { accept: 'application/json' } };

        return fetch(`https://us1.locationiq.com/v1/reverse?lat=${lat}&lon=${lng}&format=json&key=${apiKey}`, options)
            .then((response) => response.json())
            .then((response) => response.address.road)
            .catch((err) => console.error(err));
    };
