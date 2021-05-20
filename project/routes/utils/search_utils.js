const axios = require("axios");
const teams_utils = require("./teamsFavorite_utils")
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
    let x;
    let relavent_teams_by_name=[];
    teams_info =await teams_utils.showFavoriteTeams(teams_id_array);
    teams_info.map((info) => 
        {
                x=info["name"];
            if(info["name"].startsWith(search_name,0)){
                    relavent_teams_by_name.push(info);
            }
         }
    );
    return relavent_teams_by_name;
}

async function searchTeamByName(search_name){
    let teams_id_array = await getTeamsBySeason(SEASON_ID);
    let teams_found = extractRelevantTeamName(teams_id_array, search_name)
    return teams_found;
}

exports.searchTeamByName = searchTeamByName;