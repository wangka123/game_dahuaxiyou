export default class GameNet {
    private _instance: GameNet = null;

    public get instance(): GameNet {
        if(this._instance == null) {
            this._instance = new GameNet();
        }
        return this._instance;
    }

    public connect() {
        let ws = new WebSocket("ws://localhost:8080");
        ws.onopen = function(e) {
            console.log("WebSocket Connected");
        };
        ws.onerror = function(e) {
            console.log("WebSocket Error");
        };
        
    }
}