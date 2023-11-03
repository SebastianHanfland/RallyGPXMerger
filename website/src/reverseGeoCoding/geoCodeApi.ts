export async function geoCodefetchAddress(lat: number = -34.93129, lng: number = 138.59669) {
    return fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`).then((response) => {
        if (response.ok) {
            return response.json().then((add) => add.address.road);
        }
    });
}
