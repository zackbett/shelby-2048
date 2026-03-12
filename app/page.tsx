"use client"

import { useState, useEffect } from "react"

function createEmptyBoard() {
  return Array(4)
    .fill(null)
    .map(() => Array(4).fill(0))
}

function addRandomTile(board: number[][]) {
  const empty: [number, number][] = []

  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c])
    })
  )

  if (empty.length === 0) return board

  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  board[r][c] = Math.random() < 0.9 ? 2 : 4

  return [...board]
}
function slide(row: number[]) {
  const arr = row.filter((num) => num)
  const missing = 4 - arr.length
  const zeros = Array(missing).fill(0)
  return [...arr, ...zeros]
}

function combine(row: number[]) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2
      row[i + 1] = 0
    }
  }
  return row
}

export default function Home() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard())

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)
useEffect(() => {

  let newBoard = createEmptyBoard()
  newBoard = addRandomTile(newBoard)
  newBoard = addRandomTile(newBoard)

  setBoard(newBoard)

}, [])
  useEffect(() => {

  const handleKey = (e: any) => {

    if (e.key === "ArrowLeft") moveLeft()
    if (e.key === "ArrowRight") moveRight()
    if (e.key === "ArrowUp") moveUp()
    if (e.key === "ArrowDown") moveDown()

  }

  window.addEventListener("keydown", handleKey)

  return () => {
    window.removeEventListener("keydown", handleKey)
  }

}, [board])
const minSwipeDistance = 50

function handleTouchStart(e: any) {
  setTouchEnd(null)
  setTouchStart(e.targetTouches[0].clientX)
  setTouchStartY(e.targetTouches[0].clientY)
}

function handleTouchMove(e: any) {
  setTouchEnd(e.targetTouches[0].clientX)
  setTouchEndY(e.targetTouches[0].clientY)
}

function handleTouchEnd() {

  if (!touchStart || !touchEnd || !touchStartY || !touchEndY) return

  const distanceX = touchStart - touchEnd
  const distanceY = touchStartY - touchEndY

  const isLeft = distanceX > minSwipeDistance
  const isRight = distanceX < -minSwipeDistance
  const isUp = distanceY > minSwipeDistance
  const isDown = distanceY < -minSwipeDistance

  if (isLeft) moveLeft()
  if (isRight) moveRight()
  if (isUp) moveUp()
  if (isDown) moveDown()
}
function moveLeft() {

  let newBoard = board.map((row) => {

    let newRow = slide(row)
    newRow = combine(newRow)
    newRow = slide(newRow)

    return newRow
  })

  newBoard = addRandomTile(newBoard)

  setBoard(newBoard)
}

function moveRight() {

  let newBoard = board.map((row) => {

    let reversed = [...row].reverse()

    reversed = slide(reversed)
    reversed = combine(reversed)
    reversed = slide(reversed)

    return reversed.reverse()
  })

  newBoard = addRandomTile(newBoard)

  setBoard(newBoard)
}

function moveUp() {

  let newBoard = [...board]

  for (let col = 0; col < 4; col++) {

    let column = [
      newBoard[0][col],
      newBoard[1][col],
      newBoard[2][col],
      newBoard[3][col]
    ]

    column = slide(column)
    column = combine(column)
    column = slide(column)

    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = column[row]
    }
  }

  newBoard = addRandomTile(newBoard)

  setBoard([...newBoard])
}

function moveDown() {

  let newBoard = [...board]

  for (let col = 0; col < 4; col++) {

    let column = [
      newBoard[0][col],
      newBoard[1][col],
      newBoard[2][col],
      newBoard[3][col]
    ].reverse()

    column = slide(column)
    column = combine(column)
    column = slide(column)

    column = column.reverse()

    for (let row = 0; row < 4; row++) {
      newBoard[row][col] = column[row]
    }
  }

  newBoard = addRandomTile(newBoard)

  setBoard([...newBoard])
}
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white touch-none">

      <h1 className="text-4xl font-bold mb-6">Shelby 2048</h1>

      <div className="bg-neutral-900 p-4 rounded-xl">

        <div
          className="grid grid-cols-4 gap-2 w-[320px] h-[320px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
>

          {board.flat().map((num, i) => (
            <div
              key={i}
              className="bg-neutral-700 rounded flex items-center justify-center text-xl font-bold aspect-square"
            >
              {num !== 0 ? num : ""}
            </div>
          ))}

        </div>

      </div>

      <button
        className="mt-6 bg-white text-black px-4 py-2 rounded"
        onClick={() => {
          let newBoard = createEmptyBoard()
          newBoard = addRandomTile(newBoard)
          newBoard = addRandomTile(newBoard)
          setBoard(newBoard)
        }}
      >
        New Game
      </button>

    </main>
  )
}