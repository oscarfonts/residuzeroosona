import React, {useState} from 'react';

import Layout from '../components/Layout';
import SidePanelContent from '../components/SidePanelContent';
import MainContent from '../components/MainContent';

import {INITIAL_MAPSTYLE_URL} from '../config';
import useFetch from '../hooks/useFetch';

const Home = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);

  const {data: rawTipus} = useFetch('https://sheets.googleapis.com/v4/spreadsheets/1fjBWJjionkbsll_YdisD31Houzxcu1nwTbNCVBWvitY/values/Tipus?valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyDZR5KUCYmbQdp6srPiGP6qLhtzZEeq8r4');
  const {data: rawLocals} = useFetch('https://sheets.googleapis.com/v4/spreadsheets/1fjBWJjionkbsll_YdisD31Houzxcu1nwTbNCVBWvitY/values/Locals?valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyDZR5KUCYmbQdp6srPiGP6qLhtzZEeq8r4');

  const tipus = rawTipus ? rawTipus.values
    .slice(1)                             // Elimina la capçalera
    .reduce(
      (obj, row) => {
        obj[row[0]] = [row[2], row[4]];   // Array amb color fosc i clar, per tipus { "Alimentació": ["#134f5c", "#45818e"], ... }
        return obj;
      }, {}
    ) : {};

  //console.log(tipus);

  const locals = {
    type: 'FeatureCollection',
    features: rawLocals ? rawLocals.values
      .slice(1)                                   // Elimina la capçalera
      .filter(row =>                              // Filtra files incorrectes
        row.length >= 5                           // S'esperen al menys 5 columnes de dades on:
        && row[0]                                 //  * La primera ha de tenir algun valor (nom del comerç)
        && row[3] && typeof row[3] === 'number'   //  * La quarta és un valor numèric (lat)
        && row[4] && typeof row[4] === 'number')  //  * La cinquena és un valor numèric (lon)
      .map(row => ({                              // Converteix cada fila en una Feature de tipus Point (GeoJSON)
        type: 'Feature',
        properties: {
          nom: row[0],
          adreça: row[1],
          poblacio: row[2],
          descripcio: row[5],
          tipus: row[6]
        },
        geometry: {
          type: 'Point',
          coordinates: [row[4], row[3]]
        }
      })) : []
  };

  //console.log(locals);

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    onMapStyleChanged={setMapStyle}
  />;

  const mainContent = <MainContent
    mapStyle={mapStyle}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Home;
