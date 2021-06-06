var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const admin_utils = require("./utils/admins_utils");
const { param } = require("./auth");




/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  try{
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM Admins")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
        else {
          res.sendStatus(401);
             }
      })
    }
  else {
    res.sendStatus(401);
       }
  } catch (error) {
    next(error);
  }
});


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
    await admin_utils.addNewGame(req.body); 
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


module.exports = router;
