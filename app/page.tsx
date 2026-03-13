"use client"

import { useState, useEffect, useRef } from "react"
import Leaderboard from "../components/Leaderboard"
import { saveScore } from "@/lib/shelby"
type Player = {
  username: string
  score: number
}
const themes = {
  mode1: {
    page: "bg-[#5b1f2b]",
    pageColor: "#5b1f2b",
    board: "bg-[#e6b39a]",
    text: "text-[#ffb199]",
    pattern: "pattern-mode1",

    container: "#f5e0c8",
    border: "#c97b63",

    scoreLabel: "#5b1f2b",
    scoreValue: "#c76b39"
  },

  mode2: {
    page: "bg-[#ffd6e7]",
    pageColor: "#ffd6e7",
    board: "bg-[#e46aa9]",
    text: "text-[#3b1f3a]",
    pattern: "pattern-mode2",

    container: "#e46aa9",
    border: "#ff8ec6",

    scoreLabel: "#6b1b3a",
    scoreValue: "#ff2f92"
  },

  mode3: {
    page: "bg-[#4b0f63]",
    pageColor: "#4b0f63",
    board: "bg-[#cfa6f4]",
    text: "text-[#fdf1ff]",
    pattern: "pattern-mode3",

    container: "#f3e5ff",
    border: "#9a6bff",

    scoreLabel: "#4b0f63",
    scoreValue: "#7a5cff"
  }
}

