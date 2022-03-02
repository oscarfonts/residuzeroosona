import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT} from '../config';

const MainContent = ({mapStyle, tipus, locals}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  const colorMatchArray = Object.entries(tipus).flatMap(([key, values]) => [key, values[1]]);

  const sources = {
    locals: {
      type: 'geojson',
      data: locals
    }
  };

  const layers = [{
    id: 'punts',
    source: 'locals',
    type: 'circle'
  }];

  return <Map
    mapStyle={mapStyle}
    viewport={viewport}
    onViewportChange={setViewport}
    sources={sources}
    layers={layers}
  />;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  tipus: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired).isRequired,
  locals: PropTypes.shape({
    type: PropTypes.string.isRequired,
    features: PropTypes.arrayOf({
      properties: PropTypes.shape({
        nom: PropTypes.string.isRequired,
        adreça: PropTypes.string,
        poblacio: PropTypes.string,
        descripcio: PropTypes.string,
        tipus: PropTypes.string.isRequired
      }).isRequired,
      geometry: PropTypes.shape({
        type: PropTypes.string.isRequired,
        coordinates: PropTypes.array.isRequired
      }).isRequired
    })
  })
};

export default MainContent;
