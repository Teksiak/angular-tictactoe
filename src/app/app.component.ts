import { Component } from '@angular/core';
import { max } from 'rxjs';

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
  public players: Array<"X" | "O" | null> = []
  public player: "X" | "O" | null = null;
  public opponent: "X" | "O" | null = null;
  public isEnded: boolean = false;
  public winningSet: [Array<number>, "X" | "O" | null] = [[], null]
  public play(key: number) {
    if(!this.isEnded && this.board[key] == null) {
      this.board[key] = this.player
      if(Object.values(this.board).includes(null)) {
        this.ai()
      }

      let temp = this.checkWinner(this.board)
      this.isEnded = temp[0]
      if(this.isEnded) {
        this.winningSet = temp[1]
      }
    }
  }
  public ai() {
    const choice = (board: Grid) => {
      let bestScore = -1000
      let bestMove = -1
      for(const [key,value] of Object.entries(board)){
        if(value == null) {
          board[Number(key)] = this.opponent
          let score = minimax(board, 0, false)
          board[Number(key)] = null
          if(score > bestScore) {
            bestScore = score;
            bestMove = Number(key)
          }
        }
      }
      this.board[bestMove] = this.opponent;
    }
    const minimax = (board: Grid, depth: number, isMaximizing: boolean) => {
      let checkWin = this.checkWinner(board)
      if(checkWin[0]) {
        let winner = checkWin[1][1]
        if(winner == this.opponent) { return +1; }
        if(winner == this.player) { return -1; }
        if(winner == null) { return 0; }
      }
      if(isMaximizing) {
        let bestScore = -1000
        for(const [key,value] of Object.entries(board)){
          if(value == null) {
            board[Number(key)] = this.opponent
            let score = minimax(board, depth+1, !isMaximizing);
            board[Number(key)] = null
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore;
      }
      else {
        let bestScore = 1000
        for(const [key,value] of Object.entries(board)){
          if(value == null) {
            board[Number(key)] = this.player
            let score = minimax(board, depth+1, !isMaximizing);
            board[Number(key)] = null
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore;
      }
    }
    choice(this.board)
  }
  public choosePlayer(player: string) {
    if(player == 'O') {
      this.players = ['O', 'X']
    }
    else {
      this.players = ['X', 'O']
    }
    this.player = this.players[0]
    this.opponent = this.players[1]
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
    this.players = [];
  }
  private getWinningSet(board: Grid): [Array<number>, "X" | "O" | null] {
    for(const arr of this.winningCombinations) {
      let player = board[arr[0]]
      if(arr.every( (val) => board[val]===player && player != null)) {
        return [arr, player];
      }
    }
    return [[], null]
  }
  private checkWinner(board: Grid): [boolean, [Array<number>, "X" | "O" | null]] {
    let winning: boolean = false;
    for(const arr of this.winningCombinations) {
      let player = board[arr[0]]
      winning = arr.every( (val) => board[val]===player && player != null)
      if(winning) {
        return [winning, this.getWinningSet(board)];
      }
    }
    if(!Object.values(board).includes(null)) {
      return [true, this.getWinningSet(board)];
    }
    return [false, [[], null]];
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
      if(this.winningSet[1] == this.player) {
        if(this.winningSet[0]!.includes(key)) {
          return "boardElement winningElement"
        }
        return "boardElement noHover"
      }
      else {
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
