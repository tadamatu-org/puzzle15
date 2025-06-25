"use client";

import React from "react";
import { GameState } from "@/types";

interface PuzzleBoardProps {
  gameState: GameState;
  onTileClick?: (tileId: number) => void;
  onNewGame?: () => void;
  onReset?: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  gameState,
  onTileClick,
  onNewGame,
  onReset,
}) => {
  const { tiles, moves, time, isPlaying, isCompleted, boardSize } = gameState;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8 max-w-2xl mx-auto">
      {/* ゲーム情報 */}
      <div className="flex gap-4 md:gap-8 justify-center w-full">
        <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-lg min-w-16 md:min-w-20">
          <span className="text-sm text-gray-600 font-medium">手数:</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            {moves}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-lg min-w-16 md:min-w-20">
          <span className="text-sm text-gray-600 font-medium">時間:</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* パズルボード */}
      <div
        className="grid gap-1 bg-gray-300 p-2 rounded-xl shadow-lg w-full max-w-md aspect-square"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`flex items-center justify-center text-lg md:text-2xl font-bold rounded-lg cursor-pointer transition-all duration-200 select-none min-h-[50px] md:min-h-[60px] ${
              tile.isBlank
                ? "bg-transparent cursor-default hover:bg-transparent hover:scale-100"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95"
            }`}
            onClick={() => onTileClick?.(tile.id)}
            data-testid={`tile-${tile.value}`}
          >
            {!tile.isBlank && tile.value}
          </div>
        ))}
      </div>

      {/* コントロールボタン */}
      <div className="flex flex-col md:flex-row gap-4 justify-center w-full items-center">
        <button
          className="px-6 py-3 bg-green-500 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-green-600 active:translate-y-px w-full md:w-auto max-w-xs"
          onClick={onNewGame}
          data-testid="new-game-button"
        >
          新しいゲーム
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-green-600 active:translate-y-px w-full md:w-auto max-w-xs"
          onClick={onReset}
          data-testid="reset-button"
        >
          リセット
        </button>
      </div>

      {/* 完了メッセージ */}
      {isCompleted && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl text-center z-50">
          <h2 className="text-green-500 mb-4 text-2xl font-bold">
            おめでとうございます！
          </h2>
          <p className="mb-2 text-gray-600">パズルを完成させました！</p>
          <p className="text-gray-600">
            手数: {moves} | 時間: {formatTime(time)}
          </p>
        </div>
      )}
    </div>
  );
};
