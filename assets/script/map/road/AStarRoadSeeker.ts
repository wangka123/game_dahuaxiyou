import BinaryTreeNode from "./BinaryTreeNode";
import IRoadSeeker from "./IRoadSeeker";
import { PathOptimize } from "./PathOptimize";
import { PathQuadSeek } from "./PathQuadSeek";
import RoadNode from "./RoadNode";

export default class AStarRoadSeeker implements IRoadSeeker {
    private COST_STRAIGHT: number = 10;
    private COST_DIAGONAL: number = 14;
    private _max_step: number = 1000;
    private _road_nodes: {[key: number]: RoadNode};
    private _start_node: RoadNode;
    private _target_node: RoadNode;
    private _current_node: RoadNode;
    private _binary_tree: BinaryTreeNode = new BinaryTreeNode();
    private _round1: number[][] = [[0,-1],[1,0],[0,1],[-1,0]]
    private _round2: number[][] = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    private _round: number[][] = this._round2;
    private _handle: number = -1;
    private _open_list: RoadNode[];
    private _close_list: RoadNode[];
    private _is_pass_cb: Function = null;
    private _path_quad_seek: PathQuadSeek = PathQuadSeek.path_dir_8;
    private _path_optimize: PathOptimize;


    constructor(road_nodes: {[key: string]: RoadNode}) {
        this._road_nodes = road_nodes;
    }

