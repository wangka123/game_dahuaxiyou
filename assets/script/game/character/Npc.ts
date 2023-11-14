import { _decorator, Component, Node, CCInteger, CCBoolean, CCFloat, Vec2, Vec3, resources, Texture2D } from 'cc';
import { EditNpcData } from '../../edit/EditData';
import Character from './Character';
const { ccclass, property } = _decorator;

@ccclass('Npc')
export class Npc extends Character {
    @property(CCInteger)
    public npc_id: number = 0;
    @property(CCBoolean)
    public is_patrol: boolean = true;
    @property(CCFloat)
    public patrol_range: number = 200;
    @property(CCInteger)
    public default_dir: number = 0;

    private _edit_data: EditNpcData = null;
    
    protected base_pos: Vec3 = null;
    protected target_pos: Vec2 = new Vec2();
    protected timer: number = 3.5;

    start() {
        super.start();
        this.base_pos = this.node.position;
        this.timer = this.range(0.5, 1.5);
    }

    public init() {
        this.width = 100;
        this.height = 100;
        this.dir = this.default_dir;
        this._load_res();
    }

    public init_edit_data(edit_data: any) {
        this._edit_data = new EditNpcData(edit_data);
        this.obj_name = edit_data.objName;
        this.npc_id = Number(edit_data.objId);
        this.node.position = new Vec3(edit_data.x, edit_data.y);
        this.default_dir = edit_data.direction;
        this.is_patrol = edit_data.isPatrol;
        console.log("obj_name = ", this.obj_name, " npc_id = ", this.npc_id,
            " default_dir = ", this.default_dir, " is_patrol = ", this.is_patrol);
    }

    public range(num1: number, num2: number): number {
        if(num2 > num1) {
            return Math.random() * (num2 - num1) + num1;
        }
        return Math.random() * (num1 - num2) + num2;
    }

    public patrol() {
        this.target_pos.x = this.base_pos.x + this.range(-this.patrol_range, this.patrol_range);
        this.target_pos.y = this.base_pos.y + this.range(-this.patrol_range, this.patrol_range);
        this.nav_to(this.target_pos.x, this.target_pos.y);
    }

    private _load_res() {
        if(this.npc_id != 0) {
            const file_path: string = "game/npc/" + this.npc_id + "/texture";
            resources.load(file_path, Texture2D, (err: Error, res: Texture2D) => {
                if(err) {
                    console.error("加载npc资源错误, npc_id", this.npc_id);
                    return;
                }
                this.clip.init(res, 5, 12);
                this.width = this.clip.ui_transform.width;
                this.height = this.clip.ui_transform.height;
            });
        }
    }

    update(dt: number) {
        super.update(dt);
        if(this.is_patrol) {
            this.timer -= dt;
            if(this.timer <= 0) {
                this.timer = this.range(1.5, 4);
                this.patrol();
            }
        }
    }
}

