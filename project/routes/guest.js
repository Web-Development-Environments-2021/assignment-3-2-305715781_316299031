var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teamsFavorite_utils");
const search_utils = require("./utils/search_utils");


router.get("/Search/team/:searchname", async (req, res, next) => {
    let team_details = [];
    try {
      const teams_by_name = await search_utils.searchTeamByName(
        req.params.searchname 
      );
      //we should keep implementing team page.....
      res.send(teams_by_name);
    } catch (error) {
      next(error);
    }
  });

//===================================================search for player========================================

  router.get("/Search/player/:searchname", async (req, res, next) => {
    let team_details = [];
    try {
      const player_by_name = await search_utils.searchPlayerByName(
        req.params.searchname 
      );
      //we should keep implementing team page.....
      res.send(player_by_name);
    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;
  