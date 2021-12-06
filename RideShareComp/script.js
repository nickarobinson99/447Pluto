let src_autocomplete;
let dst_autocomplete;

var src_lng;
var src_lat;
var dst_lng;
var dst_lat;

function initAutocomplete() {
    src_autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('src_autocomplete'),
    {
        types: ['establishment'],
        comonpentRestrictions: {'country': ['AU']},
        fields: ['place_id', 'name', 'geometry']
    });

    dst_autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('dst_autocomplete'),
        {
            types: ['establishment'],
            comonpentRestrictions: {'country': ['AU']},
            fields: ['place_id', 'name', 'geometry']
        });
    src_autocomplete.addListener('place_changed', onPlaceChanged_src);
    dst_autocomplete.addListener('place_changed', onPlaceChanged_dst);

}

function onPlaceChanged_src() {
    var place = src_autocomplete.getPlace();
    document.getElementById('src_autocomplete').placeholder = 'Enter a place';
    src_lat = place.geometry.location.lat();
    src_lng = place.geometry.location.lng();
    if ((src_lat && src_lng) && (dst_lat && dst_lng)) {
        construct_requests();
    }
}

function onPlaceChanged_dst() {
    var place = dst_autocomplete.getPlace();
    document.getElementById('dst_autocomplete').placeholder = 'Enter a place';
    dst_lat = place.geometry.location.lat();
    dst_lng = place.geometry.location.lng();
    if ((src_lat && src_lng) && (dst_lat && dst_lng)) {
        construct_requests();
    }
}

function construct_requests() {
    var lyft_url = `https://serene-cove-09211.herokuapp.com/https://www.lyft.com/api/costs?start_lat=${src_lat}&start_lng=${src_lng}&end_lat=${dst_lat}&end_lng=${dst_lng}`
    submit_lyft(lyft_url);
}   

const submit_lyft = async (url) => {
    const response = await fetch(url);
    const response_json = await response.json();

    console.log(response_json);
}