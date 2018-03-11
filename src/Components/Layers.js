import L from 'leaflet';
import {GroupedLayers} from 'leaflet-groupedlayercontrol';

// Temporary solution for the ST1.
import api_layers from '../data.json';
import LoadGeoJSON from "./geoJSONLayer";

const MapShape = 'https://fl-api.gridics.com/fast-ajax/map_shape?map=land_use&overlay=1&';

const colors = [
  "#db4c4c",
  "#93db4c",
  "#4c70db",
  "#00bf70",
  "#ff1f62",
  "#4caaff",
  "#934cdb",
  "#dbb74c",
  "#db4cb7"
],
  tailLaers = [
  {title:"Parcel Lines", urlTemplate:'//st1-tiles.gridics.com/property_records_parcel_lines/{z}/{x}/{y}.png'},
  {title:"Future Land Use", urlTemplate:'//st1-tiles.gridics.com/land_use_future_land_use/{z}/{x}/{y}.png'},
  {title:"Zoning Code", urlTemplate:'//st1-tiles.gridics.com/land_use_zoning_code/{z}/{x}/{y}.png'},
  {title:"Zoning Overlay", urlTemplate:'//st1-tiles.gridics.com/land_use_zoning_overlay/{z}/{x}/{y}.png'},
];


let groupedOverlays = {
  "Layers": {},
  "Land Use": {},
  "Place": {}
};

console.log(process.env);

tailLaers.map((layer) => {
  groupedOverlays["Layers"][layer.title] = L.tileLayer(layer.urlTemplate, {attribution: ''});
});

// fetch(LAPI)
//   .then(lresults => lresults.json())
//   .then(ldata => layers[ldata]);


Object.keys(api_layers).map(group => {
  return (
    api_layers[group].layers.map((layer, i) => {
      const options = {color: colors[i % colors.length], weight: 2, fillOpacity: 0.15, opacity: 0.7};
      const apiUrl = MapShape + api_layers[group].layer_type + '=' + layer.layer_id;
      if (api_layers[group].layer_type === 'land_use') {
        groupedOverlays["Land Use"][layer.layer_title] = LoadGeoJSON(apiUrl, options)
      }
      else {
        groupedOverlays["Place"][layer.layer_title] = LoadGeoJSON(apiUrl, options)
      }
    })
  )
});


export default groupedOverlays;
