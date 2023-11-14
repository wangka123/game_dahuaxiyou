import { _decorator, CCInteger, CCString, Component, Label, Node, Vec3 } from 'cc';
import { EditTransferData } from '../../edit/EditData';
const { ccclass, property } = _decorator;

@ccclass('TransferDoor')
export class TransferDoor extends Component {
    @property(CCString)
    public target_map_id: string = "";

    @property(CCInteger)
    public target_map_spawn_id: number = 0;

    @property(Label)
    public name_txt:Label = null;

    private _edit_data: EditTransferData;
    private _obj_name: string;

    start() {
    }

    public init() {}

    public init_edit_data(edit_data: any) {
        this._edit_data = new EditTransferData(edit_data);
        this.obj_name = edit_data.objName;
        this.node.position = new Vec3(edit_data.x, edit_data.y);
        this.target_map_id = edit_data.targetMapId;
        this.target_map_spawn_id = Number(edit_data.targetMapSpawnId);
    }

    public get obj_name(): string {
        return this._obj_name;
    }
    public set obj_name(value: string) {
        this._obj_name = value;
        this.name_txt.string = this._obj_name;
    }

    public to_string() {
        return this.target_map_id + "," + this.target_map_spawn_id;
    }
}

