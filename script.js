const readColors = () =>
  fetch('https://sheets.googleapis.com/v4/spreadsheets/1fjBWJjionkbsll_YdisD31Houzxcu1nwTbNCVBWvitY/values/Tipus?valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyDZR5KUCYmbQdp6srPiGP6qLhtzZEeq8r4')
  .then(response => response.json())                    // Obté full de càlcul en JSON
  .then(spreadsheet => spreadsheet.values.slice(1))     // Elimina la capçalera
  .then(rows => rows.reduce(
    (obj, row) => {
      obj[row[0]] = [row[2], row[4]];                   // Array amb color clar i fosc, per tipus
      return obj;
    }, {}));

const readFeatures = () =>
  fetch('https://sheets.googleapis.com/v4/spreadsheets/1fjBWJjionkbsll_YdisD31Houzxcu1nwTbNCVBWvitY/values/Locals?valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyDZR5KUCYmbQdp6srPiGP6qLhtzZEeq8r4')
  .then(response => response.json())                    // Obté full de càlcul en JSON
  .then(spreadsheet => spreadsheet.values.slice(1))     // Elimina la capçalera
  .then(rows => rows
    .filter(row =>                                // Filtra files incorrectes
      row.length >= 5                           // S'esperen al menys 5 columnes de dades on:
      && row[0]                                 //  * La primera ha de tenir algun valor (nom del comerç)
      && row[3] && typeof row[3] === 'number'   //  * La quarta és un valor numèric (lat)
      && row[4] && typeof row[4] === 'number')  //  * La cninquena és un valor numèric (lon)
    .map(row => ({                                // Converteix cada fila en una Feature de tipus Point (GeoJSON)
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
    }))
  ).then(features => ({                               // Embolcalla en una FeatureCollection (GeoJSON)
    type: 'FeatureCollection',
    features: features
  })
);

const readData = Promise.all([readColors(), readFeatures()]);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://geoserveis.icgc.cat/contextmaps/positron.json',
  center: [2.25, 41.93],
  zoom: 10,
  hash: true
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.on('load', () => {
  readData.then(([colors, features]) => {
    map.addSource('comerços', {
      type: 'geojson',
      data: features
    });

    const colorMatchArray = Object.entries(colors).flatMap(([key, values]) => [key, values[1]]);

    map.addLayer({
      id: 'punts',
      type: 'circle',
      source: 'comerços',
      layout: {
      },
      paint: {
        'circle-radius': 5,
        'circle-color': ["match", ["get", "tipus"],
          ...colorMatchArray,
          "#888888"
        ],
        'circle-opacity': 1,
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 1
      }
    });
    map.addLayer({
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
        'text-color': ["match", ["get", "tipus"],
          ...colorMatchArray,
          "#888888"
        ],
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 1
      }
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true
    });

    const showPopup = (e) => {
      map.getCanvas().style.cursor = 'pointer';
      const feature = e.features[0];
      const coords = feature.geometry.coordinates.slice();
      const props = feature.properties;

      let html = `
        <div class="popup-nom" style="color: ${colors[props.tipus][0]}; background-color: ${colors[props.tipus][1]};">${props.nom}</div>
        <div class="popup-adreça">${props.adreça || ''}<br/>${props.poblacio || ''}</div>
      `;

      if (props.descripcio) {
        html += `<div class="popup-descripcio">${props.descripcio || ''}</div>`;
      }

      popup.setLngLat(coords).setHTML(html).addTo(map);
    }

    map.on('mouseenter', 'punts', showPopup);
    map.on('click', 'punts', showPopup);

    map.on('mouseleave', 'punts', function () {
      map.getCanvas().style.cursor = '';
    });
  });
});
