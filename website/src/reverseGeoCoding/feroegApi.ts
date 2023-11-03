export async function feroegFetchAddress(lat: number = -34.93129, lng: number = 138.59669) {
    return fetch(`https://www.feroeg.com/address?lat=${lat}&lon=${lng}`).then((response) => {
        if (response.ok) {
            return response.json().then((add) => add.Result.Address.split(',')[0]);
        }
    });
}
