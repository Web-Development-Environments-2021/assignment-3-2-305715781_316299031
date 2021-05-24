var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teamsFavorite_utils")




/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM Admins")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});


//===============================================================Add game=============================================================
router.post("/addNewGame", async(req, res, next) => {
  try{
    // only the Representative of the Football Association can add game to a session 
    // check the current user is RoAF
    let isMainRoAF = false
    const RoafDB = await DButils.execQuery("SELECT user_id FROM dbo.Admins");
    if(RoafDB.find((x) => x.user_id === req.session.user_id)){
      isMainRoAF = true
    }
    if(!isMainRoAF){
      throw { status: 401, message: "Only RoAF can add a new game"}
   }   
    //session is allways the current one
    // dont need to check if the tema exsist it's a pre-condition
    const home_team_name = req.body.homeTeam;
    const away_team_name = req.body.awayTeam;
    const date = req.body.date;
    const location = req.body.location;
    const season = req.body.season;
    const league = req.body.league;
    const mainJudge = req.body.mainJudge;
    const judge1 = req.body.judge1;
    const judge2 = req.body.judge2;
    const judge3 = req.body.judge3

    //check the teams can play in this date
    const gameDB= await DButils.execQuery("SELECT * FROM dbo.Games");
    if (gameDB.find((x) =>     x.data === date  && x.localteam == home_team_name && x.vistoreteam == away_team_name))
      throw { status: 409, message: "The teams can't play on that date, it's taken" };

    // check the judges exsist
    let isMainJudge = false
    let isJudge1 = false
    let isJudge2 = false
    let isJudge3 = false

    const judgeDB = await DButils.execQuery("SELECT user_id FROM dbo.Judges");
    if(judgeDB.find((x) => x.name === mainJudge)){
      isMainJudge = true
    }
    if(!isMainJudge){
      throw { status: 401, message: "The mainJudge dost exsist"}
    }
    if(gameDB.find((x) => x.date === date && x.mainJudge === mainJudge)){
      throw { status: 409, message: "The mainJudge can't judge on that date" };
    }
    
    if(judgeDB.find((x) => x.name === judge1)){
      isJudge1 = true
    }
    if(!isJudge1){
      throw { status: 401, message: "Judge1 dost exsist"}
    }
    if(gameDB.find((x) => x.data === date && x.judge1 === judge1)){
      throw { status: 409, message: "Judge1 can't judge on that date" };

    }

    if(judgeDB.find((x) => x.name === judge2)){
      isJudge2 = true
    }
    if(!isJudge2){
      throw { status: 401, message: "Judge2 dost exsist"}
    }
    if(gameDB.find((x) => x.data === date && x.judge2 === judge2)){
      throw { status: 409, message: "Judge2 can't judge on that date" };

    }
    

    if(judgeDB.find((x) => x.name === judge3)){
      isJudge3=true
    }
    if(!isJudge3){
      throw { status: 401, message: "Judge3 dost exsist"}
    }
    if(gameDB.find((x) => x.data === date && x.judge3 === judge3)){
      throw { status: 409, message: "Judge3 can't judge on that date" };

    }

    // add the new game to Games table
    await DButils.execQuery(
      `INSERT INTO dbo.Games (localteam, vistoreteam,date, fild ,mainJudge,judge1,judge2,judge3) VALUES 
      ('${home_team_name}','${away_team_name}','${date}', '${location}','${mainJudge}','${judge1}','${judge2}','${judge3}')`
    );
  
    res.status(201).send("Game Added");

  }catch (error) {
    next(error);
  }
});



module.exports = router;
