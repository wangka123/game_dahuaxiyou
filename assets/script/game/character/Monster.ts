import { _decorator, CCBoolean, CCFloat, CCInteger, Component, Node, resources, Texture2D, Vec2, Vec3 } from 'cc';
import Character from './Character';
import { EditMonsterData } from '../../edit/EditData';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Character {
    @property(CCInteger)
    public monster_id: number = 0;
    @property(CCBoolean)
    public is_patrol: boolean = true;
    @property(CCFloat)
    public patrol_range: number = 200;
    @property(CCInteger)
    public default_dir: number = 0;

    private _edit_data: EditMonsterData = null;

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
        this._edit_data = new EditMonsterData(edit_data);
        this.obj_name = edit_data.objName;
        this.monster_id = Number(edit_data.objId);
        this.node.position = new Vec3(edit_data.x, edit_data.y);
        this.default_dir = edit_data.direction;
        this.is_patrol = edit_data.isPatrol;
        console.log("obj_name = ", this.obj_name, " monster_id = ", this.monster_id,
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
        if(this.monster_id != 0) {
            const file_path: string = "game/monster/" + this.monster_id + "/texture";
            resources.load(file_path, Texture2D, (err: Error, res: Texture2D) => {
                if(err) {
                    console.error("加载monster资源错误, monster_id", this.monster_id);
                    return;
                }
                this.clip.init(res, 5, 8);
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
    // ROV 动态规避
    // PB - PA = P_NEW
    // PB = (5, 5)
    // PA = (-10, -10)
    // P_NEW = (5 + 10, 5 + 10)

    // rA = 5
    // rB = 5
    // rNew = 10

    // t记为毫秒
    // t = 100 ms
    // 1 / t = 1 / 100  缩放为秒

    // new_circle / t
    // p_NEW = (0.15, 0.15)
    // rNew = 0.1
}

