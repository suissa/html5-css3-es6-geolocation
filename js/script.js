
const request = new XMLHttpRequest();
const ERRORS = [ '',
  (x) =>
    x.innerHTML = "User denied the request for Geolocation.",
  (x) =>
    x.innerHTML = "Location information is unavailable.",
  (x) =>
    x.innerHTML = "The request to get user location timed out."
]

 const initMap = ( el ) => () => {
  return new google.maps.Map(document.getElementById( el ), {
    center: { lat: -25.363, lng: -61.044 },
    scrollwheel: false,
    zoom: 2
  });
}

window.initMap = initMap( 'map' )

const getGoogleMap = (el, options) => {
  return new google.maps.Map( document.getElementById( el ), options )
}

const addMarker = (map, position, title) => {
  return new google.maps.Marker({
    map,
    position,
    title
  });
}


const showMapWithMarker = ( title ) => ( response ) => {
  console.log(`response: `, response)
  lat = response.lat
  lng = response.lon

  const options =  {
    center: { lat, lng },
    scrollwheel: false,
    zoom: 7
  }

  return addMarker( getGoogleMap( 'map', options ),
                    { lat, lng },
                    title )
}

const getData = (data) => JSON.parse(data);

const success = (title) => ( data ) => {
  const result = getData(data);
  console.log('RESULT SUCCESS ::; ', result);

  // here

  showMapWithMarker( title )( { lat: result.lat, lon: result.lon } )
}


const testDomain = (regex, domain) => //console.log(regex, domain, regex.test(domain));
  regex.test(domain);

const showErrorNotDomain = (value) => alert('Domain is required! Value: "' + value + '" is invalid!')
const getValueFromId = (id) => document.getElementById(id).value
                          //    ^(?!:\/\/)()([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$
                            //     \b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b
const regExpDomainHost = new RegExp(/^(?!:\/\/)()([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/);
const regExpDomainIp = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);

const getValueByIdDomain = (id) =>
  ( testDomain(regExpDomainHost, document.getElementById(id).value) || testDomain(regExpDomainIp, document.getElementById(id).value) )
    ? getValueFromId(id)
    : showErrorNotDomain(getValueFromId(id))

const inputGetDomain = () => getDomainUrl(getValueByIdDomain('domain'));

const inputGetOwn = () => getOnwLocation();

const buttonGetCoordinates = document.getElementById('getCoordinates')
                                     .addEventListener('click', inputGetDomain)

const buttonGetOwnLocation = document.getElementById('getCoordinatesOwnLocation')
                                    .addEventListener('click', inputGetOwn)



// request.open('GET', 'http://ip-api.com/json/', true);

const getDomainUrl = (url) => {

  request.open('GET', 'http://ip-api.com/json/' + url, true);
  // console.log('REQ ::; ', request.responseText);
  request.onload = () => {
    // let statusResponseText = [];
    // statusResponseText = request.responseText;

    ( request.status >= 200 && request.status < 400 && JSON.parse(request.responseText).status != 'fail' )
            ? success(url)(request.responseText)
            : showErrorNotDomain(url)
      // ( JSON.parse(request.responseText).status === 'fail' )
      //   ? showErrorNotDomain(url)
      //   : ( request.status >= 200 && request.status < 400 )
      //         ? success(request.responseText)
      //         : showErrorNotDomain(url)

  // console.log('REQ ::; ', JSON.parse(request.responseText).status);
  // console.log('statusResponseText ::; ', JSON.parse(statusResponseText).status);

  }
  request.send();
}


const getOnwLocation = () => {
  const error = (err) =>
    ERRORS[err.code](document.getElementById(`coordinates`), err.message)
    // console.warn('ERROR(' + err.code + '): ' + err.message);


  const sucesso = (pos) => {
    var crd = pos.coords;

    console.log('Sua posição atual é:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('Mais ou menos ' + crd.accuracy + ' metros.');

    showMapWithMarker( `eu` )( { lat: crd.latitude, lon: crd.longitude } )
  };

  navigator.geolocation.getCurrentPosition(sucesso, error);
}

