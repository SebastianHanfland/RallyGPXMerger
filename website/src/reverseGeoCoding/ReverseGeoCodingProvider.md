# Reverse Geo Coding Provider

Reverse Geo Coding means resolving coordinates (lat, lng) into an address.
This feature is required to create a list of streets for the rally

| Provider                          | Request limit in free | Rate limit          | Remarks                 | Response Size | Priority to test |
| --------------------------------- | --------------------- | ------------------- | ----------------------- | ------------- | ---------------- |
| https://geocode.maps.co/          | unlimited             | 2 Requests / second | Good choice             | 651 b         | 1.               |
| https://positionstack.com/product | 25.000 per month      | unknown             | Requires an API Key     | 1650 b        | 3.               |
| https://www.geoapify.com/pricing  | 3.000 per day         | 5 requests/second   | Requires an API Key     | 2270 b        | 5.               |
| https://locationiq.com/pricing    | 5.000 per day         | 1 requests/second   | Requires an API Key     | 982 b         | 4.               |
| https://www.feroeg.com/Demo.html  | unknown               | unknown             | Might be a bit unmature | 690 b         | 2.               |
