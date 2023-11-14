import { _decorator, Component, Node, UIOpacity, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Behaviour')
export class Behaviour extends Component {
    @property({tooltip: "对象标识"})
    public tag: string = "";

    private _ui_transform: UITransform = null;
    private _alpha: number = 1;
    private _ui_opacity: UIOpacity = null;

    onLoad() {

    }

    update(dt: number) {
        
    }

    public get ui_transform(): UITransform {
        if(!this._ui_transform)
            this._ui_transform = this.node.getComponent(UITransform);
        return this._ui_transform;
    }

    public get width(): number {
        return this.ui_transform.width;
    }
    public set width(value: number) {
        this.ui_transform.width = value;
    }
    public get height(): number {
        return this.ui_transform.height;
    }
    public set height(value: number) {
        this.ui_transform.height = value;
    }
    public set alpha(value: number) {
        this._alpha = value;
        if(this._alpha < 0)
            this._alpha = 0;
        else if(this._alpha > 1)
            this._alpha = 1;
        if(this.ui_opacity)
            this.ui_opacity.opacity = 255 * (this._alpha / 1);
    }
    public get alpha(): number {
        return this._alpha;
    }
    public get ui_opacity(): UIOpacity {
        if(!this._ui_opacity)
            this._ui_opacity = this.node.getComponent(UIOpacity);
        return this._ui_opacity;
    }
}

