const regExpDomainHost = new RegExp(/^(?!:\/\/)()([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/)
const regExpDomainIp = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)

const request = new XMLHttpRequest()
const ERRORS = [ '',
  (x) =>
    x.innerHTML = "User denied the request for Geolocation.",
  (x) =>
    x.innerHTML = "Location information is unavailable.",
  (x) =>
    x.innerHTML = "The request to get user location timed out."
]

 const initMap = ( el ) => () => 
  new google.maps.Map(document.getElementById( el ), {
    center: { lat: -25.363, lng: -61.044 },
    scrollwheel: false,
    zoom: 2
  })

window.initMap = initMap( `map` )

const getGoogleMap = ( el, options ) => 
  new google.maps.Map( document.getElementById( el ), options )


const addMarker = ( title, map, position ) => 
  new google.maps.Marker({
    map,
    position,
    title
  })

const getZoom = ( type ) => ( type === `own` ) ? 17 : 13

const getPositionCenter = ( response ) => 
  ( { lat: response.lat, lng: response.lon } )

const getMapOptions = ( response, type ) => ( {
  zoom:  getZoom( type ),
  center: getPositionCenter( response ),
  scrollwheel: false
})

const showMapWithMarker = ( title, type = `own` ) => ( response ) => 
  addMarker(  title,
              getGoogleMap( 'map', getMapOptions( response, type ) ),
              getPositionCenter( response ))

const getData = (data) => JSON.parse(data)

const success = (title) => ( data ) => {
  const result = getData(data)
  showMapWithMarker( title, `url` )( { lat: result.lat, lon: result.lon } )
}

const testDomain = ( regex, domain ) =>
  regex.test( domain )

const showErrorNotDomain = ( value ) => 
  alert( `Domain is required! Value: ${value} is invalid!` )

const getValueFromId = ( id ) => document.getElementById( id ).value

const getValueByIdDomain = ( id ) =>
  ( testDomain(regExpDomainHost, document.getElementById( id ).value) || 
    testDomain(regExpDomainIp, document.getElementById( id ).value) )
    ? getValueFromId( id )
    : showErrorNotDomain(getValueFromId( id ) )

const inputGetDomain = () => getDomainUrl( getValueByIdDomain( `domain` ) )

const inputGetOwn = () => getOnwLocation()

const buttonGetDomainLocation = document.getElementById( `getDomainLocation` )
                                     .addEventListener( `click`, inputGetDomain )

const buttonGetOwnLocation = document.getElementById( `getOwnLocation` )
                                    .addEventListener( `click`, inputGetOwn )


const getDomainUrl = ( url ) => {

  request.open( `GET`, `http://ip-api.com/json/` + url, true )
  request.onload = () => {

    ( request.status >= 200 && 
      request.status < 400 && 
      JSON.parse( request.responseText ).status != 'fail' )
        ? success( url )( request.responseText )
        : showErrorNotDomain( url )

  }
  request.send()
}


const getOnwLocation = () => {
  const orShowError = ( err ) =>
    ERRORS[ err.code ]( document.getElementById( `coordinates` ), 
                        err.message )

  const andShowYourLocation = ( pos ) => {
    const crd = pos.coords

    console.log('Sua posição atual é:')
    console.log('Latitude : ' + crd.latitude)
    console.log('Longitude: ' + crd.longitude)
    console.log('Mais ou menos ' + crd.accuracy + ' metros.')

    showMapWithMarker( `eu` )( { lat: crd.latitude, lon: crd.longitude } )
  }

  navigator.geolocation.getCurrentPosition( andShowYourLocation, orShowError )
}

