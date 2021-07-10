const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const game_utils = require("./game_utils");

async function getLeagueDetails() {
  let league, stage;
  league = await axios.get(
    `${api_domain}/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  if(league.data.data.current_stage_id != null){
  stage = await axios.get(
    `${api_domain}/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
    stage = stage.data.data.name;
}
  else{
    stage = null;
  }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage,
    // next game details should come from DB
  };
}

// --------------------------------------------------------get League games functions-----------------------------------

// param - None
// return - all the old games of the league
async function getOldLeagueGames(){
  let old_games_array = []
  const old_league_games = await DButils.execQuery(`SELECT * FROM dbo.Games`);
  // let ids=[]
  // old_league_games.map((info) => 
  //       {
  //           if(info["date"] <= new Date()){
  //             ids.push(info["game_id"]);
  //           }
  //       }
  //   );
  // console.log("idssssssssss: " ,ids)
  // let gameEvents = DButils.execQuery(`SELECT * FROM dbo.GameEvents where game_id ='${ids}'`);
  // gameEvents = await Promise.all(gameEvents);
  old_league_games.map((info) => 
        {
            if(info["date"] <= new Date()){
              // gameEvents = Promise.all(gameEvents);
              // console.log(info)
              // let toAdd = info
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

// --------------------------------------------------------season in leagues functions-----------------------------------

// param - season(2021/2022) , league name(Superliga)
// return - league_id
async function validateSeasonLeague(season, league) {
  // CHECKS IF LEAGUE NAME EXISTS
  const LeagueExist = await axios.get(`${api_domain}/leagues/search/${league}`,{
    params: {
      api_token: process.env.api_token,
    },
  });
  if (LeagueExist.data.length < 1) {
    return -1;
  }
  let league_id = LeagueExist.data.data[0].id;

  //check season
  const SeasonExist = await axios.get(`${api_domain}/seasons/${season}`,
  {
    params: {
      api_token: process.env.api_token,
    },
  });
  if (SeasonExist.data.length < 1) {
    return -1;
  }
  return league_id;
}

// param - league name(Superliga),season(2021/2022)
// return - referees
async function getRefereesInSeasonLeague(league, season){
  const referees = await DButils.execQuery(
      `SELECT name FROM dbo.Judges where league='${league}' and season='${season}'`
  );
  return referees;
}


exports.getLeagueDetails = getLeagueDetails;
exports.getOldLeagueGames = getOldLeagueGames;
exports.getFutureLeagueGames = getFutureLeagueGames;
exports.getNextScheduleGame = getNextScheduleGame;
exports.validateSeasonLeague=validateSeasonLeague;
exports.getRefereesInSeasonLeague = getRefereesInSeasonLeague;
