var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const game_utils = require ("./utils/game_utils");
const search_utils = require ("./utils/search_utils");
const users_utils = require("./utils/users_utils");
//----------------------------------------------------------Game functions----------------------------------

/**
 * This path returns the game details according to the game id
 */
router.get("/gameDetails/:game_id", async (req, res, next) => {
  let flag= false;
  try{
    // check if game exist in the DB 
    const games= await DButils.execQuery(`SELECT game_id FROM dbo.Games WHERE game_id = '${req.params.game_id}'`)
    if (games.length === 0) {
      throw { status: 409, message: "Game Not Exist" };   
     }
      
    
    const game_details = await game_utils.getGameDetails(req.params.game_id)
    res.status(200).send(game_details);
  } catch (error) {
    next(error);
  }
});

//return games Table
router.get("/gameTable", async (req, res, next) => {
  try{
  const games = await DButils.execQuery(`SELECT * FROM dbo.Games`)
 
  res.status(200).send(games);
}catch(error){
    next(error);
  }

});

//----------------------------------------------------------Teams function----------------------------------

/**
 * This path returns all the future games details of a team according to the team id
 */
router.get("/getTeamFutureGames/:team_id", async (req,res,next) => {
  // let flag = false;
  try{
    // check if game exist in the DB 
    await search_utils.searchTeamByID(req.params.team_id);
    //get team future games id by team id
    const future_games_id_array = await game_utils.extractTeamFutureGamesId(req.params.team_id)
    if(future_games_id_array.length === 0 ){
      throw { status: 409, message: "Team Dosen't Have Future Games" };
    }
    let future_games_info = []
    for (let game_id of future_games_id_array){
        let future_game_info = await game_utils.getGameDetails(game_id)
        future_games_info.push(future_game_info)
    }
    res.status(200).send(future_games_info);

  }catch(error){
    next(error);
  }
});



/**
 * This path returns all the old games details of a team according to the team id
 */
router.get("/getTeamOldeGames/:team_id", async (req,res,next) => {
  try{
    // check if game exist in the DB 
    await search_utils.searchTeamByID(req.params.team_id);
    //get team future games id by team id
    const old_games_id_array = await game_utils.extractTeamOldGamesId(req.params.team_id)
    if(old_games_id_array.length === 0 ){
      throw { status: 409, message: "Team Dosen't Have Old Games" };
    }
    let old_games_info = []
    for (let game_id of old_games_id_array){
        let old_game_info = await game_utils.getGameDetails(game_id)
        old_games_info.push(old_game_info)
    }
    res.status(200).send(old_games_info);

  }catch(error){
    next(error);
  }

});

//return  all games evnts
router.get("/allGamesEvents", async (req, res, next) => {
  try{
    const games_events =  await game_utils.getAllGamesEvents();
    if(games_events.length < 1){
      throw { status: 409, message: "There isn't games events" };
    }
 
  res.status(200).send(games_events);
  
  }catch(error){
    next(error);
  }
});

router.get("/favoriteGames/:user_name", async (req, res, next) => {
    try {
      let user_id = await DButils.execQuery(`SELECT user_id FROM dbo.Users where username='${req.params.user_name}'`);
      user_id = user_id[0].user_id
      const games_ids = await users_utils.getFavoriteGames(user_id);
      if(games_ids.length === 0 ){
        throw { status: 409, message: "Iser Dosen't Have Favorite Future Games" };
      }
      let future_games_info_array = []
      for (let game_id of games_ids){
        //  let game_details = await game_utils.getGameDetails(game_id);
            let game_details = await game_utils.getGameDetails(game_id);
            // let game_details = Promise.all(promises);
          if(new Date(game_details.date) > new Date()){
            future_games_info_array.push(game_details)
          }
      }
  
      if(future_games_info_array.length >3){
        res.send(future_games_info_array.slice(0,3));
      }
      res.status(201).send(future_games_info_array);
    } catch (error) {
      next(error);
    }
});
module.exports = router;
