import * as React from 'react';
import { useState, useCallback } from 'react';
import MapGL, {Marker} from '@goongmaps/goong-map-react';
import Pin from './Pin';
import axios from "axios";

const GOONG_MAPTILES_KEY = '51A4cOnvIY6pcLFWCwwQWPYC04dtxPKTrPBCSZhO'; // GOONG MAP API TOKEN
// TDShop access token
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbnRlc3QxIiwiZm5hbWUiOiJRdWFuZyIsImxuYW1lIjoiS2UiLCJyb2xlIjoiUk9MRV9BRE1JTiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9sb2dpbiIsImlkIjoiMSIsImV4cCI6MTY4NTUyMzAxNn0.TZ6lNUzmaO3e6GeS5a6pF1iznIlBNI7SaRiWSOqqaPQ';

function Map() {
  const [viewport, setViewport] = useState({
    width: 1000,
    height: 1000,
    latitude: 10.853656481548638, // Địa điểm khi load map
    longitude: 106.76417453109818, // Địa điểm khi load map
    zoom: 14
  });

  // Địa điểm hiện tại của người dùng
  const [marker, setMarker] = useState({
    latitude: 10.853656481548638,
    longitude: 106.76417453109818
  });

  // Bắt sự kiện thay đổi vị trí marker
  const onMarkerDragEnd = useCallback(event => {
    console.log(event)
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
  }, []);

  // Kiểm tra vị trí mới của marker có còn nằm trong phường xã người dùng chọn hay không
  // Response
  // result: true/false còn nằm hay ko
  // addressLocation: tên phường xã người dùng chọn (input chọn wards)
  // chosenLocation: tên phường xã marker đang ở
  // addressLocation, chosenLocation có thể là tên quận huyện tỉnh thành nếu data phường xã không có. BE đã xử lý phần này
  function checkLocation() {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
      "lat": marker.latitude,
      "lng": marker.longitude,
      "wardsId": 26815
    };
    axios.post(
      'https://tdshop.herokuapp.com/api/v1/location/check-coordinates-valid',
      bodyParameters,
      config
    ).then((response) => console.log(response))
  }

  return (
    <React.Fragment>
      <MapGL
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        goongApiAccessToken={GOONG_MAPTILES_KEY}
      >
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            draggable
            onDragEnd={onMarkerDragEnd}
          >
            <Pin size={30} />
          </Marker>
      </MapGL>
      <button onClick={checkLocation}>Check location</button>
    </React.Fragment>
  );
}

export default Map;