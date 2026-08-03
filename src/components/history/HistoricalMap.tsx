import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number;
  longitude: number;
  title: string;
};

export default function HistoricalMap({
  latitude,
  longitude,
  title,
}: Props) {

  const [Map, setMap] = useState<any>(null);

  useEffect(() => {

    async function load() {

      const L = await import("leaflet");

      const RL = await import("react-leaflet");

      const markerIcon = new L.Icon({

        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

        iconSize: [25, 41],

        iconAnchor: [12, 41],

      });

      setMap({

        ...RL,

        markerIcon,

      });

    }

    load();

  }, []);

  if (!Map) {

    return (

      <div className="h-[450px] flex items-center justify-center">

        جاري تحميل الخريطة...

      </div>

    );

  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    markerIcon,
  } = Map;

  return (

    <MapContainer
      center={[latitude, longitude]}
      zoom={6}
      scrollWheelZoom
      className="h-[450px] w-full rounded-xl"
    >

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        icon={markerIcon}
      >

        <Popup>

          <strong>{title}</strong>

        </Popup>

      </Marker>

    </MapContainer>

  );

}