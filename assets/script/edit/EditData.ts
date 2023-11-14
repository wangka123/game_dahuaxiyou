export default class EditData {
    public obj_id: string = "";
    public obj_name: string = "";
    public obj_type: string = "";
    public skin: string = "";
    public x: number = 0;
    public y: number = 0;
    public cx: number = 0;
    public cy: number = 0;
    public params: string = "";

    constructor(map_item: any) {
        this.obj_id = map_item.objId;
        this.obj_name = map_item.objName;
        this.obj_type = map_item.objType;
        this.skin = map_item.skin;
        this.x = map_item.x;
        this.y = map_item.y;
        this.cx = map_item.cx;
        this.cy = map_item.cy;
        this.params = map_item.params;
    }
}

export class EditNpcData extends EditData {
    public dir: number = 0;
    public is_patrol: boolean = false;
    public dlg_id: number = 0;
    public task_id: number = 0;
    public func_id: number = 0;
    public npc_type: number = 0;

    constructor(map_item: any) {
        super(map_item);
        this.dir = map_item.direction;
        this.is_patrol = map_item.isPatrol;
        this.dlg_id = map_item.dialogId;
        this.task_id = map_item.taskId;
        this.func_id = map_item.funcId;
        this.npc_type = map_item.npcType;
    }
}

export class EditMonsterData extends EditData {
    public dir: number = 0;
    public is_patrol: boolean = false;
    public dlg_id: number = 0;
    public fight_id: number = 0;
    public monster_type: number = 0;
    constructor(map_item: any) {
        super(map_item);
        this.dir = map_item.direction;
        this.is_patrol = map_item.isPatrol;
        this.dlg_id = map_item.dialogId;
        this.fight_id = map_item.fightId;
        this.monster_type = map_item.monsterType;
    }
}

export class EditTransferData extends EditData {
    public target_map_id: string = "";
    public target_map_spawn_id: number = 0;
    public transfer_type: number = 0;
    constructor(map_item: any) {
        super(map_item);
        this.target_map_id = map_item.targetMapId;
        this.target_map_spawn_id = map_item.targetMapSpawnId;
        this.transfer_type = map_item.transferType;
    }
}

export class EditSpawnPointData extends EditData {
    public spawn_id: number = 0;
    public default_spawn: boolean = false;

    constructor(map_item: any) {
        super(map_item);
        this.spawn_id = map_item.spawnId;
        this.default_spawn = map_item.defaultSpawn;
    }
}