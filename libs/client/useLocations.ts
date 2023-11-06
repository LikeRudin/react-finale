import { useEffect, useState } from "react";

type UseLocations =
  | { longitude: number; latitude: number }
  | { longitude: null; latitude: null };

const useLocations = () => {
  const [coords, setCoords] = useState<UseLocations>({
    longitude: null,
    latitude: null,
  });

  const onGeoSuccess = ({
    coords: { longitude, latitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onGeoSuccess);
  });

  return coords;
};
