import React, { useState} from "react";
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
  const [showPermissionPopup, setShowPermissionPopup] = useState(true); // 권한 안내 팝업 상태

  // 위치 권한 요청 및 위치 추적 함수
  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setPath((prevPath) => [...prevPath, [latitude, longitude]]);
          setShowPermissionPopup(false); // 팝업 숨김
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError("위치 권한이 필요합니다. 권한을 허용해주세요.");
          } else {
            setError("위치를 가져오는 중 오류가 발생했습니다.");
          }
          setShowPermissionPopup(false); // 팝업 숨김
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

  return (
    <div style={{ height: "100vh" }}>
      {showPermissionPopup && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "8px" }}>
            <p>이 앱은 경로 추적을 위해 위치 권한이 필요합니다. 위치 권한을 허용해주세요.</p>
            <button
              onClick={requestLocationPermission}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              허용
            </button>
          </div>
        </div>
      )}
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
