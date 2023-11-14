import { _decorator, Component, Node, Sprite, UITransform, SpriteFrame, Vec3, resources, Texture2D } from 'cc';
import { MapLoadModel } from '../MapLoadModel';
import MapParams from '../MapParams';
const { ccclass, property } = _decorator;

@ccclass('MapLayer')
export class MapLayer extends Component {
    @property(Sprite)
    bg_img: Sprite = null;

    private _map_params: MapParams;
    private _slice_img_dic: {[key: string]: Sprite} = {};
    private _prev_begin_row_load: number = -1;
    private _prev_end_row_load: number = -1;
    private _prev_begin_col_load: number = -1;
    private _prev_end_col_load: number = -1;

    public init(map_params: MapParams) {
        this._map_params = map_params;
        let spr_frame: SpriteFrame = new SpriteFrame();
        spr_frame.texture = map_params.bg_tex;
        this.bg_img.spriteFrame = spr_frame;
        // 如果是切片地图，将底图拉大到地图设计大小
        if(map_params.map_load_model == MapLoadModel.slices) {
            this.bg_img.getComponent(UITransform).width = map_params.map_width;
            this.bg_img.getComponent(UITransform).height = map_params.map_height;
        }
        this.getComponent(UITransform).width = this.width;
        this.getComponent(UITransform).height = this.height;
    }

    /**
     * 加载地图切片
     * @param px x像素坐标
     * @param py y像素坐标
     * @returns 
     */
    public load_slice_image(px: number, py: number): void {
        // 获取行的开始iy1,结束iy2, 列的开始jx1,结束jx2
        // 结束点至少为当前游戏地图的可见视图大小,所以需要+view_height, view_width
        const iy1: number = Math.floor(py / this._map_params.slice_height);
        const iy2: number = Math.floor((py + this._map_params.view_height) / this._map_params.slice_height);
        const jx1: number = Math.floor(px / this._map_params.slice_width);
        const jx2: number = Math.floor((px + this._map_params.view_width) / this._map_params.slice_width);
        // 如果上一帧和当前帧所在的范围一致,就不重复加载
        if(this._prev_begin_row_load == iy1 && this._prev_end_row_load == iy2 &&
            this._prev_begin_col_load == jx1 && this._prev_end_col_load == jx2) {
            return;
        }
        this._prev_begin_row_load = iy1;
        this._prev_end_row_load = iy2;
        this._prev_begin_col_load = jx1;
        this._prev_end_col_load = jx2;
        let key: string;
        // 行,列
        for(let i: number = iy1; i <= iy2; i++) {
            for(let j: number = jx1; j <= jx2; j++) {
                key = (i + 1) + "_" + (j + 1);
                const key_print = key;
                // 若已经加载缓存了此地图切片就不进行重复加载
                if(!this._slice_img_dic[key]) {
                    const bm: Sprite = this._get_slice_spr(key);
                    this._slice_img_dic[key] = bm;
                    this.node.addChild(bm.node);
                    bm.node.position = new Vec3(j * this._map_params.slice_width, i * this._map_params.slice_height, 0);

                    resources.load("map/bg/" + this._map_params.bg_name + "/slices/" + key + "/texture", Texture2D, (err: Error, res: Texture2D) => {
                        if(err)
                            return;
                        let spr_frame: SpriteFrame = new SpriteFrame();
                        spr_frame.packable = true;
                        spr_frame.texture = res;
                        bm.spriteFrame = spr_frame; 
                    });
                }
            }
        }
    }

    /**
     * 创建切换纹理所需要的Sprite
     * @param name 名字以"行_列"组合
     * @returns 
     */
    private _get_slice_spr(name: string): Sprite {
        const node: Node = new Node(name);
        node.layer = this.node.layer;
        const spr: Sprite = node.addComponent(Sprite);
        spr.sizeMode = Sprite.SizeMode.RAW;
        node.getComponent(UITransform).anchorX = 0;
        node.getComponent(UITransform).anchorY = 0;
        return spr;
    }

    public get bg_image(): Sprite {
        return this.bg_img;
    }

    public get width(): number {
        if(this.bg_img) {
            return this.bg_img.getComponent(UITransform).width;
        }
        return this._map_params.view_width;
    }

    public get height(): number {
        if(this.bg_img) {
            return this.bg_img.getComponent(UITransform).height;
        }
        return this._map_params.view_height;
    }

    update(dt: number) {
        
    }
}

