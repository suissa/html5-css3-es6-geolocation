const usingClick = `click`
const REGEX = {}
const MAP = {
  domain: false
}
const defaultMapOptions = {
  center: { lat: -25.363, lng: -61.044 },
  scrollwheel: false,
  zoom: 2
}

REGEX.DomainHost = new RegExp(/([-a-zA-Z0-9:%_\+.~#?&//=]*)/)
REGEX.DomainIp = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)

const hideLoading = () =>  {
  window.scrollTo(0, 600)
  document.getElementById( `loading` ).style.display = `none`
}

const showLoading = () => {
  window.scrollTo(0, 0)
  document.getElementById( `loading` ).style.display = `block`
}

const addLoadingScreenTo = ( element ) => () => {
  const buttons = document.querySelectorAll( element );
  for (i = 0; i < buttons.length - 1; i++)  // dont want Reset button
    buttons[i].addEventListener( `click`, showLoading )
}

window.addEventListener( `load`, addLoadingScreenTo( `button` ) )

const elementId = ( id ) => document.getElementById( id )
const addEventTo = ( el, event, andRun ) => 
  el.addEventListener( event, andRun ) 

const initMap = ( el ) => () => 
  new google.maps.Map( elementId( el ), defaultMapOptions )

window.initMap = initMap( `map` )

const ERRORS = [ '',
  (x) =>
    x.innerHTML = "User denied the request for Geolocation.",
  (x) =>
    x.innerHTML = "Location information is unavailable.",
  (x) =>
    x.innerHTML = "The request to get user location timed out."
]

const testREGEXDomain = ( REGEX, id ) => 
  testDomain(REGEX.DomainHost, getValueFromId( id ) ) || 
  testDomain(REGEX.DomainIp, getValueFromId( id ) )

const getValueFromId = ( id ) => elementId( id ).value

const getValueByIdDomain = ( id ) =>
  ( testREGEXDomain( REGEX, id ) )
    ? getValueFromId( id )
    : showErrorNotDomain(getValueFromId( id ) )

const resetMap = () => 
  ( MAP.domain )
    ? MAP.domain()
    : window.initMap()

const forGetDomainLocation = () => getDomainUrl( getValueByIdDomain( `domain` ) )
const forGetYourOwnLocation = () => getOnwLocation()
const forResetMap = () => resetMap()

const buttonGetDomainLocation = addEventTo( elementId( `getDomainLocation` ),
                                            usingClick, 
                                            forGetDomainLocation )

const buttonGetOwnLocation = addEventTo( elementId( `getOwnLocation` ),
                                            usingClick, 
                                            forGetYourOwnLocation )

const buttonReset = addEventTo( elementId( `resetMap` ),
                                            usingClick, 
                                            forResetMap )

const testDomain = ( regex, domain ) =>
  regex.test( domain )

const getData = ( data ) => JSON.parse( data )

const getGoogleMap = ( el, options ) => {

  new google.maps.Map( elementId( el ), options )
}
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

  // window.scrollTo(0, 600)
  hideLoading()
  MAP.domain = () => 
    showMapWithMarkerFor( title, type )( { lat: result.lat, lon: result.lon } )

  return MAP.domain()
}

const showErrorNotDomain = ( value ) => 
  alert( `Domain is required! Value: ${value} is invalid!` )

const orShowError = ( err ) =>
  ERRORS[ err.code ]( elementId( `coordinates` ), 
                      err.message )

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

const getCurrentPositionFrom = ( geolocation, andShowYourLocation, orShowError ) => {

  // (map) 
    return geolocation.getCurrentPosition( andShowYourLocation, orShowError )
}

const logYourPosition = ( position ) => {

  console.log('Sua posição atual é:')
  console.log(`Latitude : ${position.latitude}`)
  console.log(`Longitude: ${position.longitude}`)
  console.log(`Mais ou menos ${position.accuracy} metros.`)

}

const andShowYourLocation = ( pos ) => {
  const position = pos.coords

  hideLoading()
  logYourPosition( position )

  return showMapWithMarkerFor ( `Me` )
                              ( { lat: position.latitude, 
                                  lon: position.longitude } )
}

const getOnwLocation = () => 
  getCurrentPositionFrom( navigator.geolocation, 
                          andShowYourLocation, 
                          orShowError )

