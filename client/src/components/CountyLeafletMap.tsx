import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTY_POINTS, countyPoint } from "../data/countyMap";

interface Props {
  counts: Record<string, number>;
  selected?: string | null;
  onSelect?: (county: string) => void;
  heightClass?: string;
  interactive?: boolean;
  zoom?: number;
  center?: [number, number];
}

function FlyToSelected({ selected }: { selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    const point = selected ? countyPoint(selected) : undefined;
    if (point) map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 9), { duration: 0.6 });
  }, [selected, map]);
  return null;
}

export default function CountyLeafletMap({
  counts,
  selected = null,
  onSelect,
  heightClass = "h-[560px]",
  interactive = true,
  zoom = 7.2,
  center = [23.7, 120.9],
}: Props) {
  const max = Math.max(1, ...Object.values(counts));

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      touchZoom={interactive}
      doubleClickZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      zoomControl={interactive}
      className={`${heightClass} w-full max-w-[420px] rounded-[10px]`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected selected={selected} />
      {COUNTY_POINTS.map((c) => {
        const count = counts[c.name] || 0;
        const radius = 5 + (count / max) * 22;
        const active = selected === c.name;
        return (
          <CircleMarker
            key={c.name}
            center={[c.lat, c.lng]}
            radius={radius}
            pathOptions={{
              color: active ? "#332C1C" : "#F6F2E4",
              weight: active ? 2.5 : 1.5,
              fillColor: "#2D8B9E",
              fillOpacity: active ? 0.75 : 0.5,
            }}
            eventHandlers={onSelect ? { click: () => onSelect(c.name) } : undefined}
          >
            <Tooltip direction="top" offset={[0, -radius]}>
              {c.name} · {count.toLocaleString()}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
