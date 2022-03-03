import React, {useEffect, useMemo, useState} from 'react';

import Layout from '../components/Layout';
import SidePanelContent from '../components/SidePanelContent';
import MainContent from '../components/MainContent';

import useFetch from '../hooks/useFetch';

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

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

  useEffect(() => setSelectedCategories(Object.keys(tipus)), [rawTipus]);

  const categories = Object.keys(tipus).map(t=> ({id: t,  color: tipus[t][1], label: t}));
  const sidePanelContent = <SidePanelContent categories={categories} selectedCategories={selectedCategories} onChangeSelectedCategories={setSelectedCategories} searchText={searchText} setSearchText={setSearchText}/>;

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

  const categoryFilter = feature => selectedCategories.includes(feature.properties.tipus);

  const normalize = string => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const textFilter = feature => ['nom', 'adreça', 'poblacio', 'descripcio']
    .some(prop => normalize(feature.properties[prop]).includes(normalize(searchText)));

  const filteredLocals = useMemo(() => ({
    ...locals,
    features: locals.features.filter(categoryFilter).filter(textFilter)
  }), [selectedCategories, searchText, locals]);

  const mainContent = <MainContent
    tipus={tipus}
    locals={filteredLocals}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Home;
