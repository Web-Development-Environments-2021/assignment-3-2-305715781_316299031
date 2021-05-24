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

// add result to game
router.post("/AddResult", async (req, res, next) =>
{
  try{
    await DButils.execQuery(
    `INSERT INTO dbo.GameTable (localteam_score, visitoreteam_score) VALUES ('${req.body.localteam_score}', '${req.body.visitoreteam_score}')`
    );
    res.status(200).send("results added to the game");
  }
    catch (error) {
    next(error);
    }
});
