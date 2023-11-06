import { useEffect, useState } from "react";

type UseLocation =
  | { longitude: number; latitude: number }
  | { longitude: null; latitude: null };

const useLocation = () => {
  const [coords, setCoords] = useState<UseLocation>({
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
  }, []);

  return coords;
};

export default useLocation;
