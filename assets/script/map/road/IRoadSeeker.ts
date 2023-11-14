import { PathOptimize } from "./PathOptimize";
import { PathQuadSeek } from "./PathQuadSeek";
import RoadNode from "./RoadNode";

export default interface IRoadSeeker {
    seek_path(start_node: RoadNode, target_node: RoadNode): Array<RoadNode>;
    seek_path2(start_node: RoadNode, target_node: RoadNode): Array<RoadNode>;
    test_seek_path_step(start_node: RoadNode, target_node: RoadNode, cb: Function, target: any, time: number): void;
    is_through(start_node: RoadNode, target_node: RoadNode): boolean;
    is_pass(node: RoadNode):boolean;
    get_road_node(cx: number, cy: number): RoadNode;
    set_max_seek_step(max_step: number);
    set_path_optimize(optimize: PathOptimize);
    set_path_quad_seek(path_quad_seek: PathQuadSeek);
    set_road_node_pass_condi(cb: Function);
}