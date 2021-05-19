const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";





async function getCountryID(team_id){
    let team = [];
    let countryID=[];
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
      countryID.push(team.data.data.country_id)
      return countryID;
}


async function getCountryINFO(countryID)
{
    let promises = [];
    const country=[];
    promises.push(
     country = await axios.get(`${api_domain}/countries/:${countryID}`,{
        params: {
            api_token= process.env.api_token
        }
    })
);
let country_info = await Promise.all(promises);
return extraactRelvantCountryData(country_info)
}


  
function extraactRelvantCountryData(countryID){
  return countryID.map((country) => {
      const {country_name} = country.data;
      const {continent_name} = country.data.exta;
      return{
          name: country_name,
          continent: continent_name,
      };
    }); 
  }


  async function showFavoriteTeam(team_id) {
    let contryID = await getCountryID(team_id);
    let conrty_info = await getCountryINFO(contryID);
    country_info["id"] = team_id;
    return conrty_info;
  }
  

  async function createShowAllTeams(team_ids){
    let teamsArray=[];
    team_ids.map((id) => {
      teamsArray.push(showFavoriteTeam(id))
    });
  };




  exports.showFavoriteTeam = showFavoriteTeam;
  exports.getCountryINFO = getCountryINFO;
  exports.createShowAllTeams = createShowAllTeams;