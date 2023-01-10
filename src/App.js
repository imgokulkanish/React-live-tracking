import React, { createClass } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";
import API_KEY from "./apiKey";
import origPath from "./path";
import stops from "./stops";
const car =
  "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
const icon = {
  path: car,
  scale: 0.7,
  strokeColor: "white",
  strokeWeight: 0.1,
  fillOpacity: 1,
  fillColor: "#404040",
  offset: "5%",
  rotation: 240
  // anchor: new window.google.maps.Point(10, 10)
};

class Map extends React.Component {
  path = [
    {
      lat: 12.9802347063322,
      lng: 77.5907760360903,
      bearing: -20.5784744283754
    },
    {
      lat: 12.9793774204024,
      lng: 77.5910979011596,
      bearing: 17.1118088152409
    },
    {
      lat: 12.9795865148043,
      lng: 77.5911622741734,
      bearing: 70.6690312217414
    },
    {
      lat: 12.9797746996155,
      lng: 77.5916987159555,
      bearing: 38.1233134168197
    },
    {
      lat: 12.9801301594259,
      lng: 77.5919776656823,
      bearing: -45.7414247345699
    },
    {
      lat: 12.9798374278543,
      lng: 77.5922780730802,
      bearing: 16.0994201411847
    },
    {
      lat: 12.9791683258247,
      lng: 77.5920849540387,
      bearing: 35.6916527554558
    },
    {
      lat: 12.9787501361417,
      lng: 77.5917845466407,
      bearing: 58.0502467067782
    },
    {
      lat: 12.9784155838887,
      lng: 77.5912481048586,
      bearing: 64.0233912454979
    },
    {
      lat: 12.9784783124705,
      lng: 77.5913768508863,
      bearing: 45.7412428776673
    },
    {
      lat: 12.9783319457552,
      lng: 77.5912266471873,
      bearing: -69.926654677622
    },
    {
      lat: 12.978394674358,
      lng: 77.591054985817,
      bearing: 16.3413468751341
    },
    {
      lat: 12.9779555738058,
      lng: 77.5909262397893,
      bearing: 54.6749460887583
    },
    {
      lat: 12.9776210204837,
      lng: 77.5904541710211,
      bearing: 64.0233096712307
    },
    {
      lat: 12.9774746532636,
      lng: 77.5901537636231,
      bearing: 65.5464053454266
    },
    {
      lat: 12.9761573444059,
      lng: 77.5872569779997,
      bearing: -66.4029340594377
    },
    {
      lat: 12.9764291706147,
      lng: 77.5866347055324,
      bearing: -48.4630801907934
    },
    {
      lat: 12.9766382674962,
      lng: 77.5863986711483,
      bearing: -54.992843944921
    },
    {
      lat: 12.9771191896563,
      lng: 77.5857120256672,
      bearing: -60.0659370316888
    }
  ];
  state = {
    progress: [],
    directions: null
  };
  stops = [
    {
      lat: 12.9802347063322,
      lng: 77.5907760360903,
      id: "stop1"
    },
    {
      lat: 12.9787501361417,
      lng: 77.5917845466407,
      id: "stop2"
    },
    {
      lat: 12.9771191896563,
      lng: 77.5857120256672,
      id: "stop3"
    }
  ];
  velocity = 100;
  initialDate = new Date();

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000; // pass to seconds
    return differentInTime * this.velocity; // d = v*t -- thanks Newton!
  };

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000);
  };

  componentWillUnmount = () => {
    console.log("CLEAR........");

    window.clearInterval(this.interval);
  };

  moveObject = () => {
    const distance = this.getDistance();
    if (!distance) {
      return;
    }

    let progress = this.path.filter(
      (coordinates) => coordinates.distance < distance
    );

    const nextLine = this.path.find(
      (coordinates) => coordinates.distance > distance
    );

    // console.log(progress, nextLine, distance);
    if (!nextLine) {
      this.setState({ progress });
      window.clearInterval(this.interval);
      return; // it's the end!
    }
    const lastLine = progress[progress.length - 1];

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    );

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    // distance of this line
    const totalDistance = nextLine.distance - lastLine.distance;
    const percentage = (distance - lastLine.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    progress = progress.concat(position);
    this.setState({ progress });
  };

  componentWillMount = () => {
    this.calculatePath();
    console.log(this.path);
  };
  calculatePath = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 }; // it begins here!
      }
      const { lat: lat1, lng: lng1 } = coordinates;
      const latLong1 = new window.google.maps.LatLng(lat1, lng1);

      const { lat: lat2, lng: lng2 } = array[0];
      const latLong2 = new window.google.maps.LatLng(lat2, lng2);

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      );

      return { ...coordinates, distance };
    });
  };
  startSimmulator = () => {
    console.log("RELOAD THE COMPONENT.....");
    // window.clearInterval(this.interval);
    // this.interval = 0;
    // // console.log("hello", this.interval, this.state.progress);
    // this.setState({
    //   progress: []
    // });
    // this.calculatePath();
    // this.interval = window.setInterval(this.moveObject, 1000);
  };

  componentDidUpdate = () => {
    const distance = this.getDistance();
    if (!distance) {
      return;
    }

    let progress = this.path.filter(
      (coordinates) => coordinates.distance < distance
    );

    const nextLine = this.path.find(
      (coordinates) => coordinates.distance > distance
    );

    let point1, point2;

    if (nextLine) {
      point1 = progress[progress.length - 1];
      point2 = nextLine;
    } else {
      // it's the end, so use the latest 2
      point1 = progress[progress.length - 2];
      point2 = progress[progress.length - 1];
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

    const angle = window.google.maps.geometry.spherical.computeHeading(
      point1LatLng,
      point2LatLng
    );
    const actualAngle = angle - 90;

    const markerUrl =
      "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png";
    const marker = document.querySelector(`[src="${markerUrl}"]`);

    if (marker) {
      // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`;
    }
  };

  render = () => {
    const icon1 = {
      url:
        "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
      scaledSize: new window.google.maps.Size(30, 30),
      // anchor: { x: 10, y: 10 },
      anchor: new window.google.maps.Point(15, 15),
      scale: 0.7
    };
    return (
      <>
        <GoogleMap
          defaultZoom={16}
          defaultCenter={{ lat: this.path[0].lat, lng: this.path[0].lng }}
        >
          <button onClick={this.startSimmulator}>Start Simmulator</button>

          <Polyline
            traffic={new window.google.maps.TrafficLayer()}
            path={this.path}
            options={{
              strokeColor: "#0088FF",
              strokeWeight: 6,
              strokeOpacity: 0.6
            }}
          />

          {this.stops.map((stop, index) => (
            <>
              <Marker
                key={stop.id}
                position={{
                  lat: stop.lat,
                  lng: stop.lng
                }}
                title={stop.id}
                label={`${index + 1}`}
              />
            </>
          ))}

          {this.state.progress && (
            <>
              <Polyline
                path={this.state.progress}
                options={{ strokeColor: "pink" }}
              />

              <Marker
                icon={icon1}
                position={this.state.progress[this.state.progress.length - 1]}
              />
            </>
          )}
          {/* <TrafficLayer autoUpdate /> */}
        </GoogleMap>
      </>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));
const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY.mapsOtherkey}`;

export default () => (
  <MapComponent
    googleMapURL={mapURL}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `600px`, width: "600px" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);