    seek_path(s_node: RoadNode, t_node: RoadNode): RoadNode[] {
        this._start_node = s_node;
        this._target_node = t_node;
        this._current_node = s_node;
        if(!this._start_node || !this._target_node)
            return [];
        if(this._start_node == this._target_node)
            return [this._target_node];
        if(!this.is_pass(this._target_node)) {
            return [];
        }
        this._start_node.g = 0;
        this._start_node.reset_tree();

        this._binary_tree.reflesh_tag();
        let step: number = 0;
        while(true) {
            if(step > this._max_step) {
                return [];
            }
            step++;
            this._search_round_nodes(this._current_node);
            if(this._binary_tree.is_tree_null()) {
                return [];
            }
            this._current_node = this._binary_tree.get_min_f_node();
            if(this._current_node == this._target_node) {
                return this._get_path();
            } else {
                this._binary_tree.set_to_close_list(this._current_node);
            }
        }
    }
    seek_path2(s_node: RoadNode, t_node: RoadNode): RoadNode[] {
        this._start_node = s_node;
        this._target_node = t_node;
        this._current_node = s_node;
        if(!this._start_node || !this._target_node)
            return [];
        if(this._start_node == this._target_node)
            return [this._target_node];
        let new_max_step: number = this._max_step;
        if(!this.is_pass(this._target_node)) {
            new_max_step = (Math.abs(t_node.cx - s_node.cx) + Math.abs(t_node.cy - s_node.cy)) * 3;
            if(new_max_step > this._max_step)
                new_max_step = this._max_step;
        }
        this._start_node.g = 0;
        this._start_node.reset_tree();

        this._binary_tree.reflesh_tag();
        let step: number = 0;
        let close_node: RoadNode = null;
        while(true) {
            if(step > new_max_step) {
                return this.seek_path(s_node, close_node)
            }
            step++;
            this._search_round_nodes(this._current_node);
            if(this._binary_tree.is_tree_null()) {
                return this.seek_path(s_node, close_node);
            }
            this._current_node = this._binary_tree.get_min_f_node();
            if(!close_node) {
                close_node = this._current_node;
            } else {
                if(this._current_node.h < close_node.h) {
                    close_node = this._current_node;
                }
            }
            if(this._current_node == this._target_node) {
                return this._get_path();
            } else {
                this._binary_tree.set_to_close_list(this._current_node);
            }
        }
    }
    test_seek_path_step(s_node: RoadNode, t_node: RoadNode, cb: Function, target: any, time: number): void {
        this._start_node = s_node;
        this._target_node = t_node;
        this._current_node = s_node;
        if(!this.is_pass(this._target_node)) {
            return;
        }
        this._start_node.g = 0;
        this._start_node.reset_tree();
        this._binary_tree.reflesh_tag();
        this._close_list = [];
        let step: number = 0;
        clearInterval(this._handle);
        this._handle = setInterval(() => {
            if(step > this._max_step) {
                clearInterval(this._handle);
                return;
            }
            step++;
            this._search_round_nodes(this._current_node);
            if(this._binary_tree.is_tree_null()) {
                clearInterval(this._handle);
                return;
            }
            this._current_node = this._binary_tree.get_min_f_node();
            if(this._current_node == this._target_node) {
                clearInterval(this._handle);
                this._open_list = this._binary_tree.get_open_list();
                cb.apply(target, [this._start_node, this._target_node, 
                    this._current_node, this._open_list, this._close_list, this._get_path()]);
            } else {
                this._binary_tree.set_to_close_list(this._current_node);
                this._open_list = this._binary_tree.get_open_list();
                this._close_list.push(this._current_node);
                cb.apply(target, [this._start_node, this._target_node, 
                    this._current_node, this._open_list, this._close_list, null]);
            }
        }, time);
    }
    is_through(s_node: RoadNode, t_node: RoadNode): boolean {
        if(s_node == t_node)
            return false;
        const dis_x: number = 0;
        const dis_y: number = 0;

        let dir_x: number = 0;
        if(t_node.cx > s_node.cx)
            dir_x = 1;
        else if(t_node.cx < s_node.cx)
            dir_x = -1;
        
        let dir_y: number = 0;
        if(t_node.cy > s_node.cy)
            dir_x = 1;
        else if(t_node.cy < s_node.cy)
            dir_x = -1;
        
        let rx: number = 0;
        let ry: number = 0;
        let int_num: number = 0;
        let decimal: number = 0;
        if(dis_x > dis_y) {
            const rate: number = dis_y / dis_x;
            for(let i = 0; i < dis_x; i++) {
                ry = s_node.cy + i * dir_y * rate;
                int_num = Math.floor(ry);
                decimal = ry % 1;
                const cx1: number = s_node.cx + i * dir_x;
                const cy1: number = decimal <= 0.5 ? int_num : int_num + 1;
                
                ry = s_node.cy + (i + 1) * dir_y * rate;
                int_num = Math.floor(ry);
                decimal = ry % 1;
                const cx2: number = s_node.cx + (i + 1) * dir_x;
                const cy2: number = decimal <= 0.5 ? int_num : int_num + 1;

                const n1: RoadNode = this.get_road_node(cx1, cy1);
                const n2: RoadNode = this.get_road_node(cx2, cy2);
                if(!this._is_cross_adjacent_nodes(n1, n2))
                    return false;
            }
        } else {
            const rate: number = dis_x / dis_y;
            for(let i = 0; i < dis_y; i++) {
                rx = i * dir_x * rate;
                int_num = dir_x > 0 ? Math.floor(s_node.cx + rx) : Math.ceil(s_node.cx + rx);
                decimal = Math.abs(rx % 1);
                const cx1: number = decimal <= 0.5 ? int_num : int_num + 1 * dir_x;
                const cy1: number = s_node.cy + i * dir_y;

                rx = (i + 1) * dir_x * rate;
                int_num = dir_x > 0 ? Math.floor(s_node.cx + rx) : Math.ceil(s_node.cx + rx);
                decimal = Math.abs(rx % 1);
                const cx2: number = decimal <= 0.5 ? int_num : int_num + 1 * dir_x;
                const cy2: number = s_node.cy + (i + 1) * dir_y;

                const n1: RoadNode = this.get_road_node(cx1, cy1);
                const n2: RoadNode = this.get_road_node(cx2, cy2);
                if(!this._is_cross_adjacent_nodes(n1, n2))
                    return false;
            }
        }
        return true;
    }
    is_pass(node: RoadNode): boolean {
        if(this._is_pass_cb)
            return this._is_pass_cb(node);
        if(!node || node.value == 1)
            return false;
        return true;
    }
    get_road_node(cx: number, cy: number): RoadNode {
        return this._road_nodes[cx + "_" + cy];
    }
    set_max_seek_step(max_step: number) {
        this._max_step = max_step;
    }
    set_path_optimize(optimize: PathOptimize) {
        this._path_optimize = optimize;
    }
    set_path_quad_seek(path_quad_seek: PathQuadSeek) {
        this._path_quad_seek = path_quad_seek;
        if(this._path_quad_seek == PathQuadSeek.path_dir_4) {
            this._round = this._round1;
        } else {
            this._round = this._round2;
        }
    }
    set_road_node_pass_condi(cb: Function) {
        this._is_pass_cb = cb;
    }

