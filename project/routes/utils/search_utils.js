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


//return all teams that theire names include search_name with the name and logo 

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

    let array_search=search_name.split(",");
    let name;
    let position;
    let teamname;
    let players_info;
    let players
    if(array_search.length > 1){
         name= array_search[1];
         position = array_search[3];
         teamname = array_search[5];
    }

    if(array_search.length ==1 )    {
         players =await axios.get(`${api_domain}/players/search/${search_name}`, {
        params: {
            api_token: process.env.api_token,
            include:"team.current_season_id",
        },
        });
    }
    else{
         filterFlag=true;
         players =await axios.get(`${api_domain}/players/search/${name}`, {
        params: {
            api_token: process.env.api_token,
            include:"position",
            include:"team"
        },
        });
    }
    //get all teams in the league
  //  let teamsIDS = await getTeamsBySeason(SEASON_ID);
    let players_data = players.data.data;
    let relavent_players=[];
//    let pr =await Promise.all([players,teamsIDS]);
  //   players = pr[0];
  //   teamIDS = pr[1];
        players_data.map((id) => {
        try{    
            let session = id.team.data.current_season_id;
        if( session === SEASON_ID)
            {
                    relavent_players.push(id);}
            }
        catch(err){
            //do nathing
        };  
      }  
    )
    

    // pass over all the ids and returen relvant data for each one
    if(filterFlag==false){ 
            players_info = extractRelevantPlayerData2(relavent_players);
        }  
    
    else{
        if(position != 0 ){
             players_info= players_utils.filterByPositonPlayers(relavent_players,position);
        }
        if(teamname !=""){
             players_info= players_utils.filterByTeamNamePlayers(relavent_players,teamname);
        }
    }


    
return players_info;
}

// help function to extract the right details
function extractRelevantPlayerData2(players_info) {
    return players_info.map((player_info) => {
      const { fullname, image_path, position_id } = player_info;
      const { name } = player_info.team.data;
      return {
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: name,
      };
    });
  }
  
    // param - searchname - the value we are looking by him
    // return -array of  all players that start with this value
    
    async function searchPlayerByName(search_name){
        let player_id_array = await getPlayers(search_name);
   //     let player_found = extractRelevantTeamName(player_id_array, search_name)
        return player_id_array;
    }
    






    exports.searchTeamByName = searchTeamByName;

    exports.getPlayers = getPlayers;







    //==============================================Search Function Games=================================