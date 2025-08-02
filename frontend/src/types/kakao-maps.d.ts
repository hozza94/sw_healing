declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: any;
        LatLng: any;
        Marker: any;
        InfoWindow: any;
        Level: any;
        event: any;
        services: {
          Geocoder: any;
          Status: any;
        };
      };
    };
  }
}

export {}; 