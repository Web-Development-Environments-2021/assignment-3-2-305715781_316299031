const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}

// --------------------------------------------------------get League games functions-----------------------------------

// param - None
// return - all the old games of the league
async function getOldLeagueGames(){
  let old_games_array = []
  const old_league_games = await DButils.execQuery(`SELECT * FROM dbo.Games`);
  old_league_games.map((info) => 
        {
            if(info["date"] <= new Date()){
                old_games_array.push(info);
            }
        }
    );
  return old_games_array;
}

// param - None
// return - all the future games of the league
async function getFutureLeagueGames(){
  let future_games_array = []
  const future_league_games = await DButils.execQuery(`SELECT * FROM dbo.Games `);
  future_league_games.map((info) => 
  {
      if(info["date"] > new Date()){
          future_games_array.push(info);
      }
  }
);
  return future_games_array;
}

// param - None
// return - the next games schedul in the league
async function getNextScheduleGame(){
  const future_league_games = await getFutureLeagueGames();
  let min_date = new Date();
  let first_date = false;
  let next_game_info;
  future_league_games.map((info) => 
  {
    if(first_date == false){
      min_date = info["date"];
      next_game_info = info;
      first_date = true;
    }
    else if(min_date >  info["date"]){
      min_date = info["date"];
      next_game_info = info;
    } 
  }
);
return next_game_info;
}
exports.getLeagueDetails = getLeagueDetails;
exports.getOldLeagueGames = getOldLeagueGames;
exports.getFutureLeagueGames = getFutureLeagueGames;
exports.getNextScheduleGame = getNextScheduleGame;