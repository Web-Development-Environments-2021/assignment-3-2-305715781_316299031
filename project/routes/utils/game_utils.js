const { get } = require("../game");
const axios = require("axios");
const DButils = require("./DButils");
const search_utils = require ("./search_utils");
const league_utils = require("./league_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const SEASON_ID = 18334;


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
}

// return - all games event log
async function getAllGamesEvents(){
    const game_events = await DButils.execQuery(`SELECT * FROM dbo.GameEvents`);
    let game_events_array = []
    game_events.map((event) => {
        game_events_array.push(event);
        });
    return game_events_array;
}

// --------------------------------------------------------Game Details-----------------------------------

// param - game_id - the game we want to get it's details
// return - game details
async function getGameDetails(game_id){
    // dont need to check if the game exsist 'gameDetails/:game_id" check it.
    const game_details =  await DButils.execQuery(`SELECT * FROM dbo.Games WHERE game_id='${game_id}'`);
    const {localteam, vistoreteam, date, fild, mainJudge, secondaryjudge, localteam_score,visitoreteam_score} = game_details[0];
    // check if this is an old game
    const id= game_id;
    if(new Date(date) < new Date()){
        const game_events = await getGameEvents(game_id);
        return{
            id: id,
            localteam: localteam,
            vistoreteam: vistoreteam,
            date : date,
            fild : fild,
            mainJudge :mainJudge,
            secondaryjudge : secondaryjudge,  
            localteam_score : localteam_score,
            visitoreteam_score: visitoreteam_score,
            game_events : game_events
        };
    }
    // else the game is in the fueter
    return{
        id:id,
        localteam: localteam,
        vistoreteam: vistoreteam,
        date : date,
        fild : fild,
        mainJudge :mainJudge,
        secondaryjudge : secondaryjudge,         
    };
  }


// param - team_id - the team we want to get it's future game ids 
// return - future game ids array
async function extractTeamFutureGamesId(team_id){
    //get team name by id
    let team_name = await search_utils.searchTeamByID(team_id);
    //get team future game ids
    let future_games_id_array = [];
    let games_info = await DButils.execQuery(`SELECT game_id,localteam,vistoreteam,date FROM dbo.Games`)
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
    games_info = await DButils.execQuery(`SELECT game_id,localteam,vistoreteam,date FROM dbo.Games`)
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

// param - season(2021/2022),league name(Superliga)
// return - games
async function getAllGames(season, league) {
  const games = await DButils.execQuery(
    `SELECT * FROM dbo.Games where league='${league}' and season='${season}'`
  );
  return games;
}

// --------------------------------------------------------Add Games-----------------------------------
async function addGamesByPolicy(season, league, league_id){
    // Get All league team names
	const all_teams = await axios.get(`${api_domain}/teams/season/${SEASON_ID}`,
    {
        params: {
          include: "country",
          api_token: process.env.api_token,
        },
      }
    );
    if (all_teams.data.length < 2){
        return 0;
    }

    //check referees
    const referees = await league_utils.getRefereesInSeasonLeague(league, season);
    if (referees.length < 2) {
        return -1;
    }

    let initial_date = new Date();
    initial_date.setDate(initial_date.getDate() + 7);
    let games_added = 0;

    // Appending all possible games
    let array_games = [];
    for (let i = 0; i < all_teams.data.data.length; i++) {
        for (let j = i + 1; j < all_teams.data.data.length; j++) {
        array_games.push([all_teams.data.data[i], all_teams.data.data[j]]);
        }
    }

    // Shuffling games
    array_games.sort(() => Math.random() - 0.5);
    for (let i = 0; i < array_games.length; i++) {
        //randomize home\away
        let rand_home = Math.floor(Math.random() * 2);
        let home_team = array_games[i][0].name;
        let away_team = array_games[i][1].name;

        //get location of the game - home team field
		let location =array_games[i][0].country.data.name+" Stadium";
        
        //add the game to DB
        await DButils.execQuery(
        `INSERT INTO dbo.Games (season, league, localteam, vistoreteam, date, fild, mainJudge, secondaryjudge) VALUES
                ('${season}','${league}','${home_team}','${away_team}','${initial_date
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")}', '${location}','${
            referees[0].name
        }','${referees[1].name}')`
        );
        games_added++;

        //increment date
        initial_date.setDate(initial_date.getDate() + 7);

  }

  return games_added;

}




exports.getGameEvent = getGameEvents;
exports.getGameDetails = getGameDetails;
exports.extractTeamFutureGamesId = extractTeamFutureGamesId;
exports.extractTeamOldGamesId = extractTeamOldGamesId;
exports.getAllGames=getAllGames;
exports.addGamesByPolicy=addGamesByPolicy;
exports.getAllGamesEvents = getAllGamesEvents
