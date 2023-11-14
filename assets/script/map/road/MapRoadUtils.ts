import { MapType } from "../MapType";
import { IMapRoad, MapRoad45Angle } from "./MapRoad";
import Point from "./Point";
import RoadNode from "./RoadNode";

export default class MapRoadUtils {
    private _col: number;
    private _row: number;
    private _map_width: number;
    private _map_height: number;
    private _node_width: number;
    private _node_height: number;
    private _half_node_width: number;
    private _half_node_height: number;
    private _map_type: MapType;
    private _map_road: IMapRoad;

    private static _instance: MapRoadUtils;
    public static get instance(): MapRoadUtils {
        if(!this._instance)
            this._instance = new MapRoadUtils();
        return this._instance;
    }

    public update_map_info(map_width: number, map_height: number, 
        node_width: number, node_height: number, map_type: MapType) {
        console.log("map_width = ", map_width, " map_height = ", map_height,
            " node_width = ", node_width, " node_height = ", node_height, " map_type = ", map_type);
        this._map_width = map_width;
        this._map_height = map_height;
        this._node_width = node_width;
        this._node_height = node_height;
        this._half_node_width = node_width * 0.5;
        this._half_node_height = node_height * 0.5;
        this._map_type = map_type;
        switch(map_type) {
            case MapType.angle45:
                this._col = Math.ceil(map_width / node_width);
                this._row = Math.ceil(map_height / node_height) * 2;
                this._map_road = new MapRoad45Angle(this._row, this._col, node_width, node_height, this._half_node_width, this._half_node_height);
                break;
            case MapType.angle90:
                break;
            case MapType.honeycomb:
                break;
            case MapType.honeycomb2:
                break;
        }
    }

    public get_world_point_by_pixel(px: number, py: number): Point {
        if(this._map_road) {
            return this._map_road.get_world_point_by_pixel(px, py);
        }
        return new Point();
    }

    public get_node_by_derect(dx: number, dy: number): RoadNode {
        if(this._map_road) {
            return this._map_road.get_node_by_derect(dx, dy);
        }
        return new RoadNode();
    }
}