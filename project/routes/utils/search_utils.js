const axios = require("axios");
const teams_utils = require("./teamsFavorite_utils")
const players_utils = require("./players_utils")

const { param } = require("../users");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const SEASON_ID = 17328;
//-------------------------------Search Funtions For Team by name------------------------------------

// return all teams in the current season = 17328 => in  Superlegue
async function getTeamsBySeason(SEASON_ID){
let teams_id_array= [];
const teamsID = await axios.get(`${api_domain}/teams/season/${SEASON_ID}` , {
    params: {
        api_token: process.env.api_token,
    },
});
teamsID.data.data.map((teamDetails) =>
    teams_id_array.push(teamDetails.id)
);
return teams_id_array;
}


//return all teams that theire names include search_name

async function extractRelevantTeamName(teams_id_array, search_name){
    let teams_info = [];
    let relavent_teams_by_name=[];
    teams_info =await teams_utils.showFavoriteTeams(teams_id_array);
    teams_info.map((info) => 
        {
            if(info["name"].startsWith(search_name,0)){
                    relavent_teams_by_name.push(info);
            }
         }
    );
    return relavent_teams_by_name;
}

// param - searchname - the value we are looking by him
// return - all theams that start with this value

async function searchTeamByName(search_name){
    let teams_id_array = await getTeamsBySeason(SEASON_ID);
    let teams_found = extractRelevantTeamName(teams_id_array, search_name)
    return teams_found;
}

exports.searchTeamByName = searchTeamByName;




//-----------------------------Functions Search Player-------------------------------------------------------------

// return all players start with the name and they are in the league

async function getPlayers(search_name){
    let players;
    players = await axios.get(`${api_domain}/players/${search_name}`)
    
    //get all teams in the league
    const teamsIDS = await getTeamsBySeason(SEASON_ID);
    let relavent_players=[];
    
    players.map((id) => {
        if(  players.includes(id.data.teame_id,0)){
                relavent_players.push.id.data;}

         }
    )
return relavent_players;
}

    
    
    //return all players that  names start search_name
    
    async function extractRelevantTeamName(player_ids, search_name){
           // all teams in the league
        const teamsIDS = await getTeamsBySeason(SEASON_ID);

        for(i=0;i<player_ids.length;i++){
            player_info[i].map((info) => 
            {
                if(info["name"].startsWith(search_name,0)){
                    relavent_players_by_name.push(info);
                }
             }
        );
    }
    return relavent_players_by_name;
}
    
    // param - searchname - the value we are looking by him
    // return - all theams that start with this value
    
    async function searchPlayerByName(search_name){
        let player_id_array = await getPlayers(search_name);
   //     let player_found = extractRelevantTeamName(player_id_array, search_name)
        return player_id_array;
    }
    
    exports.searchTeamByName = searchTeamByName;

    exports.searchPlayerByName = searchPlayerByName;