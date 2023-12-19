import { _decorator, Component, Node, Sprite, CCFloat, Texture2D, CCInteger, CCBoolean, SpriteFrame, UITransform, Rect, Vec2, Size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MovieClip')
export class MovieClip extends Component {
    @property(CCFloat)
    public interval: number = 0.1;
    /**
     * 序列帧纹理
     */
    @property(Texture2D)
    public tex: Texture2D = null;
    /**
     * 已播放次数
     */
    @property(CCInteger)
    public play_times: number = 0;
    @property(CCInteger)
    /**
     * 序列帧纹理中的总行
     */
    public row: number = 4;
    @property(CCInteger)
    /**
     * 序列帧纹理中的总列
     */
    public col: number = 4;
    /**
     * 当前播放到行的索引
     */
    @property(CCInteger)
    public row_index: number = 0;
    /**
     * 是否播放序列帧中的每一张图片
     */
    @property(CCBoolean)
    public is_all: boolean = true;
    /**
     * 加载后是否自动播放
     */
    @property(CCBoolean)
    public auto_play_on_load: boolean = true;
    /**
     * 播放结束是否自动销毁
     */
    @property(CCBoolean)
    public auto_destroy: boolean = false;
    /**
     * 序列帧播放的开始索引
     * 根据动画状态设置不同的开始点
     */
    @property(CCInteger)
    public begin: number = 0;
    /**
     * 序列帧播放的结束索引
     * 根据动画状态设置不同的结束点
     */
    @property(CCInteger)
    public end: number = 0;
    /**
     * 纹理的总帧
     */
    public total_frame: number = 0;
    /**
     * 当前播放的帧
     */
    public current_frame: number = 0;
    /**
     * 当前播放的次数
     */
    public current_times: number = 0;
    /**
     * 是否正在播放中
     */
    public running: boolean = true;

    /**
     * 序列帧纹理的Sprite容器
     */
    protected m_sprite: Sprite = null;
    protected timer: number = 0.1;

    /**
     * 当前序列帧播放的索引
     */
    private _play_index: number = 0;
    /**
     * 序列帧每帧显示的图片的宽度
     */
    private _piece_width: number = 0;
    /**
     * 序列帧每帧显示的图片的高度
     */
    private _piece_height: number = 0;
    /**
     * 纹理转换成的序列帧数组
     */
    private _bm_arr: SpriteFrame[][] = [];
    /**
     * 是否已经初始化
     */
    private _is_init: boolean = false;
    private _ui_transform: UITransform = null;

    onLoad() {
        // 测试提交
        this.running = this.auto_play_on_load;
        if(!this._is_init)
            this.init(this.tex, this.row, this.col, this.play_times);
    }

    public init(tex: Texture2D, row: number, col: number, play_times: number = 0) {
        if(!tex)
            return;
        this.reset();
        this._is_init = true;
        this.tex = tex;
        this.row = row;
        this.col = col;
        this.play_times = play_times;

        if(this.end == 0)
            this.end = this.col;
        this.row_index = this.clamp(this.row_index, 0, row - 1);
        this._piece_width = this.tex.width / col;
        this._piece_height = this.tex.height / row;

        this.m_sprite = this.getComponent(Sprite);
        if(!this.m_sprite) {
            this.m_sprite = this.addComponent(Sprite);
        }
        
        for(let i = 0; i < row; i++) {
            this._bm_arr[i] = [];
            for(let j = 0; j < col; j++) {
                const spr_frame: SpriteFrame = new SpriteFrame();
                spr_frame.texture = tex;
                spr_frame.rect = new Rect(j * this._piece_width, i * this._piece_height, this._piece_width, this._piece_height);
                spr_frame.rotated = false;
                spr_frame.offset = new Vec2(0, 0);
                spr_frame.originalSize = new Size(this._piece_width, this._piece_height);
                this._bm_arr[i][j] = spr_frame;
            }
        }
        this.m_sprite.spriteFrame = this._bm_arr[this.row_index][0];
        this.ui_transform.width = this._piece_width;
        this.ui_transform.height = this._piece_height;
        this.timer = 0;
        this.play_action();
    }

    public reset() {
        this.timer = 0;
        this.play_index = 0;
        this.current_frame = 0;
        this.current_times = 0;
    }

    public play() {
        this.running = true;
        this.play_action();
    }

    public stop() {
        this.running = false;
    }

    public play_action() {
        if(this.end == this.begin)
            return;
        this.row_index = this.clamp(this.row_index, 0, this.row - 1);
        this._play_index = this.play_index % (this.end - this.begin) + this.begin;
        this.m_sprite.spriteFrame = this._bm_arr[this.row_index][this.play_index];
        this.play_index++;
    }

    update(dt: number) {
        if(!this.tex)
            return;
        if(!this.running)
            return;
        if(this.play_times != 0 && this.current_times == this.play_times) {
            this.stop();
            return;
        }
        this.timer -= dt;
        if(this.timer > 0)
            return;

        if(this.is_all) {
            this.begin = 0;
            this.end = this.col;
        }
        this.timer = this.interval;
        this.current_frame = this.current_frame % this.col;
        this.play_action();
        this.current_frame++;
        if(this.current_frame == this.col) {
            if(this.is_all) {
                this.row_index++;
                if(this.row_index == this.row) {
                    this.current_times++;
                    this._check_anim_end();
                }
                this.row_index %= this.row;
            } else {
                this.current_times++;
                this._check_anim_end();
            }
        }
    }

    public clamp(val: number, min_limit: number, max_limit: number) {
        if(val < min_limit)
            return min_limit;
        if(val > max_limit)
            return max_limit;
        return val;
    }

    private _check_anim_end() {
        this.node.emit("complete_times")
        if(this.play_times != 0 && this.play_times == this.current_times) {
            this.node.emit("complete");
            if(this.auto_destroy) {
                this.node.destroy();
            }
        }
    }

    public get play_index(): number {
        return this._play_index;
    }
    public set play_index(value: number) {
        this._play_index = value;
    }
    public get ui_transform(): UITransform {
        if(!this._ui_transform)
            this._ui_transform = this.node.getComponent(UITransform);
        return this._ui_transform;
    }
}

