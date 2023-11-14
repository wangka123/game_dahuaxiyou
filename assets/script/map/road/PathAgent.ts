import MapData from "../MapData";
import { MapType } from "../MapType";
import AStarRoadSeeker from "./AStarRoadSeeker";
import IRoadSeeker from "./IRoadSeeker";
import MapRoadUtils from "./MapRoadUtils";
import Point from "./Point";
import RoadNode from "./RoadNode";

export default class PathAgent {
    private _map_data: MapData;
    private _map_type: MapType;
    private _road_dic: {[key: string]: RoadNode} = {};
    private _road_seeker: IRoadSeeker;

    private static _instance: PathAgent;
    public static get instance(): PathAgent {
        if(!this._instance)
            this._instance = new PathAgent();
        return this._instance;
    }

    public init(map_data: MapData) {
        this._map_data = map_data;
        this._map_type = map_data.type;

        MapRoadUtils.instance.update_map_info(map_data.map_width, map_data.map_height, map_data.node_width, map_data.node_height, map_data.type);

        const row_len = map_data.road_data_arr.length;
        const col_len = map_data.road_data_arr[0].length;

        let dx: number = 0;
        let dy: number = 0;
        let value: number = 0;
        for (let i: number = 0; i < row_len; i++) {
            for(let j: number = 0; j < col_len; j++) {
                value = this._map_data.road_data_arr[i][j];
                dx = j; // 列
                dy = i; // 行
                const node: RoadNode = MapRoadUtils.instance.get_node_by_derect(dx, dy);
                node.value = value;
                // if(this._map_type == MapType.honeycomb2){
                // }
                this._road_dic[node.cx + "_" + node.cy] = node;
            }
        }
        if(this._map_type == MapType.honeycomb || this._map_type == MapType.honeycomb2) {
        } else {
            this._road_seeker = new AStarRoadSeeker(this._road_dic);
        }
    }

    public get_road_node(cx: number, cy: number): RoadNode {
        return this._road_seeker.get_road_node(cx, cy);
    }

    public get_road_node_by_pixel(px: number, py: number): RoadNode {
        const p: Point = MapRoadUtils.instance.get_world_point_by_pixel(px, py);
        let node: RoadNode = null;
        if(this._map_type == MapType.honeycomb2){
            node = this.get_road_node(p.y, p.x);
        } else {
            node = this.get_road_node(p.x, p.y);
        }
        return node;
    }

    public seek_path2(s_x: number, s_y: number, t_x: number, t_y: number): RoadNode[] {
        const s_node: RoadNode = this.get_road_node_by_pixel(s_x, s_y);
        const t_node: RoadNode = this.get_road_node_by_pixel(t_x, t_y);
        const road_node_arr: RoadNode[] = this._road_seeker.seek_path2(s_node, t_node);
        return road_node_arr;
    }
}