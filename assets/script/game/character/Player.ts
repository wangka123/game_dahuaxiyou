import { _decorator, Component, Node } from 'cc';
import Character, { CharacterState } from './Character';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Character {
    start() {
        super.start();
    }

    public set state(value: CharacterState) {
        this._state = value;
        switch(value) {
            case CharacterState.idle:
                this.clip.begin = 0;
                this.clip.end = 6;
                break;
            case CharacterState.walk:
                this.clip.begin = 6;
                this.clip.end = 12;
                break;
            case CharacterState.sit_down:
                this.clip.begin = 12;
                this.clip.end = 18;
                break;
            case CharacterState.sit_down_walk:
                this.clip.begin = 18;
                this.clip.end = 24;
                break;
        }
    }
}

