import { MapType } from "./MapType";

export default class MapData {
    public name: string = "";
    public bg_name: string = "";
    public type: MapType = MapType.angle45;
    public map_width: number = 0;
    public map_height: number = 0;
    public node_width: number = 0;
    public node_height: number = 0;
    public road_data_arr: number[][] = [];
    public map_items: any[] = [];
    public alignment: number = 0;
    public offset_x: number = 0;
    public offset_y: number = 0;

    constructor(json: any) {
        this.name = json["name"];
        this.bg_name = json["bgName"];
        this.type = json["type"] as MapType;
        this.map_width = json["mapWidth"];
        this.map_height = json["mapHeight"];
        this.node_width = json["nodeWidth"];
        this.node_height = json["nodeHeight"];
        this.road_data_arr = json["roadDataArr"];
        this.map_items = json["mapItems"];
        this.alignment = json["alignment"]
        this.offset_x = json["offsetX"]
        this.offset_y = json["offsetY"]
    }
}