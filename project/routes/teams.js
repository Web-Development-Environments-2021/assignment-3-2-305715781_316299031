var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");


/**
 * This path returns team details of according to the team id
 */
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});



router.get("/teamFromLeague", async(req,res,next) => {
  let team_names = [] ;
  try {
        const teamsID = await axios.get(`${api_domain}/teams/season/${SEASON_ID}` , {
            params: {
                api_token: process.env.api_token,
            },
        });
        teamsID.data.data.map((teamDetails) =>
        team_names.push(teamDetails.name)
        );
        res.send(team_names);
      }
     catch (error) {
      next(error);
    }
});

module.exports = router;
