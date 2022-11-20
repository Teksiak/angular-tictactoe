import { Component } from '@angular/core';

type Grid = { [key: number]: "X" | "O" | null }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public board: Grid = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null
  }
  readonly winningCombinations: Array<Array<number>> = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
  ]
  private getWinningSet(): [Array<number>, "X" | "O" | null] {
    for(const arr of this.winningCombinations) {
      let player = this.board[arr[0]]
      if(arr.every( (val) => this.board[val]===player && player != null)) {
        return [arr, player];
      }
    }
    return [[], null]
  }
  private checkWinner() {
    let winning: boolean = false;
    for(const arr of this.winningCombinations) {
      let player = this.board[arr[0]]
      winning = arr.every( (val) => this.board[val]===player && player != null)
      if(winning == true) {
        return winning;
      }
    }
    if(!Object.values(this.board).includes(null)) {
      return true;
    }
    return false;
  }
  public players: Array<"X" | "O" | null> = ['O', 'X']
  public isEnded: boolean = false;
  public winningSet: [Array<number>, "X" | "O" | null] = [[], null]
  public play(key: number) {
    if(!this.isEnded && this.board[key] == null) {
      let currentPlayer = this.players[0]
      this.board[key] = currentPlayer
  
      var temp = this.players[0];
      this.players[0] = this.players[1];
      this.players[1] = temp;
      this.isEnded = this.checkWinner()
    }
    if(this.isEnded) {
      this.winningSet = this.getWinningSet()
    }
  }
  public restartGame() {
    this.board = {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null
    };
    this.isEnded = false;
    this.winningSet = [[], null];
  }

  public clickedStyle(key: number) {
    if(this.board[key] != null) {
      return {
        transform: "scale(.98)",
        boxShadow: `0px 0px 0px rgba(33,33,33,0.4),
                    inset 1px 1px 3px rgba(255,255,255,0.4)`,
        cursor: 'inherit'
      }
    }
    return {}
  }
  public fieldClass(key: number) {
    if(this.isEnded) {
      if(this.winningSet[1] == 'O') {
        if(this.winningSet[0]!.includes(key)) {
          return "boardElement winningElement"
        }
        return "boardElement noHover"
      }
      else if(this.winningSet[1] == 'X') {
        if(this.winningSet[0]!.includes(key)) {
          return "boardElement losingElement"
        }
        return "boardElement noHover"
      }
    }
    return "boardElement"
  }
  public fieldImageSource(player: string | null) {
    if(player=='O') {
      return "../assets/svg/circle.svg"
    }
    else if(player=='X') {
      return "../assets/svg/x-lg.svg"
    }
    return ""
  }
}
