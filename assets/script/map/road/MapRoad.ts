import Point from "./Point";
import RoadNode from "./RoadNode";

export interface IMapRoad {
    get_node_by_pixel(x: number, y: number): RoadNode;
    get_node_by_derect(dx: number, dy: number): RoadNode;
    get_node_by_world_point(cx: number, cy: number): RoadNode;
    get_world_point_by_pixel(x: number, y: number): Point;
    get_pixel_by_world_point(cx: number, cy: number): Point;
    get_derect_by_pixel(x: number, y: number): Point;
    get_derect_by_world_point(cx: number, cy: number): Point;
    get_pixel_by_derect(dx: number, dy: number): Point;
}

export class MapRoad45Angle implements IMapRoad {
    private _row: number;
    private _col: number;
    private _node_width: number;
    private _node_height: number;
    private _half_node_width: number;
    private _half_node_height: number;

    public constructor(row: number, col: number, node_width: number, node_height: number,
        half_node_width: number, half_node_height: number) {
        this._row = row;
        this._col = col;
        this._node_width = node_width;
        this._node_height = node_height;
        this._half_node_width = half_node_width;
        this._half_node_height = half_node_height;
    }

    get_node_by_pixel(x: number, y: number): RoadNode {
        throw new Error("Method not implemented.");
    }
    get_node_by_derect(dx: number, dy: number): RoadNode {
        const f_point: Point = this.get_pixel_by_derect(dx, dy);
        const w_point: Point = this.get_world_point_by_pixel(f_point.x, f_point.y);
        const node: RoadNode = new RoadNode();
        node.cx = w_point.x;
        node.cy = w_point.y;
        node.px = f_point.x;
        node.py = f_point.y;
        node.dx = dx;
        node.dy = dy;
        return node;
    }
    get_node_by_world_point(cx: number, cy: number): RoadNode {
        throw new Error("Method not implemented.");
    }
    get_world_point_by_pixel(x: number, y: number): Point {
        const cx: number = Math.ceil(x / this._node_width - 0.5 + y / this._node_height) - 1;
        const cy: number = (this._col - 1) - Math.ceil(x / this._node_width - 0.5 - y / this._node_height);
        return new Point(cx, cy);
    }
    get_pixel_by_world_point(cx: number, cy: number): Point {
        throw new Error("Method not implemented.");
    }
    get_derect_by_pixel(x: number, y: number): Point {
        throw new Error("Method not implemented.");
    }
    get_derect_by_world_point(cx: number, cy: number): Point {
        throw new Error("Method not implemented.");
    }
    get_pixel_by_derect(dx: number, dy: number): Point {
        const x: number = Math.floor((dx + dy % 2) * this._node_width + (1 - dy % 2) * this._half_node_width);
        const y: number = Math.floor((dy + 1) * this._half_node_height);
        return new Point(x, y);
    }
    
}