function createEmptyBoard() {
  return Array(4).fill(null).map(() => Array(4).fill(0))
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

function combine(
  row: number[],
  addScore: (v: number) => void,
  playMerge: () => void
) {

  for (let i = 0; i < 3; i++) {

    if (row[i] !== 0 && row[i] === row[i + 1]) {

      row[i] *= 2
      row[i + 1] = 0

      addScore(row[i])
      playMerge()


}

  }

  return row
}

export default function Home() {

  const playMerge = () => {
  if (mergeSoundRef.current) {
    mergeSoundRef.current.currentTime = 0
    mergeSoundRef.current.play().catch(() => {})
  }
}

  const [board, setBoard] = useState<number[][]>(createEmptyBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<Player[]>([
  { username: "majyy", score: 4096 },
  { username: "teye", score: 2048 },
  { username: "sukiman", score: 1024 }
])
function submitScore(username: string, score: number) {

  const updated: Player[] = [...leaderboard]

  updated.push({
    username,
    score
  })

  updated.sort((a,b)=> b.score - a.score)

  const top10 = updated.slice(0,10)

  setLeaderboard(top10)

}
  const [gameOver, setGameOver] = useState(false)
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const mergeSoundRef = useRef<HTMLAudioElement | null>(null)

  const [soundOn, setSoundOn] = useState(true)
  const [showWinPopup, setShowWinPopup] = useState(false)
  const [hasReached2048, setHasReached2048] = useState(false)

  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [username, setUsername] = useState("")

  const [theme, setTheme] = useState<"mode1" | "mode2" | "mode3">("mode1")

  const currentTheme = themes[theme]

  useEffect(() => {

    let newBoard = createEmptyBoard()

    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)

    setBoard(newBoard)

    const saved = localStorage.getItem("bestScore")

    if (saved) setBestScore(parseInt(saved))

  }, [])

  useEffect(() => {

    if (score > bestScore) {

      setBestScore(score)
      localStorage.setItem("bestScore", score.toString())

    }

  }, [score])

  useEffect(() => {

if(soundOn && mergeSoundRef.current){

mergeSoundRef.current.currentTime = 0
mergeSoundRef.current.play().catch(() => {})

}

}, [score])

  useEffect(() => {

  const audio = bgMusicRef.current
  if(!audio) return

  if(soundOn){
    audio.play().catch(() => {})
  }else{
    audio.pause()
  }

}, [soundOn])

  useEffect(() => {

    const handleKey = (e: KeyboardEvent) => {

  if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
    e.preventDefault()
  }

  if (e.key === "ArrowLeft") moveLeft()
  if (e.key === "ArrowRight") moveRight()
  if (e.key === "ArrowUp") moveUp()
  if (e.key === "ArrowDown") moveDown()
}

    window.addEventListener("keydown", handleKey)

    return () => window.removeEventListener("keydown", handleKey)

  }, [board])

  function addScore(v: number) {
    setScore((p) => p + v)
  }

  function checkGameOver(board: number[][]) {

    for (let r = 0; r < 4; r++) {

      for (let c = 0; c < 4; c++) {

        if (board[r][c] === 0) return false

        if (c < 3 && board[r][c] === board[r][c + 1]) return false

        if (r < 3 && board[r][c] === board[r + 1][c]) return false

      }

    }

    return true

  }

function getTileColor(num: number) {

  if (num === 0) return "bg-black/70"

  if (theme === "mode1") {

    const colors:any = {

      2: "bg-[#fff4e6]",
      4: "bg-[#ffe0cc]",
      8: "bg-[#ffc299]",
      16: "bg-[#ffa366]",
      32: "bg-[#ff704d]",
      64: "bg-[#ff4d4d]"

    }

    return colors[num] || "bg-[#ffcc66]"

  }

  if (theme === "mode2") {

    const colors:any = {

      2: "bg-[#fff0f5]",
      4: "bg-[#ffd1dc]",
      8: "bg-[#ffb3c6]",
      16: "bg-[#ff94b7]",
      32: "bg-[#ff75a8]",
      64: "bg-[#ff5799]"

    }

    return colors[num] || "bg-[#ffb347]"

  }

  if (theme === "mode3") {

    const colors:any = {

      2: "bg-[#f3e8ff]",
      4: "bg-[#e9d5ff]",
      8: "bg-[#d8b4fe]",
      16: "bg-[#c084fc]",
      32: "bg-[#a855f7]",
      64: "bg-[#9333ea]"

    }

    return colors[num] || "bg-[#7c3aed]"

  }

}

function handleTouchStart(e:any){

  e.preventDefault()
  setTouchStart(e.touches[0].clientX)
  setTouchStartY(e.touches[0].clientY)

}

function handleTouchMove(e:any){

  e.preventDefault()
  setTouchEnd(e.touches[0].clientX)
  setTouchEndY(e.touches[0].clientY)

}

function handleTouchEnd(){

  if(!touchStart || !touchEnd || !touchStartY || !touchEndY) return

  const dx = touchStart - touchEnd
  const dy = touchStartY - touchEndY

  if(Math.abs(dx) > Math.abs(dy)){

    if(dx > 30) moveLeft()
    else moveRight()

  }else{

    if(dy > 30) moveUp()
    else moveDown()

  }

}

const [touchStart,setTouchStart] = useState<number | null>(null)
const [touchEnd,setTouchEnd] = useState<number | null>(null)

const [touchStartY,setTouchStartY] = useState<number | null>(null)
const [touchEndY,setTouchEndY] = useState<number | null>(null)

function moveLeft() {

  let newBoard = board.map((row) => {

    let newRow = slide(row)
    newRow = combine(row, addScore, playMerge)
    newRow = slide(newRow)

    return newRow

  })

  newBoard = addRandomTile(newBoard)

  setBoard(newBoard)

  if (checkGameOver(newBoard)) setGameOver(true)

}

function moveRight() {

  let newBoard = board.map((row) => {

    let reversed = [...row].reverse()

    reversed = slide(reversed)
    reversed = combine(reversed, addScore, playMerge)
    reversed = slide(reversed)

    return reversed.reverse()

  })

  newBoard = addRandomTile(newBoard)

  setBoard(newBoard)

  if (checkGameOver(newBoard)) setGameOver(true)

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
    column = combine(column, addScore, playMerge)
    column = slide(column)

    for (let row = 0; row < 4; row++) newBoard[row][col] = column[row]

  }

  newBoard = addRandomTile(newBoard)

  setBoard([...newBoard])
  
  const reached2048 = newBoard.some(row =>
  row.some(tile => tile === 2048)
)

if (reached2048 && !hasReached2048) {
  setHasReached2048(true)
  setShowWinPopup(true)
}

  if (checkGameOver(newBoard)) setGameOver(true)

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
    column = combine(column, addScore, playMerge)
    column = slide(column)

    column = column.reverse()

    for (let row = 0; row < 4; row++) newBoard[row][col] = column[row]

  }

  newBoard = addRandomTile(newBoard)

  setBoard([...newBoard])

  if (checkGameOver(newBoard)) setGameOver(true)

}

