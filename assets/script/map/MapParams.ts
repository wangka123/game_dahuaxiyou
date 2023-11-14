import { Texture2D } from "cc";
import { MapLoadModel } from "./MapLoadModel";
import { MapType } from "./MapType";

export default class MapParams {
    public name: string = "";
    public bg_name: string = "";
    public map_type: MapType = MapType.angle45;
    public map_width: number = 750;
    public map_height: number = 1600;
    public cell_width: number = 75;
    public cell_height: number = 75;
    public view_width: number = 750;
    public view_height: number = 1134;
    public slice_width: number = 256;
    public slice_height: number = 256;
    public map_load_model: MapLoadModel = MapLoadModel.single;
    public bg_tex: Texture2D;
}