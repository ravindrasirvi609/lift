declare module "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions" {
  import { IControl } from "mapbox-gl";

  export default class MapboxDirections implements IControl {
    constructor(options?: MapboxDirections.Options);

    addTo(map: mapboxgl.Map): this;
    remove(): this;
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    getOrigin(): MapboxDirections.QueryResult;
    setOrigin(query: string | number[]): this;
    getDestination(): MapboxDirections.QueryResult;
    setDestination(query: string | number[]): this;
    setWaypoint(index: number, waypoint: string | number[]): this;
    removeWaypoint(index: number): this;
    on(type: string, fn: (e?: any) => any): this;
    off(type: string, fn: (e?: any) => any): this;
  }

  namespace MapboxDirections {
    interface Options {
      accessToken?: string;
      unit?: "imperial" | "metric";
      profile?:
        | "mapbox/driving-traffic"
        | "mapbox/driving"
        | "mapbox/walking"
        | "mapbox/cycling";
      alternatives?: boolean;
      congestion?: boolean;
      geometries?: "geojson" | "polyline" | "polyline6";
      controls?: {
        inputs?: boolean;
        instructions?: boolean;
        profileSwitcher?: boolean;
      };
      flyTo?: boolean;
      zoom?: number;
      interactive?: boolean;
      steps?: boolean;
      compile?: (template: string) => string;
      language?: string;
      placeholderOrigin?: string;
      placeholderDestination?: string;
      proximity?: number[];
    }

    interface QueryResult {
      geometry: {
        coordinates: number[];
        type: string;
      };
      properties: any;
      type: string;
    }
  }
}