return (

<main
  className={`relative flex min-h-screen flex-col items-center justify-center pt-8 ${currentTheme.page} ${currentTheme.text}`}
>
  <div
className="absolute top-3 right-3 md:top-6 md:right-6 cursor-pointer z-50"
onClick={() => setSoundOn(!soundOn)}
>

<div className="relative w-10 h-10">

<img
src="/assets/icons/speaker.png"
className="w-10"
/>

{!soundOn && (

<div className="absolute inset-0 flex items-center justify-center">

<div className="w-8 h-[2px] bg-black rotate-45"></div>

</div>

)}

</div>

</div>
  <audio
ref={bgMusicRef}
src="/assets/sounds/bg-music.mp3"
loop
/>
<audio
  ref={mergeSoundRef}
  src="/assets/sounds/tile-merge.mp3"
  preload="auto"
/>

  {showWinPopup && (

<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

  <div className="bg-[#f5e1c8] p-6 rounded-xl text-center shadow-2xl w-[300px]">

    <h2 className="text-2xl font-bold mb-2 text-[#5b1f2b]">
      GGs Goat 🐐
    </h2>

    <p className="mb-6 text-[#5b1f2b]">
      You reached 2048!
    </p>

    <div className="flex flex-col gap-3">

      <button
        className="bg-[#5b1f2b] text-white py-2 rounded-lg shadow-md hover:scale-105 transition"
        onClick={() => setShowWinPopup(false)}
      >
        Continue
      </button>

      <button
        className="bg-[#e6b3a9] text-[#5b1f2b] py-2 rounded-lg shadow-md hover:scale-105 transition"
        onClick={() => {
          setShowWinPopup(false)
          setShowUsernameInput(true)
        }}
      >
        Submit, bye.
      </button>

    </div>

  </div>

</div>

)}
<div className="absolute inset-0 pointer-events-none opacity-10 flex flex-wrap items-center justify-center gap-24">
  <div className={`shelby-pattern ${currentTheme.pattern}`} />
</div>
  <div className="flex gap-2 mb-4">

<button
onClick={()=>setTheme("mode1")}
className="w-5 h-5 bg-[#3b0f19] shadow-md active:translate-y-[2px]"
/>

<button
onClick={()=>setTheme("mode2")}
className="w-5 h-5 bg-[#e46aa9] shadow-md active:translate-y-[2px]"
/>

<button
onClick={()=>setTheme("mode3")}
className="w-5 h-5 bg-[#7c3aed] shadow-md active:translate-y-[2px]"
/>

</div>
<div
className="px-12 py-4 rounded-2xl border-4 shadow-[0_8px_20px_rgba(0,0,0,0.25)] mb-5"
style={{
background: currentTheme.container,
borderColor: currentTheme.border
}}
>

<h1
className="text-4xl font-extrabold text-center tracking-wide"
style={{ color: currentTheme.pageColor }}
>
Shelby 2048
</h1>

</div>


<div
className="flex items-center justify-center gap-8 mb-6 px-8 py-4 rounded-lg border-4 shadow-md"
style={{
background: currentTheme.container,
borderColor: currentTheme.border
}}
>

<div className="flex flex-col items-center">

<span
className="text-sm font-extrabold"
style={{ color: currentTheme.scoreLabel }}
>
Score
</span>

<span
className="text-2xl font-extrabold"
style={{ color: currentTheme.scoreValue }}
>
{score}
</span>

</div>

<div
className="w-[3px] h-10 shadow-inner"
style={{ background: currentTheme.border }}
></div>

<div className="flex flex-col items-center">

<span
className="text-sm font-extrabold"
style={{ color: currentTheme.scoreLabel }}
>
Best
</span>

<span
className="text-2xl font-extrabold"
style={{ color: currentTheme.scoreValue }}
>
{bestScore}
</span>

</div>

</div>
<div className={`${currentTheme.board} p-3 rounded-xl shadow-2xl shadow-md`}>

<div
className="grid grid-cols-4 gap-2 w-[320px] h-[320px] touch-none select-none"
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
>

{board.flat().map((num,i)=>(

<div
key={i}
className={`flex items-center justify-center aspect-square rounded-lg text-black text-2xl font-black tracking-tight drop-shadow shadow-inner transition-all duration-150 ${getTileColor(num)}`}
>

{num !== 0 ? num : ""}

</div>

))}

</div>

</div>

<button
className={`mt-6 px-6 py-2 rounded-lg font-bold shadow-lg ${currentTheme.board}`}
style={{color:"black"}}
onClick={()=>{

let newBoard = createEmptyBoard()

newBoard = addRandomTile(newBoard)
newBoard = addRandomTile(newBoard)

setBoard(newBoard)
setScore(0)
setGameOver(false)

}}
>
New Game
</button>
<Leaderboard data={leaderboard} />
{gameOver && (

<div className="fixed inset-0 flex items-center justify-center bg-black/70">

<div className={`${currentTheme.board} p-8 rounded-xl text-center shadow-2xl`}>

<h2 className="text-3xl font-bold text-black mb-4">
Game Over
</h2>

<p className="mb-4 text-black">
Score: {score}
</p>

<div className="flex gap-4 justify-center">

<button
className="bg-black text-white px-4 py-2 rounded-lg"
onClick={()=>{

let newBoard = createEmptyBoard()

newBoard = addRandomTile(newBoard)
newBoard = addRandomTile(newBoard)

setBoard(newBoard)
setScore(0)
setGameOver(false)

setUsername("")
setShowUsernameInput(false)

}}

>
Start Over
</button>

<button
className="bg-black text-white px-4 py-2 rounded-lg"
onClick={() => {
setGameOver(false)
setUsername("")
setShowUsernameInput(true)}
}
>
Submit anw
</button>

</div>

</div>

</div>

)}
{showUsernameInput && (

  <div className="fixed inset-0 flex items-center justify-center bg-black/60">

    <div className="
    bg-[#9EF7B8]
    p-6
    rounded-xl
    text-center
    shadow-2xl
    animate-[popup_0.3s_ease-out]
   ">

      <h2 className="text-xl font-bold mb-4 text-[#3b1f1a]">
        Enter Username
      </h2>

      <input
  value={username}
  onChange={(e)=>setUsername(e.target.value)}
  placeholder="X name"
  className="
  w-full
  bg-white
  border border-gray-300
  rounded-xl
  px-4 py-2
  text-black
  shadow-inner
  focus:outline-none
  focus:ring-2 focus:ring-green-400
  transition
  "
      />

      

      <button
        className="mt-4 bg-[#1f7a5a] text-white px-4 py-2 rounded-lg font-bold shadow-md"
        onClick={() => {

          if(!username) return

          submitScore(username, score)

          // reset board
    let newBoard = createEmptyBoard()

    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)

    setBoard(newBoard)
    setScore(0)
    setGameOver(false)


          setUsername("")
          setShowUsernameInput(false)

        }}
      >
        Submit
      </button>

    </div>

  </div>

)}
</main>

)

}