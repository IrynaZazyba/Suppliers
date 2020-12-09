import {DirectionsRenderer, GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import React from "react";

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={15}
        defaultCenter={props.mapCenter}>
        <Marker position={props.mapCenter}/>
        <DirectionsRenderer
            directions={props.directions}
        />
    </GoogleMap>
));

export default MyMapComponent;
