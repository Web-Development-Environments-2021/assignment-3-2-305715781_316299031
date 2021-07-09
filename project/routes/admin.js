var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const admin_utils = require("./utils/admins_utils");
const league_utils = require("./utils/league_utils");
const { param } = require("./auth");




/**
 * Authenticate all incoming requests by middleware
 */
// router.use(async function (req, res, next) {
//   try{
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id FROM Admins")
//       .then((users) => {
//         if (users.find((x) => x.user_id === req.session.user_id)) {
//           req.user_id = req.session.user_id;
//           next();
//         }
//         else {
//           res.sendStatus(401);
//              }
//       })
//     }
//   else {
//     res.sendStatus(401);
//        }
//   } catch (error) {
//     next(error);
//   }
// });


//===============================================================Add game=============================================================

/**
 * This path add new game to the game table
 */
router.post("/addNewGame", async(req, res, next) => {
  try{
    // only the Representative of the Football Association can add game to a session 
    // check the current user is RoAF
    let isMainRoAF = false
    const adminsDB = await DButils.execQuery("SELECT user_id FROM dbo.Admins");
    if(adminsDB.find((x) => x.user_id === req.session.user_id)){
      isMainRoAF = true
    }
    if(!isMainRoAF){
      throw { status: 401, message: "Only RoAF can add a new game"}
    }
	
	//check that league and season exist
    const season = req.body.season;
    const league = req.body.league_name;
    console.log(`league: ${league}, season: ${season}`);
    const league_id = await league_utils.validateSeasonLeague(season, league);
    if (league_id < 0){
      throw { status: 404, message: "League or Season Doesn't Exist in DB" };
    }
	
	//check number of referees
    const referees = await league_utils.getRefereesInSeasonLeague(league, season);
    if (referees.length < 2) {
      throw { status: 409, message: "Not Enough Referees!" };
    }
	
	//add the games for season in league automatically by current policy
    const games_added = await admin_utils.AddGames(season, league, league_id);
    //throws error if no games were added
    if (games_added == 0){
      throw { status: 409, message: "Not Enough Teams" };
    }
    if (games_added < 0){
      throw { status: 401, message: "Games Already Created" };
    }
	
	
    //await admin_utils.addNewGame(req.body); 
    res.status(201).send("Game Added");

  }catch (error) {
    next(error);
  }
});

//===============================================================Add game result=============================================================

/**
 * This path add to a game it's result in the game table
 */
router.post("/AddResult", async (req, res, next) =>
{
  let flag= false;
  try{
    // check if game exist in the DB 
    const games= await DButils.execQuery("SELECT game_id FROM Games")
    if (games.find((x) => x.game_id === req.body.game_id)) {
      flag=true;
    }
    if (flag ===false)
      throw { status: 409, message: "Game Not Exist" };
      
  await DButils.execQuery(
  `UPDATE dbo.Games SET localteam_score ='${req.body.localteam_score}',visitoreteam_score = '${req.body.visitoreteam_score}' WHERE game_id='${req.body.game_id}'`
  );
  res.status(200);
}
  catch (error) {
  next(error);
  }
});

//===============================================================Add game event=============================================================

/**
 * This path add to a game event in the game events table
 */
router.post("/eventSchedule", async (req, res, next) =>
{
  let flag= false;
  try{
    // check if game exist in the DB 
    const games= await DButils.execQuery("SELECT game_id FROM dbo.Games")
    if (games.find((x) => x.game_id === req.body.game_id)) {
      flag=true;
    }
    if (flag ===false)
      throw { status: 409, message: "Game Not Exist" };
    
    await DButils.execQuery(
      `INSERT INTO dbo.GameEvents (game_id ,date, minute ,description) VALUES  
      ('${req.body.game_id}','${req.body.date}','${req.body.minute}','${req.body.EventDescription}')`
      );
    res.status(200).send("event add");
  }
    catch (error) {
    next(error);
    }
});



router.get("/AdminCheck/:username",async(req,res) =>{
  try{
    const username = req.params.username
        const users= await DButils.execQuery("SELECT username FROM Admins")
              .then((users) => {
                if (users.find((x) => x.username === username)) {
                    res.status(200).send("You are admin")
                }})
}catch (error) {
  next(error);
}
});


router.post("/AdminAddGame",async(req,res) =>{
  try{
    await DButils.execQuery(
      `INSERT INTO dbo.Games (localteam, vistoreteam,fild,mainJudge,secondaryjudge,date) VALUES ('${req.body.localteam}', '${req.body.vistoreteam}','${req.body.fild}','${req.body.mainJudge}', '${req.body.secondaryjudge}','${req.body.date}')`
    );
    res.status(201).send("add game success");

}catch (error) {
}
});


module.exports = router;
