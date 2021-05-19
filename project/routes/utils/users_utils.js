const DButils = require("./DButils");

//----------------------------------------------------------Players function----------------------------------
async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

//----------------------------------------------------------Teams function----------------------------------

// mark team as favorite
async function markTeamAsFavorite(user_id,team_id){
await DButils.execQuery(
    `insert into FavoriteTeams values ('${user_id}',${team_id})`
  );
}

// get favorite teams of user_id
async function getFavoriteTeams(user_id){
  const team_ids = await DButils.execQuery(
    `select team_id from FavoriteTeams where user_id='${user_id}'`
  );
  return team_ids;
}

//----------------------------------------------------------Game functions----------------------------------

//mark game as favorite
async function markGameAsFavorite(user_id,game_id){
  await DButils.execQuery(
    `insert into FavoriteGames values ('${user_id}',${game_id})`
  );
}

async function getFavoriteGames(user_id){
  const game_ids = await DButils.execQuery(
    `select game_id from FavoriteGames where user_id='${user_id}'`
  );
  return game_ids
}





exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;

exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeams = getFavoriteTeams;

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;