import { _decorator, Component, profiler, resources, JsonAsset, Texture2D, dynamicAtlasManager, gfx, macro } from 'cc';
import MapData from './map/MapData';
import { MapLoadModel } from './map/MapLoadModel';
import { SceneMap } from './SceneMap';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(SceneMap)
    scene_map: SceneMap = null;

    start() {
        // profiler.hideStats();
        profiler.showStats();
        this.load_map("10001", MapLoadModel.slices);
    }

    load_map(map_id: string, model: MapLoadModel = MapLoadModel.single) {
        const data_path: string = "map/data/" + map_id;
        resources.load(data_path, JsonAsset, (err:Error, res: JsonAsset) => {
            if(err) {
                console.error("load map data of json file fail... url: ", data_path);
                return;
            }
            const map_data: MapData = new MapData(res.json);
            if(model == MapLoadModel.single) {
                this.load_single_map(map_data);
            } else if (model == MapLoadModel.slices) {
                this.load_slices_map(map_data);
            }
        });
    }

    load_single_map(map_data: MapData) {
        const bg_path: string = "map/bg/" + map_data.bg_name + "/texture";
        resources.load(bg_path, Texture2D, (err: Error, tex: Texture2D) => {
            if(err) {
                console.error("load map bg fail... url: ", bg_path);
                return;
            }
            this.scene_map.init(map_data, tex, MapLoadModel.single);
        });
    }

    load_slices_map(map_data: MapData) {
        const bg_path: string = "map/bg/" + map_data.bg_name + "/miniMap/texture";
        resources.load(bg_path, Texture2D, (err: Error, tex: Texture2D) => {
            if(err) {
                console.error("load mini map bg fail... url: ", bg_path);
                return;
            }
            this.scene_map.init(map_data, tex, MapLoadModel.slices);
        });
    }
}

