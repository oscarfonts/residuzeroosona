import {FlyToInterpolator} from 'react-map-gl';

export const INITIAL_VIEWPORT = {
  latitude: 41.93,
  longitude: 2.25,
  zoom: 10,
  bearing: 0,
  pitch: 0,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
};

export const INITIAL_MAPSTYLE_URL = 'https://api.maptiler.com/maps/positron/style.json?key=ifbEAXOPCxJpB6YYyF78';

export const WIDESCREEN_STEP = '770px';
export const DRAWER_WIDTH = '300px';
