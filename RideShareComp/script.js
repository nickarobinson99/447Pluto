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
    await console.log(response)
    const response_json = await response.json();

    console.log(response_json);
    for (const ride of response_json.cost_estimates) {
        if (ride.ride_type == 'lyft') {
            add_comparison(ride.estimated_duration_seconds / 60, ((ride.estimated_cost_cents_max + ride.estimated_cost_cents_min) / 2) / 100, "Lyft");
        }
    }
}

// time in seconds, cost in dollars, title of ride app being compared
const add_comparison = (time, cost, name) => {
    var c = parseFloat(cost);
    c.toFixed(2);
    var t = parseFloat(time);
    t.toFixed(1)
    $('#comparison_container').append(`
    <div class="row justify-content-center" style="margin-top: 10px">
    <div class="col justify-content-center">
        <div class="card" style="max-width: 510px;">
            <div class="card-header">
                <h5 class="card-title">${name}</h5>
            </div>
            <div class="card-body">
                <p class="card-text">Travel Time: ${t.toFixed(1)} minutes</p>
                <p class="card-text">Cost: $${c.toFixed(2)}</p>
            </div>
        </div>
    </div>
    
</div>
    `);
}