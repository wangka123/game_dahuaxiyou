import RoadNode from "./RoadNode";

export default class BinaryTreeNode {
    public seek_tag: number = 0;
    public open_node: RoadNode = null;
    public count: number = 0;

    public reflesh_tag() {
        this.open_node = null;
        this.count = 0;
        this.seek_tag++;
        if(this.seek_tag > 1000000000)
            this.seek_tag = 0;
    }

    public is_tree_null() {
        return !this.open_node;
    }

    public add_tree_node(road_node: RoadNode, head: RoadNode = null) {
        this.count++;
        if(!head) {
            if(!this.open_node) {
                this.open_node = road_node;
                return;
            }
            head = this.open_node;
        }
        if(head == road_node)
            return;
        if(road_node.f >= head.f) {
            if(head.right) {
                this.add_tree_node(road_node, head.right);
            } else {
                head.right = road_node;
                road_node.tree_parent = head;
            }
        } else {
            if(head.left) {
                this.add_tree_node(road_node, head.left);
            } else {
                head.left = road_node;
                road_node.tree_parent = head;
            }
        }
    }

    public remove_tree_node(road_node: RoadNode) {
        this.count++;
        if(!road_node.tree_parent && !road_node.left && !road_node.right) {
            if(road_node == this.open_node) {
                this.open_node = null;
            }
            return;
        }
        if(!road_node.tree_parent) {
            if(road_node.left) {
                this.open_node = road_node.left;
                road_node.left.tree_parent = null;
                if(road_node.right) {
                    road_node.right.tree_parent = null;
                    this.add_tree_node(road_node.right, this.open_node);
                }
            } else if(road_node.right) {
                this.open_node = road_node.right;
                road_node.right.tree_parent = null;
            }
        } else {
            if(road_node.tree_parent.left == road_node) {
                if(road_node.right) {
                    road_node.tree_parent.left = road_node.right;
                    road_node.right.tree_parent = road_node.tree_parent;
                    if(road_node.left) {
                        road_node.left.tree_parent = null;
                        this.add_tree_node(road_node.left, road_node.right);
                    }
                } else {
                    road_node.tree_parent.left = road_node.left;
                    if(road_node.left) {
                        road_node.left.tree_parent = road_node.tree_parent;
                    }
                }
            } else if(road_node.tree_parent.right == road_node){
                if(road_node.left) {
                    road_node.tree_parent.right = road_node.left;
                    road_node.left.tree_parent = road_node.tree_parent;
                    if(road_node.right) {
                        road_node.right.tree_parent = null;
                        this.add_tree_node(road_node.right, road_node.left);
                    }
                } else {
                    road_node.tree_parent.right = road_node.right;
                    if(road_node.right) {
                        road_node.right.tree_parent = road_node.tree_parent;
                    }
                }
            }
        }
        road_node.reset_tree();
    }

    public get_min_f_node(head: RoadNode = null) {
        this.count++;
        if(!head) {
            if(!this.open_node)
                return null;
            head = this.open_node;
        }
        if(head.left) {
            return this.get_min_f_node(head.left);
        }
        const min_node: RoadNode = head;
        if(!head.tree_parent) {
            this.open_node = head.right;
            if(this.open_node) {
                this.open_node.tree_parent = null;
            }
        } else {
            head.tree_parent.left = head.right;
            if(head.right) {
                head.right.tree_parent = head.tree_parent;
            }
        }
        return min_node;
    }

    public set_to_open_list(node: RoadNode) {
        node.open_tag = this.seek_tag;
        node.close_tag = 0;
    }

    public set_to_close_list(node: RoadNode) {
        node.open_tag = 0;
        node.close_tag = this.seek_tag;
    }

    public is_in_open_list(node: RoadNode) {
        return node.open_tag == this.seek_tag;
    }

    public is_in_close_list(node: RoadNode) {
        return node.close_tag == this.seek_tag;
    }

    public get_open_list(): RoadNode[] {
        const open_list: RoadNode[] = [];
        this._search_tree(this.open_node, open_list);
        return open_list;
    }

    private _search_tree(head: RoadNode, open_list: RoadNode[]) {
        if(!head)
            return;
        open_list.push(head);
        if(head.left)
            this._search_tree(head.left, open_list);
        if(head.right)
            this._search_tree(head.right, open_list);
    }
}