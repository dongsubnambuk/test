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
  const [currentPosition, setCurrentPosition] = useState(null); // 현재 위치

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]); // 초기 위치 설정
          setPath((prevPath) => [...prevPath, [latitude, longitude]]);
        },
        (error) => console.error("위치 추적 중 오류 발생:", error),
        { enableHighAccuracy: true }
      );

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPath((prevPath) => [...prevPath, [latitude, longitude]]);
          setCurrentPosition([latitude, longitude]); // 현재 위치 업데이트
        },
        (error) => console.error("위치 추적 중 오류 발생:", error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation을 사용할 수 없습니다.");
    }
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {currentPosition ? (
        <MapContainer
          center={currentPosition} // 현재 위치를 중심으로 설정
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
        <p>현재 위치를 가져오는 중...</p>
      )}
    </div>
  );
};

export default LocationTracker;
