import Effect from "mahjongh5/component/Effect";
import ImageTileTable from "mahjongh5/component/tile/ImageTileTable";
import CommonTileList from "mahjongh5/component/tile/CommonTileList";
import * as Assets from "../Assets";
import * as System from "mahjongh5/System";

export default class ChangeCardEffect extends Effect {
    private animCard: CommonTileList[] = [];
    private anim:     Phaser.Tween[];
    private part2:    Phaser.Tween[];

    constructor(game: Phaser.Game, tileTable: ImageTileTable, parent?: PIXI.DisplayObjectContainer) {
        super(game, parent);

        for (let i = 0; i < 4; i++) {
            this.animCard.push(new CommonTileList(game, 3, tileTable, undefined, 50, 75, i, false, 3));
            this.animCard[i].TileAnchor = new Phaser.Point(0.5, 0.5);
            this.animCard[i].visible = false;
            this.animCard[i].z = (i - 1) * 90;
        }

        this.animCard[0].position = new Phaser.Point(game.width / 2, 1400);
        this.animCard[0].pivot.x = 55;
        this.animCard[1].position = new Phaser.Point(1850, game.height / 2);
        this.animCard[1].pivot.y = 105;
        this.animCard[2].position = new Phaser.Point(game.width / 2, 100);
        this.animCard[2].pivot.x = 105;
        this.animCard[3].position = new Phaser.Point(150, game.height / 2);
        this.animCard[3].pivot.y = 55;

        this.anim = new Array<Phaser.Tween>(4);
        this.anim[0] = game.add.tween(this.animCard[0]).to({ y: game.height / 2 + 300 }, 1000, Phaser.Easing.Linear.None, false);
        this.anim[1] = game.add.tween(this.animCard[1]).to({ x: game.width  / 2 + 300 }, 1000, Phaser.Easing.Linear.None, false);
        this.anim[2] = game.add.tween(this.animCard[2]).to({ y: game.height / 2 - 300 }, 1000, Phaser.Easing.Linear.None, false);
        this.anim[3] = game.add.tween(this.animCard[3]).to({ x: game.width  / 2 - 300 }, 1000, Phaser.Easing.Linear.None, false);

        this.part2 = new Array<Phaser.Tween>(4);
    }

    protected *RunEffect(mode: number, index: number): IterableIterator<Promise<void>> {
        if (mode === 0) {
            this.animCard[index].visible = true;
            this.anim[index].start();
        } else {
            if (index === 0) {
                this.part2[0] = this.game.add.tween(this.animCard[0]).to({ x: 1850 }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[1] = this.game.add.tween(this.animCard[1]).to({ y: 100  }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[2] = this.game.add.tween(this.animCard[2]).to({ x: 150  }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[3] = this.game.add.tween(this.animCard[3]).to({ y: 1400 }, 1000, Phaser.Easing.Linear.None, false);

                for (let i = 0; i < 4; i++) {
                    this.game.add.tween(this.animCard[i]).to({ z: i * 90, angle: -90 }, 1000, Phaser.Easing.Linear.None, true).onUpdateCallback(() => {
                        this.animCard[i].position.x = this.game.width  / 2 + Math.floor(300 * Math.cos(this.animCard[i].z * Math.PI / 180));
                        this.animCard[i].position.y = this.game.height / 2 - Math.floor(300 * Math.sin(this.animCard[i].z * Math.PI / 180));
                    }).onComplete.addOnce(() => {
                        this.part2[i].start().onComplete.addOnce(() => {
                            this.animCard[i].visible = false;
                        });
                    });
                }
            } else if (index === 1) {
                this.part2[0] = this.game.add.tween(this.animCard[0]).to({ x: 150  }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[1] = this.game.add.tween(this.animCard[1]).to({ y: 1400 }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[2] = this.game.add.tween(this.animCard[2]).to({ x: 1850 }, 1000, Phaser.Easing.Linear.None, false);
                this.part2[3] = this.game.add.tween(this.animCard[3]).to({ y: 100  }, 1000, Phaser.Easing.Linear.None, false);

                for (let i = 0; i < 4; i++) {
                    this.game.add.tween(this.animCard[i]).to({ z: i * 90, angle: 90 }, 1000, Phaser.Easing.Linear.None, true).onUpdateCallback(() => {
                        this.animCard[i].position.x = this.game.width  / 2 - Math.pow(-1, i) * Math.floor(300 * Math.cos(this.animCard[i].z * Math.PI / 180));
                        this.animCard[i].position.y = this.game.height / 2 - Math.pow(-1, i) * Math.floor(300 * Math.sin(this.animCard[i].z * Math.PI / 180));
                    }).onComplete.addOnce(() => {
                        this.part2[i].start().onComplete.addOnce(() => {
                            this.animCard[i].visible = false;
                        });
                    });
                }
            } else {
                this.part2[0] = this.game.add.tween(this.animCard[0]).to({ y: 100  }, 2000, Phaser.Easing.Linear.None, false);
                this.part2[1] = this.game.add.tween(this.animCard[1]).to({ x: 150  }, 2000, Phaser.Easing.Linear.None, false);
                this.part2[2] = this.game.add.tween(this.animCard[2]).to({ y: 1400 }, 2000, Phaser.Easing.Linear.None, false);
                this.part2[3] = this.game.add.tween(this.animCard[3]).to({ x: 1850 }, 2000, Phaser.Easing.Linear.None, false);

                for (let i = 0; i < 4; i++) {
                    this.part2[(i + 1) % 4].start().onComplete.addOnce(() => {
                        this.animCard[i].visible = false;
                    });
                }
            }
        }
    }
}
