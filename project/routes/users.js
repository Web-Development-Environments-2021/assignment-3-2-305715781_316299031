var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils")
const game_utils = require ("./utils/game_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM Users")
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


//Middleware delet all old games from favorite game table of currenct user

router.use(async function (req, res, next) {
 try{
     const user_id = req.session.user_id;
      const games_ids= await DButils.execQuery(`SELECT game_id FROM FavoriteGames where user_id = '${user_id}'`)
      .catch((err) => next(err));
      for (let game_id of games_ids)
      {
        let game_details = await game_utils.getGameDetails(game_id.game_id);
        if(new Date(game_details.game_date) > new Date()){
              continue;
            
        }
        else{
            await DButils.execQuery(`DELETE FROM FavoriteGames WHERE user_id ='${req.session.user_id}' AND game_id='${game_id.game_id}'`)
          .catch((err) => next(err));
        }
      }
      next();
  } catch (error) {
    next(error);}
});
  
   

// -------------------------------------------------------- Favorite Player Functions-----------------------------------


/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const{player_id} = req.body;
    await users_utils.markPlayerAsFavorite(user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});




// -------------------------------------------------------- Favorite Team Functions-----------------------------------
/**
 * This path gets body with team_id and save this team in the favorites list of the logged-in user
 */
router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id = req.body.team_id;
    await users_utils.markTeamAsFavorite(user_id, team_id);
    res.status(201).send("The team successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites teams that were saved by the logged-in user
 */
router.get("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_ids = await users_utils.getFavoriteTeams(user_id);
    let team_ids_array = [];
    team_ids.map((element) => team_ids_array.push(element.team_id)); //extracting the teams id ids into array
    const results = await teams_utils.showFavoriteTeams(team_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});




// -------------------------------------------------------- Favorite Game Functions-----------------------------------

/**
 * This path gets body with game_id and save this game in the favorites list of the logged-in user
 */
router.post("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.game_id;
    await users_utils.markGameAsFavorite(user_id, game_id);
    res.status(201).send("The game successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites games that were saved by the logged-in user
 */
router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const games_ids = await users_utils.getFavoriteGames(user_id);
    if(games_ids.length === 0 ){
      throw { status: 409, message: "Iser Dosen't Have Favorite Future Games" };
    }
    let future_games_info_array = []
    for (let game_id of games_ids){
      //  let game_details = await game_utils.getGameDetails(game_id);
          let promises = game_utils.game_utils.getGameDetails(game_id);
          let game_details = Promise.all(promises);
        if(new Date(game_details.game_date) > new Date()){
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
