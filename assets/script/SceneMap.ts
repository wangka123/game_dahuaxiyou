import { _decorator, Component, Node, Texture2D, Size, view, Vec3, EventTouch, UITransform, Camera, CCBoolean } from 'cc';
import { Monster } from './game/character/Monster';
import { Npc } from './game/character/Npc';
import { Player } from './game/character/Player';
import { SpawnPoint } from './game/transfer/SpawnPoint';
import { TransferDoor } from './game/transfer/TransferDoor';
import GameManager from './manager/GameManager';
import { EntityLayer } from './map/layer/EntityLayer';
import { MapLayer } from './map/layer/MapLayer';
import MapData from './map/MapData';
import { MapLoadModel } from './map/MapLoadModel';
import MapParams from './map/MapParams';
import PathAgent from './map/road/PathAgent';
const { ccclass, property } = _decorator;

@ccclass('SceneMap')
export class SceneMap extends Component {
    @property(MapLayer)
    public map_layer: MapLayer = null;
    @property(EntityLayer)
    public entity_layer: EntityLayer = null;
    @property(Camera)
    private camera: Camera = null;
    @property(CCBoolean)
    public is_follow_player: boolean = true;

    public spawn_point_list: SpawnPoint[] = [];
    public transfer_door_list: TransferDoor[] = [];
    public npc_list: Npc[] = [];
    public monster_list: Monster[] = [];

    private _win_size: Size;
    private _is_init: boolean = false;
    private _map_data: MapData;
    private _map_params: MapParams;
    private _player: Player = null;
    private _target_pos: Vec3 = new Vec3(0, 0, 0);

    start() {
        this._win_size = view.getVisibleSize();
        this.node.position = new Vec3(-this._win_size.width * 0.5, -this._win_size.height * 0.5);
        this.node.on(Node.EventType.TOUCH_START, this.on_map_mouse_down, this);
    }

    public init(map_data: MapData, tex: Texture2D, model: MapLoadModel) {
        this._win_size = view.getVisibleSize();
        this._map_data = map_data;
        this._map_params = this.get_map_params(map_data, tex, model);
        this.map_layer.init(this._map_params);

        const ui_transform = this.node.getComponent(UITransform);
        ui_transform.width = this.map_layer.width;
        ui_transform.height = this.map_layer.height;

        PathAgent.instance.init(map_data);

        this.init_map_element();
        this.init_player();
        this.set_view_to_player();
        this._is_init = true;
    }

    public get_map_params(map_data: MapData, bg_tex: Texture2D, 
        map_load_model: MapLoadModel = MapLoadModel.slices): MapParams {
        const map_params: MapParams = new MapParams();
        map_params.name = map_data.name;
        map_params.bg_name = map_data.bg_name;
        map_params.map_type = map_data.type;
        map_params.map_width = map_data.map_width;
        map_params.map_height = map_data.map_height;
        map_params.cell_width = map_data.node_width;
        map_params.cell_height = map_data.node_height;
        map_params.view_width = map_data.map_width > this._win_size.width ? this._win_size.width : map_data.map_width;
        map_params.view_height = map_data.map_height > this._win_size.height ? this._win_size.height : map_data.map_height;
        map_params.slice_width = 256;
        map_params.slice_height = 256;
        map_params.bg_tex = bg_tex;
        map_params.map_load_model = map_load_model;
        return map_params;
    }

    public init_map_element() {
        const map_items: object[] = this._map_data.map_items;
        if(!map_items)
            return;
        for (let i: number = 0; i < map_items.length; i++) {
            const map_item: any = map_items[i];
            if(map_item.type == "npc") {
                this._init_npc(map_item);
            } else if(map_item.type == "monster") {
                this._init_monster(map_item);
            } else if(map_item.type == "transfer") {
                // this._init_transfer(map_item);
            } else if(map_item.type == "spawnPoint") {
                this._init_spawn_point(map_item);
            }
        }
        this.spawn_point_list = this.getComponentsInChildren(SpawnPoint);
        this.transfer_door_list = this.getComponentsInChildren(TransferDoor);
        this.npc_list = this.getComponentsInChildren(Npc);
        this.monster_list = this.getComponentsInChildren(Monster);
    }

    private _init_npc(map_item: any) {
        const npc: Npc = GameManager.instance.get_npc();
        npc.node.parent = this.entity_layer.node;
        npc.init_edit_data(map_item);
        npc.init();
    }
    private _init_monster(map_item: any) {
        const monster: Monster = GameManager.instance.get_monster();
        monster.node.parent = this.entity_layer.node;
        monster.init_edit_data(map_item);
        monster.init();
    }

