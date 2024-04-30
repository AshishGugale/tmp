import polyline from "@mapbox/polyline";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Form,
  Input,
  theme,
  Layout,
  Button,
  notification,
  Steps,
  Tooltip,
} from "antd";
import { api_token } from "../api_secrets.js";
import { CarDetails } from "./CarDetails.js";
// import {web3Object, } from "../integration/Scripts";
import { useNavigate } from "react-router-dom";
import {
  SolutionOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import * as turf from "@turf/turf";
const Content = Layout.Content;
import {
  FloatProposalOnChain,
  web3Object,
  markFulfilmentOnChain,
} from "../integration/Scripts";
import Header from "./header";

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [long, setLong] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [lat, setLat] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [search, setSearch] = useState(false);
  const mapContainerRef = useRef(null);
  const [coords, setCoords] = useState("");
  const mapRef = useRef(null);
  const directionsControlRef = useRef(null);
  // const polyline = require("@mapbox/polyline");
  const [journey, setJourney] = useState(false);
  const [booked, setBooked] = useState(false);
  const [proposalNum, setProposalNum] = useState(0);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    function successLocation(position) {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
      setLong(position.coords.longitude);
      setLat(position.coords.latitude);
    }
    function errorLocation(error) {
      console.error("Error retrieving location:", error);
    }
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (long !== null && lat !== null) {
      mapboxgl.accessToken = api_token;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [long, lat],
        zoom: 9,
      });
      mapRef.current = map;
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        profile: "mapbox/driving",
        unit: "metric",
      });
      directionsControlRef.current = directions;
      map.addControl(directions, "top-left");
      directions.on("route", handleRoute);
    }
  }, [long, lat]);
  useEffect(() => {
    if (mapRef.current && endLocation) {
      console.log(startLocation);
      console.log(endLocation);
      const metersToPixelsAtMaxZoom = (meters, latitude) =>
        meters / 0.075 / Math.cos((latitude * Math.PI) / 180);
      const radiusInMeters = 200;
      mapRef.current.addLayer({
        id: "circleLayer",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: endLocation,
            },
          },
        },
        paint: {
          "circle-radius": {
            stops: [
              [0, 0],
              [20, metersToPixelsAtMaxZoom(radiusInMeters, endLocation[1])],
            ],
            base: 2,
          },
          "circle-color": "#ff0000",
          "circle-opacity": 0.6,
        },
      });
    }
  }, [endLocation]);
  const handleRoute = (event) => {
    const route = event.route[0];
    console.log(route);
    setStartLocation(route.legs[0].steps[0].maneuver.location);
    setEndLocation(
      route.legs[0].steps[route.legs[0].steps.length - 1].maneuver.location
    );
    const decodedPolyline = polyline.decode(route.geometry);
    setCoords(
      decodedPolyline.map((point) => ({
        lng: point[0],
        lat: point[1],
      }))
    );
  };
  const floatId = 12;
  // Yaha tak ride accept ho chuki hai, yaha se aage simulation ka dekhna hai

  const handleBooking = async () => {
    console.log("Triggered!!");
    FloatProposalOnChain(
      1,
      startLocation[0] * 1e6,
      startLocation[1] * 1e6,
      endLocation[0] * 1e6,
      endLocation[1] * 1e6
    ).then(() => {
      setBooked(true);
      setSearch(false);
      setTimeout(() => {
        setJourney(true);
      }, 15000);
      setShowMessage(true);
    });
    console.log(journey);
  };
  useEffect(() => {
    if (!journey) return;
    async function f() {
      if (startLocation !== "" && coords !== "" && journey) {
        console.log(coords);
        const marker = new mapboxgl.Marker()
          .setLngLat([startLocation[0], startLocation[1]])
          .addTo(mapRef.current);
        let index = 0,
          spec = 0;
        const intervalId = setInterval(() => {
          if (index < coords.length) {
            const lngg = coords[index].lng;
            const latt = coords[index].lat;
            marker.setLngLat([latt, lngg]);
            if (spec === 0 && isInsideGeofence([latt, lngg])) {
              alert("Driver crossed the GeoFence!");
              spec = 1;
            }
            index++;
          } else {
            clearInterval(intervalId);
          }
        }, 30);
      }
    }
    f().then(() => {
      alert("Journey complete, driver can now withdraw the fare amount!!");
    });
  }, [journey]);
  const earthRadius = 6371000;
  const radius = 200;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const geofenceCoordinates = [];
  for (let i = 0; i <= 360; i += 10) {
    const bearing = toRadians(i);
    const lat = Math.asin(
      Math.sin(toRadians(endLocation[1])) * Math.cos(radius / earthRadius) +
        Math.cos(toRadians(endLocation[1])) *
          Math.sin(radius / earthRadius) *
          Math.cos(bearing)
    );
    const lng =
      toRadians(endLocation[0]) +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(radius / earthRadius) *
          Math.cos(toRadians(endLocation[1])),
        Math.cos(radius / earthRadius) -
          Math.sin(toRadians(endLocation[1])) * Math.sin(lat)
      );
    geofenceCoordinates.push([(lng * 180) / Math.PI, (lat * 180) / Math.PI]);
  }
  const isInsideGeofence = (point) => {
    const polygon = turf.polygon([geofenceCoordinates]);
    const pt = turf.point(point);
    return turf.booleanPointInPolygon(pt, polygon);
  };
  return (
    <>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "20px 16px 0",
          overflow: "initial",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          alignItems: "center",
          maxHeight: "100%",
          minHeight: "100vh",
        }}
      >
        {endLocation ? (
          <Button style={{ marginTop: "-50px" }} onClick={handleBooking}>
            Book!!
          </Button>
        ) : (
          <Button style={{ marginTop: "-50px" }} disabled>
            Book!!
          </Button>
        )}
        <div
          ref={mapContainerRef}
          id="map"
          style={{ width: "100%", height: "400px", margin: "20px 20px" }}
        ></div>
      </Content>
    </>
  );
};
export default App;
