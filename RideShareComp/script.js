let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'),
    {
        types: ['establishment'],
        comonpentRestrictions: {'country': ['AU']},
        fields: ['place_id', 'name', 'geometry']
    });

    autocomplete.addListener('place_changed', onPlaceChanged)
}

function onPlaceChanged() {
    var place = autocomplete.getPlace();

    document.getElementById('autocomplete').placeholder = 'Enter a place';
		
		//<!-- These variables store the long lat -->
    var placeLat = place.geometry.location.lat();
    var placeLong = place.geometry.location.lng();
    
    var start_lat = placeLat
    var start_lng = placeLong

    var end_lat = 0.0
    var end_lng = 0.0
                
    var lyft_url = `https://www.lyft.com/api/costs?start_lat=${start_lat}&start_lng=${start_lng}&end_lat=${end_lat}&end_lng=${end_lng}`
    console.log(lyft_url)
}