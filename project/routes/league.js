var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});
// --------------------------------------------------------get League games functions-----------------------------------

/**
 * This path get all the old games of the league
 */
router.get("/getLeagueOldGames", async (req, res, next) => {
  try {
    const league_old_games = await league_utils.getOldLeagueGames();
    if(league_old_games < 1){
      res.send("There is no old games in the league");
    }
    res.send(league_old_games);
  } catch (error) {
    next(error);
  }
});

/**
 * This path get all the future games of the league
 */
router.get("/getLeagueFutureGames", async (req, res, next) => {
  try {
    const league_future_games = await league_utils.getFutureLeagueGames();
    if(league_future_games < 1){
      res.status(200).send("There is no future games in the league");
    }
    res.send(league_future_games);
  } catch (error) {
    next(error);
  }
});


/**
 * This path get the next games in the league
 */
router.get("/getNextScheduleGame", async (req, res, next) => {
  try {
    const league_next_game = await league_utils.getNextScheduleGame();
    if(league_next_game < 1){
      res.send("There is no future games in the league");
    }
    res.send(league_next_game);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
