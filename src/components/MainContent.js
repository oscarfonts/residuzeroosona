import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';

import Map from '@geomatico/geocomponents/Map';
import {Popup} from 'react-map-gl';

import {INITIAL_VIEWPORT, INITIAL_MAPSTYLE_URL} from '../config';
import styled from '@mui/styles/styled';

const PopupWrapper = styled(Popup)({
  cursor: 'default',
  maxWidth: '240px',
  font: '12px/20px Helvetica Neue,Arial,Helvetica,sans-serif',
  '& .mapboxgl-popup-content': {
    border: '1px solid white',
    padding: 0
  }
});

const PopupNom = styled('div')({
  backgroundColor: '#009A3E',
  color: '#013014',
  fontWeight: 600,
  fontSize: '12px',
  textAlign: 'center',
  padding: '6px',
  boxShadow: '0 2px 1px rgba(0,0,0,.2)'
});

const PopupAdreça = styled('div')({
  padding: '10px',
  fontWeight: '500'
});

const PopupDescripcio = styled('div')({
  padding: '10px'
});

const MainContent = ({tipus: colors, locals}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [selectedFeature, setSelectedFeature] = useState();

  const colorMatchArray = Object.entries(colors).flatMap(([key, values]) => [key, values[1]]);

  const sources = {
    'comerços': {
      type: 'geojson',
      data: locals
    }
  };

  const layers = [{
    id: 'punts',
    type: 'circle',
    source: 'comerços',
    layout: {},
    paint: {
      'circle-radius': 5,
      'circle-color': ['match', ['get', 'tipus'],
        ...colorMatchArray,
        '#888888'
      ],
      'circle-opacity': 1,
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 1,
      'circle-stroke-opacity': 1
    }
  }, {
    id: 'etiquetes',
    type: 'symbol',
    source: 'comerços',
    layout: {
      'text-field': ['get', 'nom'],
      'text-font': ['Open Sans Semibold'],   // Tipografies disponibles: https://geoserveis.icgc.cat/contextmaps/glyphs/
      'text-size': 12,
      'text-offset': [0, -1.5],
      'text-anchor': 'center',
      'text-allow-overlap': false
    },
    paint: {
      'text-color': ['match', ['get', 'tipus'],
        ...colorMatchArray,
        '#888888'
      ],
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 1
    }
  }];

  const handleHover = event => event.features[0] && setSelectedFeature(event.features[0]);

  const handleClick = event => setSelectedFeature(event.features[0]);

  const popupContent = useMemo(() => {
    if (selectedFeature) {
      const {tipus, nom, adreça, poblacio, descripcio} = selectedFeature.properties;

      const nomStyle = {
        color: colors[tipus][0],
        backgroundColor: colors[tipus][1]
      };

      return <>
        <PopupNom style={nomStyle}>{nom}</PopupNom>
        <PopupAdreça>{adreça || ''}<br/>{poblacio || ''}</PopupAdreça>
        {descripcio && <PopupDescripcio>{descripcio}</PopupDescripcio>}
      </>;
    } else {
      return null;
    }
  }, [selectedFeature]);

  return <Map
    mapStyle={INITIAL_MAPSTYLE_URL}
    viewport={viewport}
    onViewportChange={setViewport}
    sources={sources}
    layers={layers}
    interactiveLayerIds={['punts']}
    onHover={handleHover}
    onClick={handleClick}
  >
    {selectedFeature && <PopupWrapper
      latitude={selectedFeature.geometry.coordinates[1]}
      longitude={selectedFeature.geometry.coordinates[0]}
      closeButton={false}
      closeOnClick={false}
      onClose={() => setSelectedFeature()}
      anchor="top"
    >
      {popupContent}
    </PopupWrapper>}
  </Map>;
};

MainContent.propTypes = {
  tipus: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired).isRequired,
  locals: PropTypes.shape({
    type: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(
      PropTypes.shape({
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
    )
  })
};

export default MainContent;