    public set_node_f(n: RoadNode) {
        let g: number;
        if(n.cx == this._current_node.cx || n.cy == this._current_node.cy) {
            g = this._current_node.g + this.COST_STRAIGHT;
        } else {
            g = this._current_node.g + this.COST_DIAGONAL;
        }
        if(this._is_in_open_list(n)) {
            if(g < n.g) {
                n.g = g;
                n.parent = this._current_node;
                n.h = (Math.abs(this._target_node.cx - n.cx) + Math.abs(this._target_node.cy - n.cy)) * this.COST_STRAIGHT
                n.f = n.g + n.h;
                this._binary_tree.remove_tree_node(n);
                this._binary_tree.add_tree_node(n);
            }
        } else {
            n.g = g;
            this._binary_tree.set_to_open_list(n);
            n.reset_tree();
            n.parent = this._current_node;
            n.h = (Math.abs(this._target_node.cx - n.cx) + Math.abs(this._target_node.cy - n.cy)) * this.COST_STRAIGHT;
            n.f = n.g + n.h;
            this._binary_tree.add_tree_node(n);
        }
    }

    public dispose(): void {
        this._road_nodes = null;
        this._round = null;
    }

    private _get_path(): RoadNode[] {
        const node_arr: RoadNode[] = [];
        let node: RoadNode = this._target_node;
        while(node != this._start_node) {
            node_arr.unshift(node);
            node = node.parent;
        }
        node_arr.unshift(this._start_node);
        if(this._path_optimize == PathOptimize.none) {
            return node_arr;
        }
        for(let i: number = 1; i < node_arr.length - 1; i++) {
            const p_node: RoadNode = node_arr[i - 1];
            const m_node: RoadNode = node_arr[i];
            const n_node: RoadNode = node_arr[i + 1];
            const bx: boolean = m_node.cx == p_node.cx && m_node.cx == n_node.cx;
            const by: boolean = m_node.cy == p_node.cy && m_node.cy == n_node.cy;
            let b3: boolean = false;
            if(this._path_quad_seek == PathQuadSeek.path_dir_8) {
                b3 = ((m_node.cx - p_node.cx) / (m_node.cy - p_node.cy) *
                    ((m_node.cx - n_node.cx) / (m_node.cy - n_node.cy))) == 1
            }
            if(bx || by || b3) {
                node_arr.splice(i, 1);
                i--;
            }
        }
        if(this._path_quad_seek == PathQuadSeek.path_dir_4)
            return node_arr;
        if(this._path_optimize == PathOptimize.better)
            return node_arr;
        for(let i: number = 0; i < node_arr.length - 2; i++) {
            const s_node: RoadNode = node_arr[i];
            let opt_node: RoadNode = null;
            let j: number = node_arr.length - 1;
            for(; j < i + 1; j--) {
                const t_node: RoadNode = node_arr[j];
                if(s_node.cx == t_node.cx && s_node.cy == t_node.cy)
                    continue;
                if(this.is_through(s_node, t_node)) {
                    opt_node = t_node;
                    break;
                }
            }
            if(opt_node) {
                const opt_len: number = j - i - 1;
                node_arr.splice(i + 1, opt_len);
            }
        }
        return node_arr;
    }

    private _is_cross_adjacent_nodes(n1: RoadNode, n2: RoadNode): boolean {
        if(n1 == n2)
            return false;
        if(!this.is_pass(n1) || !this.is_pass(n2))
            return false;
        const dir_x: number = n2.cx - n1.cx;
        const dir_y: number = n2.cy - n1.cy;
        if(Math.abs(dir_x) > 1 || Math.abs(dir_y) > 1)
            return false;
        if((n1.cx == n2.cx) || (n1.cy == n2.cy))
            return true;
        if(this.is_pass(this.get_road_node(n1.cx, n1.cy + dir_y)) &&
            this.is_pass(this.get_road_node(n1.cx + dir_x, n1.cy)))
            return true;
        return false;
    }

    private _search_round_nodes(node: RoadNode): void {
        for(let i: number = 0; i < this._round.length; i++) {
            const cx: number = node.cx + this._round[i][0];
            const cy: number = node.cy + this._round[i][1];
            const n: RoadNode = this.get_road_node(cx, cy);
            if(this.is_pass(n) && n != this._start_node &&
                !this._is_in_close_list(n) && !this._is_in_corner(n)) {
                this.set_node_f(n);
            }
        }
    }

    private _is_in_close_list(node: RoadNode): boolean {
        return this._binary_tree.is_in_close_list(node);
    }

    private _is_in_open_list(node: RoadNode): boolean {
        return this._binary_tree.is_in_open_list(node);
    }

    private _is_in_corner(node: RoadNode): boolean {
        if(this._path_quad_seek == PathQuadSeek.path_dir_4)
            return false;
        if(node.cx == this._current_node.cx || node.cy == this._current_node.cy)
            return false;
        const n1: RoadNode = this.get_road_node(this._current_node.cx, node.cy);
        const n2: RoadNode = this.get_road_node(node.cx, this._current_node.cy);
        if(this.is_pass(n1) && this.is_pass(n2))
            return false;
        return true;
    }
}