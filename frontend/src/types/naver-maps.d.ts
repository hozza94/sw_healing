declare global {
  interface Window {
    naver: {
      maps: {
        Map: any;
        LatLng: any;
        Marker: any;
        InfoWindow: any;
        Event: any;
        MapTypeControlStyle: any;
      };
    };
  }
}

export {}; 