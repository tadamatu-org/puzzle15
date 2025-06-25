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

  // タイルクリックハンドラー（後で実装）
  const handleTileClick = (tileId: number) => {
    console.log("Tile clicked:", tileId);
    // TODO: タイル移動ロジックを実装
  };

  // 新しいゲーム開始（後で実装）
  const handleNewGame = () => {
    console.log("New game started");
    // TODO: ゲーム初期化ロジックを実装
    setGameState((prev) => ({
      ...createInitialGameState(prev.boardSize),
      isPlaying: true,
    }));
  };

  // リセット（後で実装）
  const handleReset = () => {
    console.log("Game reset");
    // TODO: リセットロジックを実装
    setGameState((prev) => ({
      ...createInitialGameState(prev.boardSize),
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
