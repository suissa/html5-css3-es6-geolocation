# Example of geolocation using HTML5, CSS3 and ES6

![image of a map with markers](http://www.visualatin.agency/wp-content/uploads/2015/10/geolocation-map.jpg)

In this example I used some sweeeet HTML5, CSS3 and ES6 only for show how we do this the right way.

> **Functional Flavored**

## HTML5

```html

<header>

  <h1 class="title">
    Example of geolocation using 
    <br>
    HTML5, CSS3 and ES6 
    <br>
    made with <img class="icon-love" src="imgs/love.png" alt="love">
  </h1>

</header>

<main class="content">

  <p>
    Click Locate button to get domain coordinates.
    <br>
    Click Show Me button to get your coordinates.
  </p> 

  <input  id="domain" class="input" type="url" 
          placeholder="Domain" value="webschool.io">

  <button id ='getDomainLocation' class="button locate">Locate</button>
  <button id ='getOwnLocation' class="button show-me">Show Me</button> 
  <button id ='resetMap' class="button reset-map">Reset</button> 

  <section id="coordinates"></section>

  <section id="map"></section>

</main>

```


## CSS3

## ES6

```js

const MAP = {
  domain: false
}
const usingClick = `click`
const REGEX = {}
REGEX.DomainHost = new RegExp(/^(?!:\/\/)()([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/)
REGEX.DomainIp = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)

const elementId = ( id ) => document.getElementById( id )
const addEventTo = ( el, event, andRun ) => 
  el.addEventListener( event, andRun ) 

const defaultMapOptions = {
  center: { lat: -25.363, lng: -61.044 },
  scrollwheel: false,
  zoom: 2
}
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

const getGoogleMap = ( el, options ) => 
  new google.maps.Map( elementId( el ), options )

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
  (map)
  return geolocation.getCurrentPosition( andShowYourLocation, orShowError )
}

const logYourPosition = ( position ) => {

  console.log('Sua posição atual é:')
  console.log('Latitude : ' + position.latitude)
  console.log('Longitude: ' + position.longitude)
  console.log('Mais ou menos ' + position.accuracy + ' metros.')

}

const andShowYourLocation = ( pos ) => {
  const position = pos.coords
  window.scrollTo(0, 600)

  logYourPosition( position )

  return showMapWithMarkerFor ( `Me` )
                              ( { lat: position.latitude, 
                                  lon: position.longitude } )
}

const getOnwLocation = () => 
  getCurrentPositionFrom( navigator.geolocation, 
                          andShowYourLocation, 
                          orShowError )

```


