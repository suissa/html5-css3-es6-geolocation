const MAP = {
  domain: false
}
const regExpDomainHost = new RegExp(/^(?!:\/\/)()([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/)
const regExpDomainIp = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)

const defaultMapOptions = {
  center: { lat: -25.363, lng: -61.044 },
  scrollwheel: false,
  zoom: 2
}
const initMap = ( el ) => () => 
  new google.maps.Map( document.getElementById( el ), defaultMapOptions )

window.initMap = initMap( `map` )

const ERRORS = [ '',
  (x) =>
    x.innerHTML = "User denied the request for Geolocation.",
  (x) =>
    x.innerHTML = "Location information is unavailable.",
  (x) =>
    x.innerHTML = "The request to get user location timed out."
]

const getData = (data) => JSON.parse(data)

const testDomain = ( regex, domain ) =>
  regex.test( domain )

const getGoogleMap = ( el, options ) => 
  new google.maps.Map( document.getElementById( el ), options )

const getZoom = ( type ) => ( type === `own` ) ? 17 : 13

const getMapOptions = ( response, type ) => ( {
  zoom:  getZoom( type ),
  center: getPositionCenter( response ),
  scrollwheel: false
})

const getPositionCenter = ( response ) => 
  ( { lat: response.lat, lng: response.lon } )

const addMarker = ( title, map, position ) => 
  new google.maps.Marker({
    map,
    position,
    title
  })

const showMapWithMarkerFor = ( title, type = `own` ) => ( response ) => 
  addMarker(  title,
              getGoogleMap( 'map', getMapOptions( response, type ) ),
              getPositionCenter( response ))


const successDomainWith = ( title, type = `url` ) => ( data ) => {
  const result = getData(data)

  window.scrollTo(0, 600)

  MAP.domain = () => 
    showMapWithMarkerFor( title, type )( { lat: result.lat, lon: result.lon } )

  return MAP.domain()
}


const showErrorNotDomain = ( value ) => 
  alert( `Domain is required! Value: ${value} is invalid!` )

const getValueFromId = ( id ) => document.getElementById( id ).value

const getValueByIdDomain = ( id ) =>
  ( testDomain(regExpDomainHost, document.getElementById( id ).value) || 
    testDomain(regExpDomainIp, document.getElementById( id ).value) )
    ? getValueFromId( id )
    : showErrorNotDomain(getValueFromId( id ) )

const resetMap = () => 
  ( MAP.domain )
    ? MAP.domain()
    : window.initMap()


const inputGetDomain = () => getDomainUrl( getValueByIdDomain( `domain` ) )

const inputGetOwn = () => getOnwLocation()

const inputResetMap = () => resetMap()

const buttonGetDomainLocation = document.getElementById( `getDomainLocation` )
                                     .addEventListener( `click`, inputGetDomain )

const buttonGetOwnLocation = document.getElementById( `getOwnLocation` )
                                    .addEventListener( `click`, inputGetOwn )

const buttonReset = document.getElementById( `resetMap` )
                                    .addEventListener( `click`, inputResetMap )

const getDomainUrl = ( url ) => {

  const request = new XMLHttpRequest()
  request.open( `GET`, `http://ip-api.com/json/` + url, true )
  request.onload = () => {
    ( request.status >= 200 && 
      request.status < 400 && 
      JSON.parse( request.responseText ).status != 'fail' )
        ? successDomainWith( url )( request.responseText )
        : showErrorNotDomain( url )

  }
  request.send()
}

const orShowError = ( err ) =>
  ERRORS[ err.code ]( document.getElementById( `coordinates` ), 
                      err.message )

const getCurrentPositionFrom = ( geolocation, andShowYourLocation, orShowError ) =>
  geolocation.getCurrentPosition( andShowYourLocation, orShowError )


const andShowYourLocation = ( pos ) => {
  const position = pos.coords

  console.log('Sua posição atual é:')
  console.log('Latitude : ' + position.latitude)
  console.log('Longitude: ' + position.longitude)
  console.log('Mais ou menos ' + position.accuracy + ' metros.')

  window.scrollTo(0, 600)
  return showMapWithMarkerFor ( `Me` )
                              ( { lat: position.latitude, 
                                  lon: position.longitude } )
}

const getOnwLocation = () => {


  return getCurrentPositionFrom(  navigator.geolocation, 
                                  andShowYourLocation, 
                                  orShowError )
  // 
}

