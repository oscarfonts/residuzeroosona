import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT} from '../config';

const MainContent = ({mapStyle}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  return <Map
    mapStyle={mapStyle}
    viewport={viewport}
    onViewportChange={setViewport}
    // mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN} // Token necesario para ver datos de mapbox o usar mapbox-gl-js v2 (react-map-gl 6)
  />;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired
};

export default MainContent;
