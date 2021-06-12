const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";


// return relvant detail about all teams in id array

async function TeamInfo(team_ids_array){
    let TeamInfo=[];
    let promises=[];
    team_ids_array.map((team_id) =>
    promises.push(
       axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
          include: "country",
          api_token: process.env.api_token,
        },
      })
    )
    );
  let teams_info= await Promise.all(promises);
  return extraactRelvantTeamData(teams_info) 
}



// extract details for each team
function extraactRelvantTeamData(teams_info){
  return teams_info.map((team) => {
      let {name,logo_path} = team.data.data;
      let team_name=name;
      name = team.data.data.country.data.name;
      let country_name=name;
      const {continent} = team.data.data.country.data.extra;
      return{
          name: team_name,
          country: country_name,
          continent: continent,
          logo_path: logo_path,
      };
    }); 
  }


  // return array of all teams in the favorit and a few details
  async function showFavoriteTeams(team_ids) {
    let teams_info =await TeamInfo(team_ids);
    return teams_info;
  }



  exports.TeamInfo = TeamInfo;
  exports.showFavoriteTeams = showFavoriteTeams;
  exports.extraactRelvantTeamData = extraactRelvantTeamData;