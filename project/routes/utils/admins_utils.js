const axios = require("axios");
const DButils = require("./DButils");
const teams_utils = require("./teams_utils")
const players_utils = require("./players_utils")
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const game_utils = require("./game_utils");

// param - newGameDetails - the new game details we want to add game table
// return - true/ error
async function AddGames(season, league, league_id) {
  // CHECKS IF GAMES ALREADY CREATED for this season in league
  const games = await game_utils.getAllGames(season, league);
  if (games.length > 0) {
    return -1;
  }

  //Add games by policy
  const result = await game_utils.addGamesByPolicy(season, league, league_id);
  return result;
}

async function verifyRoFA(user_id) {
  let isMainRoAF = false;
  const RoafDB = await DButils.execQuery(
    "SELECT user_id FROM dbo.sadna_roles WHERE role = 'RoFA'"
  );
  if (RoafDB.find((x) => x.user_id == user_id)) {
    isMainRoAF = true;
  }
  return isMainRoAF;
}
//async function addNewGame(newGameDetails) {
//session is allways the current one
    // dont need to check if the tema exsist it's a pre-condition
    //console.log(newGameDetails)
    //const localteam = newGameDetails.localteam;
    //const visitorteam = newGameDetails.visitorteam;
    //const date = newGameDetails.date;
    //const fild = newGameDetails.fild;
    //const mainJudge = newGameDetails.mainJudge;
    //const secondaryjudge = newGameDetails.secondaryjudge;

    //check the teams can play in this date
    //const gameDB= await DButils.execQuery(`SELECT * FROM dbo.Games where localteam='${localteam}' and vistoreteam='${visitorteam}'`);
    //gameDB.map((info) =>
    //{
    //  if(info["date"] === new Date(date))
    //  {
    //    throw { status: 409, message: "The teams can't play on that date, it's taken" };
    //  }
    //});

    // add the new game to Games table
    //await DButils.execQuery(
    //  `INSERT INTO dbo.Games (localteam, vistoreteam,date, fild ,mainJudge,secondaryjudge) VALUES 
    //  ('${localteam}','${visitorteam}','${date}', '${fild}','${mainJudge}','${secondaryjudge}')`
    //);
    
    //return true;
//}

// exports.addNewGame = addNewGame;
exports.AddGames=AddGames;