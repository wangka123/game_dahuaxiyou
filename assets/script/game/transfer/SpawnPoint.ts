import { _decorator, Component, Node, CCInteger, Vec3 } from 'cc';
import { EditSpawnPointData } from '../../edit/EditData';
const { ccclass, property } = _decorator;

@ccclass('SpawnPoint')
export class SpawnPoint extends Component {
    @property(CCInteger)
    public spawn_id: number = 0;
    @property(CCInteger)
    public default_spawn: boolean = false;
    
    private _edit_data: EditSpawnPointData = null;

    public init() {}

    public init_edit_data(edit_data: any) {
        this._edit_data = new EditSpawnPointData(edit_data);
        this.node.position = new Vec3(edit_data.x, edit_data.y);
        this.spawn_id = edit_data.spawnId;
        this.default_spawn = edit_data.defaultSpawn;
    }
}