    private _init_transfer(map_item: any) {
        const trans_door: TransferDoor = GameManager.instance.get_trans_door(map_item.transferType);
        trans_door.node.parent = this.entity_layer.node;
        trans_door.init_edit_data(map_item);
        trans_door.init();
    }

    private _init_spawn_point(map_item: any) {
        const sp: SpawnPoint = GameManager.instance.get_spawn_point();
        sp.node.parent = this.entity_layer.node;
        sp.init_edit_data(map_item);
        sp.init();
    }

    public init_player() {
        const spawn_point: SpawnPoint = this.get_spawn_point();
        this._player = GameManager.instance.get_player();
        this._player.node.parent = this.entity_layer.node;
        this._player.node.position = spawn_point ? spawn_point.node.position : new Vec3(1000, 1000, 0);
        // const player1 = GameManager.instance.get_player();
        // player1.node.parent = this.entity_layer.node;
        // player1.node.position = spawn_point ? spawn_point.node.position : new Vec3(1000, 1000, 0);
        // const player2 = GameManager.instance.get_player();
        // player2.node.parent = this.entity_layer.node;
        // player2.node.position = spawn_point ? spawn_point.node.position : new Vec3(1000, 1000, 0);
        // const player3 = GameManager.instance.get_player();
        // player3.node.parent = this.entity_layer.node;
        // player3.node.position = spawn_point ? spawn_point.node.position : new Vec3(1000, 1000, 0);
    }

    public get_spawn_point(spawn_id: number = 0) {
        let sp: SpawnPoint = null;
        if(spawn_id == 0) {
            sp = this.spawn_point_list.find(sp => {
                return sp.default_spawn
            });
        } else {
            sp = this.spawn_point_list.find(sp => {
                return sp.spawn_id == spawn_id;
            })
        }
        return sp;
    }

    public set_view_to_player(): void {
        this.set_view_to_point(this._player.node.position.x, this._player.node.position.y);
    }

    public set_view_to_point(px: number, py: number) {
        this._target_pos = new Vec3(px, py).subtract(new Vec3(this._win_size.width * 0.5, this._win_size.height * 0.5));
        if(this._target_pos.x > this._map_params.map_width - this._win_size.width) {
            this._target_pos.x = this._map_params.map_width - this._win_size.width;
        } else if(this._target_pos.x < 0) {
            this._target_pos.x = 0;
        }
        if(this._target_pos.y > this._map_params.map_height - this._win_size.height) {
            this._target_pos.y = this._map_params.map_height - this._win_size.height;
        } else if(this._target_pos.y < 0) {
            this._target_pos.y = 0;
        }
        this._target_pos.z = this.camera.node.position.z;
        this.camera.node.position = this._target_pos;
        if(this._map_params.map_load_model == MapLoadModel.slices) {
            this.map_layer.load_slice_image(this._target_pos.x, this._target_pos.y);
        }
    }

    public follow_player(dt: number) {
        if(!this._player)
            return;
        this._target_pos = this._player.node.position.clone().subtract(new Vec3(this._win_size.width * 0.5, this._win_size.height * 0.5));
        if(this._target_pos.x > this._map_params.map_width - this._win_size.width) {
            this._target_pos.x = this._map_params.map_width - this._win_size.width;
        } else if(this._target_pos.x < 0) {
            this._target_pos.x = 0;
        }
        if(this._target_pos.y > this._map_params.map_height - this._win_size.height) {
            this._target_pos.y = this._map_params.map_height - this._win_size.height;
        } else if(this._target_pos.y < 0) {
            this._target_pos.y = 0;
        }
        this._target_pos.z = this.camera.node.position.z;
        this._target_pos = this.camera.node.position.lerp(this._target_pos, dt * 2.0);
        this.camera.node.position = this._target_pos;
        if(this._map_params.map_load_model == MapLoadModel.slices) {
            this.map_layer.load_slice_image(this._target_pos.x, this._target_pos.y);
        }
    }

    on_map_mouse_down(evt: EventTouch) {
        const pos: Vec3 = new Vec3(evt.getUILocation().x, evt.getUILocation().y);
        const t_pos: Vec3 = new Vec3();
        Vec3.add(t_pos, this.camera.node.position, pos);
        // this._player.node.position = t_pos;
        this._player.nav_to(t_pos.x, t_pos.y);
    }

    update(dt: number) {
        if(!this._is_init)
            return;
        if(this.is_follow_player) {
            this.follow_player(dt);
        }
    }
}

