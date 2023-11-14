import { _decorator, Component, Node, Label, Vec3, UIOpacity } from 'cc';
import { Behaviour } from '../../base/Behaviour';
import { MovieClip } from '../../utils/MovieClip';
import RoadNode from '../../map/road/RoadNode';
import PathAgent from '../../map/road/PathAgent';
const { ccclass, property } = _decorator;

export enum CharacterState {
    idle = 0,
    walk = 1,
    sit_down = 2,
    sit_down_walk = 3
}

@ccclass('Character')
export default class Character extends Behaviour {
    @property(Label)
    public name_txt:Label = null;


    public moving: boolean = false;
    public move_speed: number = 200;

    protected _dir: number = 0;
    protected _state: CharacterState = CharacterState.idle;
    protected _obj_name: string = "";
    protected _last_road_node: RoadNode;
    private _clip: MovieClip = null;
    private _road_node_arr: RoadNode[] = null;
    private _node_idx: number = 0;
    private _move_angle: number = 0;

    start() {
        this.state = CharacterState.idle;
    }

    update(dt: number) {
        if(this.moving) {
            const n_node: RoadNode = this._road_node_arr[this._node_idx];
            const pos: Vec3 = this.node.position;
            const dx: number = n_node.px - pos.x;
            const dy: number = n_node.py - pos.y;
            const speed: number = this.move_speed * dt;
            if(dx * dx + dy * dy > speed * speed) {
                if(this._move_angle == 0) {
                    this._move_angle = Math.atan2(dy, dx);
                    const dir: number = Math.round((-this._move_angle + Math.PI) / (Math.PI / 4));
                    this.dir = dir > 5 ? dir - 6 : dir + 2;
                }
                const x_speed: number = Math.cos(this._move_angle) * speed;
                const y_speed: number = Math.sin(this._move_angle) * speed;
                pos.x += x_speed;
                pos.y += y_speed;
            } else {
                this._move_angle = 0;
                if(this._node_idx == this._road_node_arr.length - 1) {
                    pos.x = n_node.px;
                    pos.y = n_node.py;
                    this.stop();
                } else {
                    this._walk();
                }
            }
            this.node.position = pos;
        }
        this.update_character_state();
    }

    public update_character_state() {
        const road_node: RoadNode = this.road_node;
        if(road_node == this._last_road_node)
            return;
        this._last_road_node = road_node;
        if(this._last_road_node) {
            switch(this._last_road_node.value) {
                case 2:
                    this.alpha != 0.4 && (this.alpha = 0.4);
                    break;
                case 3:
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
            }
        }
    }

    public walk_by_road(road_node_arr: RoadNode[]) {
        this._road_node_arr = road_node_arr;
        this._node_idx = 0;
        this._move_angle = 0;
        this._walk();
        this.move();
    }

    private _walk() {
        if(this._node_idx < this._road_node_arr.length - 1) {
            this._node_idx++;
        }
    }

    public move() {
        this.moving = true;
        this.state = CharacterState.walk;
    }

    public stop() {
        this.moving = false;
        this.state = CharacterState.idle;
    }

    public nav_to(t_x: number, t_y: number) {
        let road_node_arr: RoadNode[] = PathAgent.instance.seek_path2(this.node.position.x, this.node.position.y, t_x, t_y);
        if(road_node_arr.length > 0) {
            this.walk_by_road(road_node_arr);
        }
    }

    public get dir(): number {
        return this._dir;
    }
    public set dir(value: number) {
        this._dir = value;
        const scale: Vec3 = this.clip.node.scale;
        if(value > 4) {
            this.clip.row_index = 4 - value % 4;
            scale.x = -1;
        } else {
            this.clip.row_index = value;
            scale.x = 1;
        }
        this.clip.node.scale = scale;
    }
    public get state(): CharacterState {
        return this._state;
    }
    public set state(value: CharacterState) {
        this._state = value;
        const half_col: number = this.clip.col * 0.5;
        switch(this._state) {
            case CharacterState.idle:
                this.clip.begin = 0;
                this.clip.end = half_col;
                break;
            case CharacterState.walk:
                this.clip.begin = half_col;
                this.clip.end = this.clip.col;
                break;
        }
    }
    public get obj_name(): string {
        return this._obj_name;
    }
    public set obj_name(value: string) {
        this._obj_name = value;
        this.name_txt.string = this._obj_name;
    }
    public get road_node(): RoadNode {
        return PathAgent.instance.get_road_node_by_pixel(this.node.position.x, this.node.position.y);
    }
    public get clip(): MovieClip {
        if(!this._clip) {
            this._clip = this.getComponentInChildren(MovieClip);
        }
        return this._clip;
    }
}

