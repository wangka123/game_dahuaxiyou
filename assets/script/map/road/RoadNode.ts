export default class RoadNode {
    private _px: number;
    private _py: number;
    private _cx: number;
    private _cy: number;
    private _dx: number;
    private _dy: number;
    private _value: number = 0;
    private _f: number = 0;
    private _g: number = 0;
    private _h: number = 0;
    private _parent: RoadNode = null;

    //----- 二叉堆
    private _tree_parent: RoadNode = null;
    private _left: RoadNode = null;
    private _right: RoadNode = null;
    private _open_tag: number = 0;
    private _close_tag: number = 0;

    public reset_tree() {
        this._tree_parent = null;
        this._left = null;
        this._right = null;
    }

    public to_string(): string {
        return "路点像素坐标:  (" + this._px + " , " + this._py + "),  " +
            "路点世界坐标:  (" + this._cx + " , " + this._cy + "),  " +
            "平面直角坐标:  (" + this._dx + " , " + this._dy + ")";
    }

    public get px(): number {
        return this._px;
    }
    public set px(value: number) {
        this._px = value;
    }
    public get py(): number {
        return this._py;
    }
    public set py(value: number) {
        this._py = value;
    }
    public get cx(): number {
        return this._cx;
    }
    public set cx(value: number) {
        this._cx = value;
    }
    public get cy(): number {
        return this._cy;
    }
    public set cy(value: number) {
        this._cy = value;
    }
    public get dx(): number {
        return this._dx;
    }
    public set dx(value: number) {
        this._dx = value;
    }
    public get dy(): number {
        return this._dy;
    }
    public set dy(value: number) {
        this._dy = value;
    }
    public get value(): number {
        return this._value;
    }
    public set value(value_1: number) {
        this._value = value_1;
    }
    public get f(): number {
        return this._f;
    }
    public set f(value: number) {
        this._f = value;
    }
    public get g(): number {
        return this._g;
    }
    public set g(value: number) {
        this._g = value;
    }
    public get h(): number {
        return this._h;
    }
    public set h(value: number) {
        this._h = value;
    }
    public get parent(): RoadNode {
        return this._parent;
    }
    public set parent(value: RoadNode) {
        this._parent = value;
    }
    // ----- 二叉堆
    public get tree_parent(): RoadNode {
        return this._tree_parent;
    }
    public set tree_parent(value: RoadNode) {
        this._tree_parent = value;
    }
    public get left(): RoadNode {
        return this._left;
    }
    public set left(value: RoadNode) {
        this._left = value;
    }
    public get right(): RoadNode {
        return this._right;
    }
    public set right(value: RoadNode) {
        this._right = value;
    }
    public get open_tag(): number {
        return this._open_tag;
    }
    public set open_tag(value: number) {
        this._open_tag = value;
    }
    public get close_tag(): number {
        return this._close_tag;
    }
    public set close_tag(value: number) {
        this._close_tag = value;
    }   
}