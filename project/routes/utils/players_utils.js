const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

//--------------------------------------------------------------------get players by functions-------------------------------------
// param - team_id - the value we are looking by him
// return - return all players in the team
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

// param - players_ids_list - players id 
// return - player info
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

// param - players_info 
// return - Relevant player info
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id, common_name, nationality, birthdate,birthcountry,height,weight } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      image: image_path,
      position: position_id,
      team_name: name,
      CommonName: common_name,
      nationality: nationality,
      birthdate: birthdate,
      birthcountry: birthcountry,
      height:height,
      weight:weight,
    };
  });
}
 
// param - team_id - the value we are looking by him
// return - Relevant player info
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

// param - players_info 
// return Full page detail for player
function extractFullPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { common_name, nationality, birthdate,birthcountry,height,weight } = player_info.data.data;
    return {
      CommonName: common_name,
      nationality: nationality,
      birthdate: birthdate,
      birthcountry: birthcountry,
      height:height,
      weight:weight,
    };
  });
}
function extractFullPlayersData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id ,common_name, nationality, birthdate,birthcountry,height,weight } = player_info;
    const { name } = player_info.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      CommonName: common_name,
      nationality: nationality,
      birthdate: birthdate,
      birthcountry: birthcountry,
      height:height,
      weight:weight,
    };
  });
}

//--------------------------------------------------------------------Search Filters-------------------------------------

//by position

function filterByPositonPlayers(players,position_id){
  let playersIdByPositons =[];
  players.map((player) => {
      if(player.position_id == position_id){
        const { fullname, image_path, position_id }=player;
        const { name } = player.team.data;
          playersIdByPositons.push(
            {
            name: fullname,
            image: image_path,
            position: position_id,
            team_name: name,
            }
          )
      }
    });
  return playersIdByPositons;
}


// by team

function filterByTeamNamePlayers(players,teamname){
  let playersIdByTeamName =[];
  players.map((player) => {
      if(player.team.data.name == teamname){
        const { fullname, image_path, position_id }=player;
        const { name } = player.team.data;
        playersIdByTeamName.push(
            {
            name: fullname,
            image: image_path,
            position: position_id,
            team_name: name,
            }
          )
      }
    });
  return playersIdByTeamName;
}





//-------------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------

exports.filterByPositonPlayers = filterByPositonPlayers;
exports.getPlayerIdsByTeam = getPlayerIdsByTeam;
exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.filterByTeamNamePlayers = filterByTeamNamePlayers;
exports.extractFullPlayersData = extractFullPlayersData;