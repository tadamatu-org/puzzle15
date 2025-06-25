// タイルの位置を表す型
export interface Position {
  row: number;
  col: number;
}

// タイルの情報を表す型
export interface Tile {
  id: number;
  value: number;
  position: Position;
  isBlank: boolean;
}

// ゲームの状態を表す型
export interface GameState {
  tiles: Tile[];
  moves: number;
  time: number;
  isPlaying: boolean;
  isCompleted: boolean;
  boardSize: number;
}

// ゲームの難易度を表す型
export type Difficulty = "easy" | "medium" | "hard";

// ゲームの設定を表す型
export interface GameSettings {
  difficulty: Difficulty;
  boardSize: number;
  showTimer: boolean;
  showMoves: boolean;
}
