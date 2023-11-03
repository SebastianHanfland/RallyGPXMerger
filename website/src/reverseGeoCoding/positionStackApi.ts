export const positionStackFetchAddress =
    (apiKey: string) =>
    async (lat: number = -34.93129, lng: number = 138.59669) =>
        fetch(`http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${lat},${lng}`).then((response) => {
            if (response.ok) {
                return response.json().then((add) => add.data);
            }
        });
