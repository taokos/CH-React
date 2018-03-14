import L from 'leaflet';
import * as Util from "leaflet/src/core/Util";
import {FeatureGroup} from "leaflet/src/layer/FeatureGroup";
import {LatLng} from "leaflet/src/geo/LatLng";
import {Marker} from "leaflet/src/layer/marker/Marker";
import {Polygon} from "leaflet/src/layer/vector/Polygon";
import {Polyline} from "leaflet/src/layer/vector/Polyline";

L.LoadGeoJSON = L.FeatureGroup.extend({
  initialize: function (apiUrl, options) {
    Util.setOptions(this, options);
    this._layers = {};
    if (apiUrl) {
      fetch(apiUrl)
        .then(function (results) {
          var contentType = results.headers.get("content-type");
          if(contentType && contentType.includes("application/json")) {
            return results.json();
          }
        })
        .then(data => this.createGeoJsonObject(data));
    }
  },
  createGeoJsonObject(data) {
    if (typeof data[0] !== 'undefined' && 'coordinates' in data[0]) {
      const shape = {
        'type': 'Feature',
        'geometry': {
          'type': data[0] ? data[0].type : '',
          'coordinates': data[0] ? data[0].coordinates : ''
        }
      };
      this.addData(shape);
    }
  },
  addData: function (geojson) {
    var features = Util.isArray(geojson) ? geojson : geojson.features,
      i, len, feature;

    if (features) {
      for (i = 0, len = features.length; i < len; i++) {
        // only add this if geometry or geometries are set and not null
        feature = features[i];
        if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
          this.addData(feature);
        }
      }
      return this;
    }

    var options = this.options;

    if (options.filter && !options.filter(geojson)) { return this; }

    var layer = this.geometryToLayer(geojson, options);
    if (!layer) {
      return this;
    }
    layer.feature = this.asFeature(geojson);

    layer.defaultOptions = layer.options;
    this.resetStyle(layer);

    if (options.onEachFeature) {
      options.onEachFeature(geojson, layer);
    }

    return this.addLayer(layer);
  },
  resetStyle: function (layer) {
    // reset any custom styles
    layer.options = Util.extend({}, layer.defaultOptions);
    this._setLayerStyle(layer, this.options.style);
    return this;
  },
  asFeature(geojson) {
    if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
      return geojson;
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: geojson
    };
  },
  setStyle: function (style) {
    return this.eachLayer(function (layer) {
      this._setLayerStyle(layer, style);
    }, this);
  },
  _setLayerStyle: function (layer, style) {
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  },
  geometryToLayer(geojson, options) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
      coords = geometry ? geometry.coordinates : null,
      layers = [],
      pointToLayer = options && options.pointToLayer,
      _coordsToLatLng = (options && options.coordsToLatLng) || this.coordsToLatLng,
      latlng, latlngs, i, len;

    if (!coords && !geometry) {
      return null;
    }

    switch (geometry.type) {
      case 'Point':
        latlng = _coordsToLatLng(coords);
        return pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng);

      case 'MultiPoint':
        for (i = 0, len = coords.length; i < len; i++) {
          latlng = _coordsToLatLng(coords[i]);
          layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng));
        }
        return new FeatureGroup(layers);

      case 'LineString':
      case 'MultiLineString':
        latlngs = this.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
        return new Polyline(latlngs, options);

      case 'Polygon':
      case 'MultiPolygon':
        latlngs = this.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
        return new Polygon(latlngs, options);

      case 'GeometryCollection':
        for (i = 0, len = geometry.geometries.length; i < len; i++) {
          var layer = this.geometryToLayer({
            geometry: geometry.geometries[i],
            type: 'Feature',
            properties: geojson.properties
          }, options);

          if (layer) {
            layers.push(layer);
          }
        }
        return new FeatureGroup(layers);

      default:
        throw new Error('Invalid GeoJSON object.');
    }
  },
  coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
    var latlngs = [];

    for (var i = 0, len = coords.length, latlng; i < len; i++) {
      latlng = levelsDeep ?
        this.coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
        (_coordsToLatLng || this.coordsToLatLng)(coords[i]);

      latlngs.push(latlng);
    }

    return latlngs;
  },
  coordsToLatLng(coords) {
    return new LatLng(coords[1], coords[0], coords[2]);
  }
});

const LoadGeoJSON = function(apiUrl, options) {
  return new L.LoadGeoJSON(apiUrl, options);
};

export default LoadGeoJSON;
