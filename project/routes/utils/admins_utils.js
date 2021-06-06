const axios = require("axios");
const DButils = require("./DButils");
const teams_utils = require("./teams_utils")
const players_utils = require("./players_utils")
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// param - newGameDetails - the new game details we want to add game table
// return - true/ error
async function addNewGame(newGameDetails) {
//session is allways the current one
    // dont need to check if the tema exsist it's a pre-condition
    console.log(newGameDetails)
    const localteam = newGameDetails.localteam;
    const visitorteam = newGameDetails.visitorteam;
    const date = newGameDetails.date;
    const fild = newGameDetails.fild;
    const mainJudge = newGameDetails.mainJudge;
    const secondaryjudge = newGameDetails.secondaryjudge;

    //check the teams can play in this date
    const gameDB= await DButils.execQuery(`SELECT * FROM dbo.Games where localteam='${localteam}' and vistoreteam='${visitorteam}'`);
    gameDB.map((info) =>
    {
      if(info["date"] === new Date(date))
      {
        throw { status: 409, message: "The teams can't play on that date, it's taken" };
      }
    });

    // add the new game to Games table
    await DButils.execQuery(
      `INSERT INTO dbo.Games (localteam, vistoreteam,date, fild ,mainJudge,secondaryjudge) VALUES 
      ('${localteam}','${visitorteam}','${date}', '${fild}','${mainJudge}','${secondaryjudge}')`
    );
    
    return true;
}

exports.addNewGame = addNewGame;