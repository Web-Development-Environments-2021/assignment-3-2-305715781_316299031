const DButils = require("./DButils");



//----------------------------------------------------------Players function----------------------------------
async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `INSERT INTO FavoritePlayers VALUES ('${user_id}',${player_id})`
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
    `INSERT INTO dbo.FavoriteGames(user_id,game_id) VALUES  ('${user_id}',${game_id})`
  );
}

async function getFavoriteGames(user_id){
  let games_id_array = [];
  const games_id = await DButils.execQuery(`select game_id from dbo.FavoriteGames where user_id='${user_id}'`);
  games_id.map((info) => {
    let game_id = info["game_id"];
    games_id_array.push(game_id)
  });
  return games_id_array
}



exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;

exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeams = getFavoriteTeams;

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;

