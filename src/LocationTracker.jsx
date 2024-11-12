import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 기본 마커 아이콘 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationTracker = () => {
  const [path, setPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 위치 권한 요청 및 위치 추적
    const requestLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition([latitude, longitude]);
            setPath((prevPath) => [...prevPath, [latitude, longitude]]);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setError("위치 권한이 필요합니다. 권한을 허용해주세요.");
            } else {
              setError("위치를 가져오는 중 오류가 발생했습니다.");
            }
          },
          { enableHighAccuracy: true }
        );

        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPath((prevPath) => [...prevPath, [latitude, longitude]]);
            setCurrentPosition([latitude, longitude]);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setError("위치 권한이 필요합니다. 권한을 허용해주세요.");
            } else {
              setError("위치를 가져오는 중 오류가 발생했습니다.");
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        setError("Geolocation을 사용할 수 없습니다.");
      }
    };

    requestLocation();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {error ? (
        <p>{error}</p>
      ) : currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {path.length > 0 && (
            <>
              <Polyline positions={path} color="blue" />
              <Marker position={currentPosition} />
            </>
          )}
        </MapContainer>
      ) : (
        <p>위치를 가져오는 중...</p>
      )}
    </div>
  );
};

export default LocationTracker;
