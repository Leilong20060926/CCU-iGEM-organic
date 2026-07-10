import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GeocodePrecision } from "../types";

const ZOOM_BY_PRECISION: Record<GeocodePrecision, number> = {
  address: 16.5,
  street: 15.5,
  district: 13,
  county: 10,
};

interface Props {
  lat: number;
  lng: number;
  precision: GeocodePrecision;
  heightClass?: string;
}

export default function AddressPinMap({ lat, lng, precision, heightClass = "h-[200px]" }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={ZOOM_BY_PRECISION[precision]}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      zoomControl={false}
      className={`${heightClass} w-full max-w-[420px] rounded-[10px]`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={9}
        pathOptions={{ color: "#332C1C", weight: 2, fillColor: "#B8860B", fillOpacity: 0.85 }}
      />
    </MapContainer>
  );
}
