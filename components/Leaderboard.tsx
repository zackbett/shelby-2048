type Player = {
  username: string
  score: number
}

export default function Leaderboard({ data }: { data: Player[] }) {

  return (
    <div className="mt-8 w-[320px]">

      {/* title */}
      <div className="flex items-center justify-center gap-2 mb-3">

        <img
          src="/assets/icons/trophy.png"
          className="w-5 h-5"
        />

        <h2 className="text-lg font-bold">
          Leaderboard
        </h2>

        <img
          src="/assets/icons/trophy.png"
          className="w-5 h-5"
        />

      </div>


      {data.map((player, i) => {

        let icon = ""

        if (i === 0) icon = "/assets/icons/rank-1.png"
        if (i === 1) icon = "/assets/icons/rank-2.png"
        if (i === 2) icon = "/assets/icons/rank-3.png"

        return (

          <div
            key={i}
            className="flex items-center justify-between px-3 py-2 bg-white/40 rounded-md mb-2"
          >

            <div className="flex items-center gap-2">

              {i < 3 && (
                <img
                  src={icon}
                  className="w-5 h-5"
                />
              )}

              <span>
                {player.username}
              </span>

            </div>

            <span>
              {player.score}
            </span>

          </div>

        )
      })}

    </div>
  )
}