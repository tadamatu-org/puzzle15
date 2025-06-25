"use client";

import React, { useState, useEffect } from "react";
import { PuzzleBoard } from "@/components/PuzzleBoard";
import { GameState, GameSettings, Difficulty } from "@/types";

// 初期ゲーム設定
const initialSettings: GameSettings = {
  difficulty: "medium",
  boardSize: 4,
  showTimer: true,
  showMoves: true,
};

// ランダムシャッフル関数
const shuffleTiles = (boardSize: number): GameState => {
  const totalTiles = boardSize * boardSize;
  const numbers = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);

  // Fisher-Yates シャッフル
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // 空白を最後に追加
  numbers.push(0);

  const tiles = numbers.map((value, index) => ({
    id: index,
    value,
    position: {
      row: Math.floor(index / boardSize),
      col: index % boardSize,
    },
    isBlank: value === 0,
  }));

  return {
    tiles,
    moves: 0,
    time: 0,
    isPlaying: false,
    isCompleted: false,
    boardSize,
  };
};

// 初期ゲーム状態（後でゲームロジックで動的に生成される）
const createInitialGameState = (boardSize: number): GameState => {
  const totalTiles = boardSize * boardSize;
  const tiles = Array.from({ length: totalTiles }, (_, index) => ({
    id: index,
    value: index === totalTiles - 1 ? 0 : index + 1,
    position: {
      row: Math.floor(index / boardSize),
      col: index % boardSize,
    },
    isBlank: index === totalTiles - 1,
  }));

  return {
    tiles,
    moves: 0,
    time: 0,
    isPlaying: false,
    isCompleted: false,
    boardSize,
  };
};

export const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(initialSettings.boardSize)
  );
  const [settings, setSettings] = useState<GameSettings>(initialSettings);

  // タイマー効果
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.isPlaying && !gameState.isCompleted) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: prev.time + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.isPlaying, gameState.isCompleted]);

  // タイルクリックハンドラー
  const handleTileClick = (tileId: number) => {
    // ゲームが完了している場合は何もしない
    if (gameState.isCompleted) return;

    const clickedTileIndex = gameState.tiles.findIndex(
      (tile) => tile.id === tileId
    );
    const blankTileIndex = gameState.tiles.findIndex((tile) => tile.isBlank);

    if (
      clickedTileIndex === -1 ||
      blankTileIndex === -1 ||
      gameState.tiles[clickedTileIndex].isBlank
    )
      return;

    const clickedTile = gameState.tiles[clickedTileIndex];
    const blankTile = gameState.tiles[blankTileIndex];

    // 空白タイルとクリックされたタイルが隣接しているかチェック
    const clickedRow = Math.floor(clickedTileIndex / gameState.boardSize);
    const clickedCol = clickedTileIndex % gameState.boardSize;
    const blankRow = Math.floor(blankTileIndex / gameState.boardSize);
    const blankCol = blankTileIndex % gameState.boardSize;

    const isAdjacent =
      (Math.abs(clickedRow - blankRow) === 1 && clickedCol === blankCol) ||
      (Math.abs(clickedCol - blankCol) === 1 && clickedRow === blankRow);

    if (!isAdjacent) return;

    // タイルを移動（配列内で交換）
    const newTiles = [...gameState.tiles];
    [newTiles[clickedTileIndex], newTiles[blankTileIndex]] = [
      newTiles[blankTileIndex],
      newTiles[clickedTileIndex],
    ];

    // 勝利判定
    const isCompleted = newTiles.every((tile, index) => {
      if (index === newTiles.length - 1) {
        return tile.isBlank; // 最後のタイルは空白
      }
      return tile.value === index + 1; // 1から15まで順番
    });

    // ゲーム状態を更新
    setGameState((prev) => ({
      ...prev,
      tiles: newTiles,
      moves: prev.moves + 1,
      isPlaying: true,
      isCompleted,
    }));
  };

  // 新しいゲーム開始
  const handleNewGame = () => {
    setGameState((prev) => ({
      ...shuffleTiles(prev.boardSize),
      isPlaying: true,
    }));
  };

  // リセット
  const handleReset = () => {
    setGameState((prev) => ({
      ...shuffleTiles(prev.boardSize),
      isPlaying: false,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <header className="text-center py-6 md:py-8 px-4 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          15パズル
        </h1>
        <p className="text-base md:text-lg opacity-90 font-light">
          タイルを動かして数字を順番に並べよう！
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <PuzzleBoard
          gameState={gameState}
          onTileClick={handleTileClick}
          onNewGame={handleNewGame}
          onReset={handleReset}
        />
      </main>

      <footer className="text-center py-4 text-white opacity-70 text-sm">
        <p>© 2024 Puzzle15 Game</p>
      </footer>
    </div>
  );
};
