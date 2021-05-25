var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/gameDetails", async (req, res, next) => {
  try {
    const game_details =  await DButils.execQuery("SELECT * FROM dbo.Games");
    if(game_details.find((x) => x.game_id === req.body.game_id)){
        const {localteam, vistoreteam, date, fild, mainJudge, judge1, judge2, judge3,localteam_score,visitoreteam_score} = x;
        // check if this is an old game
        if(new Date(date) < new Date()){
            const game_events = await DButils.execQuery(`SELECT * FROM dbo.GameEvents WHERE gane_id=='${req.body.game_id}'`);
            const {game_id,date,minute,description} = game_events;
            return{
                local_team: localteam,
                vistore_team: vistoreteam,
                game_date : date,
                location : fild,
                main_judge :mainJudge,
                judge_1 : judge1,
                judge_2 : judge2,
                judge_3 : judge3,
                local_team_score : localteam_score,
                visitore_team_score: visitoreteam_score,
                game_id: game_id,
                date:date,
                min:minute,
                event:description,
            };
        }
        // else the game is in the fueter
        return{
            local_team: localteam,
            vistore_team: vistoreteam,
            game_date : date,
            location : fild,
            main_judge :mainJudge,
            judge_1 : judge1,
            judge_2 : judge2,
            judge_3 : judge3,            
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;