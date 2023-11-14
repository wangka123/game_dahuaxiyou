import { _decorator, Button, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UILogin')
export class UILogin extends Component {
    @property(Node)
    loginNode: Node = null;
    @property(Node)
    registerNode: Node = null;

    public showRegister() {
        this.loginNode.active = false;
        this.registerNode.active = true;
    }

    public showLogin() {
        this.loginNode.active = true;
        this.registerNode.active = false;
    }

    public onLogin() {
        const nameEdit: EditBox = 
            this.loginNode.getChildByName("nameEdit").getComponent(EditBox);
        const passEdit: EditBox = 
            this.loginNode.getChildByName("passEdit").getComponent(EditBox);
        
    }
}

