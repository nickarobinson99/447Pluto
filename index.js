const TAXI_COST_KM = 1.38;
const TAXI_COST_BASE = 1.8;
let DISTANCE_FROM_TAXI;

let src_autocomplete;
let dst_autocomplete;

var src_lng;
var src_lat;


var dst_lng;
var dst_lat;

var distance_from_taxi_api;

var DIRECTIONS_SERVICE
var DIRECTIONS_RENDERER

function init(){
    initAutocomplete();
    initMap();
    
    
}

function initMap() {
    const directionsService = new google.maps.DirectionsService();
    DIRECTIONS_SERVICE = directionsService;
    
    const directionsRenderer = new google.maps.DirectionsRenderer();
    DIRECTIONS_RENDERER = directionsRenderer;
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    });
  
    directionsRenderer.setMap(map);
  
    const onChangeHandler = function () {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    };
  
    var el = document.getElementById("clickMe");
    if (el.addEventListener)
      el.addEventListener("click", onChangeHandler, false);
    else if (el.attachEvent)
      el.attachEvent('onclick', onChangeHandler);
  }
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
const onChangeHandler = function () {
    calculateAndDisplayRoute(DIRECTIONS_SERVICE, DIRECTIONS_RENDERER);
};
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var place = src_autocomplete.getPlace();
    var place2 = dst_autocomplete.getPlace();
    directionsService
      .route({
        origin: {
          query: place.name,
        },
        destination: {
          query: place2.name,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
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
    var taxi_url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=WN5ptdhYoHgYROta4bQZ&app_code=7XTPif-nqp4BmHlX5CJzsg&waypoint0=geo!${src_lat},${src_lng}&waypoint1=geo!${dst_lat},${dst_lng}&mode=balanced;car;traffic:disabled&alternatives=0&language=en&routeAttributes=summary,shape&requestId=44564506625241654`
    calculateAndDisplayRoute(DIRECTIONS_SERVICE, DIRECTIONS_RENDERER);
    submit_lyft(lyft_url);
    submit_taxi(taxi_url);
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
const submit_taxi = async (url) => {
    console.log(`submit_taxi called with payload ${url}`)
    const response = await fetch(url);
    await console.log(response);
    const response_json = await response.json();

    console.log(response_json);
    let summary = await response_json.response.route[0].summary;
    let cost = TAXI_COST_BASE + ((summary.distance / 1000) * TAXI_COST_KM)
    let time_min = summary.travelTime / 60
    DISTANCE_FROM_TAXI = summary.distance;
    submit_spin();
    add_comparison(time_min, cost, "Taxi");

}

const submit_spin = async () => {
    const ASSUMED_SPEED = 11.25 //11.25km/h or 7 mph - probable average speed for most trips
    const SPIN_BASE_UNLOCK = 1 // $1
    const SPIN_AVERAGE_PRICE_PER_MINUTE = 0.27 // $0.27/minute
    let assumed_time = (((DISTANCE_FROM_TAXI / 1000) / ASSUMED_SPEED) * 60);
    cost = SPIN_BASE_UNLOCK + (assumed_time * SPIN_AVERAGE_PRICE_PER_MINUTE);

    add_comparison(assumed_time, cost, "Spin Scooters")
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