import { _decorator, Component, Node, director, Prefab, instantiate, Vec3 } from 'cc';
import { Npc } from '../game/character/Npc';
import { Player } from '../game/character/Player';
import { SpawnPoint } from '../game/transfer/SpawnPoint';
import { Monster } from '../game/character/Monster';
import { TransferDoor } from '../game/transfer/TransferDoor';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {
    private static _instance: GameManager;
    public static get instance(): GameManager {
        return GameManager._instance;
    }

    @property(Prefab)
    public player_prefab: Prefab = null;
    @property(Prefab)
    public npc_prefab: Prefab = null;
    @property(Prefab)
    public monster_prefab: Prefab = null;
    @property(Prefab)
    public spawn_point_prefab: Prefab = null;
    @property(Prefab)
    public transfer_door_prefab: Prefab[] = [];

    onLoad() {
        if(!GameManager._instance) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
            this.init();
        } else {
            this.node.destroy();
        }
    }

    public init() {
    }

    public get_player(): Player {
        const node: Node = instantiate(this.player_prefab);
        const player = node.getComponent(Player);
        player.node.position = new Vec3(0, 0, 0);
        player.node.active = true;
        return player;
    }

    public get_npc(): Npc {
        const npc: Npc = instantiate(this.npc_prefab).getComponent(Npc);
        npc.node.active = true;
        npc.node.position = new Vec3(0, 0, 0);
        return npc;
    }

    public get_monster(): Monster {
        const monster: Monster = instantiate(this.monster_prefab).getComponent(Monster);
        monster.node.active = true;
        monster.node.position = new Vec3(0, 0, 0);
        return monster;
    }

    public get_trans_door(type: number): TransferDoor {
        let index: number = 0;
        if(type < this.transfer_door_prefab.length) {
            index = type;
        }
        const td: TransferDoor = instantiate(this.transfer_door_prefab[index]).getComponent(TransferDoor);
        td.node.active = true;
        td.node.position = new Vec3(0, 0, 0);
        return td;
    }

    public get_spawn_point(): SpawnPoint {
        const sp: SpawnPoint = instantiate(this.spawn_point_prefab).getComponent(SpawnPoint);
        sp.node.active = true;
        sp.node.position = new Vec3(0, 0, 0);
        return sp;
    }

    // start() {
    // }

    // update(deltaTime: number) {  
    // }
}

