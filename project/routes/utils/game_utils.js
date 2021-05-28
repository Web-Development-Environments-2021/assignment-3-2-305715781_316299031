const { get } = require("../game");
const DButils = require("./DButils");
const search_utils = require ("./search_utils");

// -------------------------------------------------------- Game event log-----------------------------------

// param - game_id - the game we want to get it's event log
// return - game event log
async function getGameEvents(game_id){
    const game_events = await DButils.execQuery(`SELECT * FROM dbo.GameEvents WHERE game_id='${game_id}'`);
    let game_events_array = []
    game_events.map((event) => {
        game_events_array.push(event);
        });
    return game_events_array;
    // const {game_id,date,minute,description} = game_events;
    // return{
    //     game_id:game_id,
    //     date:date,
    //     minute:minute,
    //     description: description,
    // };
}

// --------------------------------------------------------Game Details-----------------------------------

// param - game_id - the game we want to get it's details
// return - game details
async function getGameDetails(game_id){
    // dont need to check if the game exsist 'gameDetails/:game_id" check it.
    const game_details =  await DButils.execQuery(`SELECT * FROM dbo.Games WHERE game_id='${game_id}'`);
    const {localteam, vistoreteam, date, fild, mainJudge, judge1, judge2, judge3,localteam_score,visitoreteam_score} = game_details[0];
    // check if this is an old game
    if(new Date(date) < new Date()){
        const game_events = await getGameEvents(game_id);
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
            game_events : game_events
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
    };
  }


// param - team_id - the team we want to get it's future game ids 
// return - future game ids array
async function extractTeamFutureGamesId(team_id){
    //get team name by id
    let team_name = await search_utils.searchTeamByID(team_id);
    //get team future game ids
    let future_games_id_array = [];
    let games_info = await DButils.execQuery(`SELECT game_id,localteam,vistoreteam,date FROM Games`)
    games_info.map((info) => 
        {
            if((info["localteam"] == team_name || info["vistoreteam"] == team_name) && info["date"] > new Date()){
                let game_id = info["game_id"];
                future_games_id_array.push(game_id);
            }
        }
    );
    return future_games_id_array;
}


// param - team_id - the team we want to get it's old game ids 
// return - old game ids array
async function extractTeamOldGamesId(team_id){
    //get team name by id
    let team_name = await search_utils.searchTeamByID(team_id);
    //get team future game ids
    let old_games_id_array = [];
    games_info = await DButils.execQuery(`SELECT game_id,localteam,vistoreteam,date FROM Games`)
    games_info.map((info) => 
        {
            if((info["localteam"] == team_name || info["vistoreteam"] == team_name) && info["date"] <= new Date()){
                let game_id = info["game_id"];
                old_games_id_array.push(game_id);
            }
        }
    );
    return old_games_id_array;
}





exports.getGameEvent = getGameEvents
exports.getGameDetails = getGameDetails
exports.extractTeamFutureGamesId = extractTeamFutureGamesId
exports.extractTeamOldGamesId = extractTeamOldGamesId
