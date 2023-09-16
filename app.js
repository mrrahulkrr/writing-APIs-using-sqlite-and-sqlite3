//import express
const express = require("express");
const app = express();

// import sqlite and sqlite3
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

// joining current directory to cricket team database to form a path
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());

// initializing database and server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`db Error${e.message}`);
  }
};

initializeDbAndServer();

//converting database object into response object
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.playerId,
    playerName: dbObject.playerName,
    jerseyNumber: dbObject.jerseyNumber,
    role: dbObject.role,
  };
};

// API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `  
  select
    *
    from
     cricket_team;
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) => {
      convertDbObjectToResponseObject(eachPlayer);
    })
  );
});

//API 2
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const postPlayerQuery = `
    Insert into 
    cricket_team (player_Name, jersey_Number, role)
    Values (
        "${playerName}",
        "${jerseyNumber}",
        "${role}",
    )`;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerOnIdQuery = `
    Select 
      * 
    From 
      cricket_team
    Where 
    player_id = ${playerId}
`;
  const player = await db.get(getPlayerOnIdQuery);
  response.send(convertDbObjectToResponseObject(player));
});

//API 4
app.put("/players/:playersId", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
    Update 
      cricket_team
    Set 
        player_Name = '${playerName}',
        jersey_Number = '${jerseyNumber}',
        role = '${role}'
    
    Where 
    player_id = ${playerId};
    `;
  await db.run(updatePlayerQuery);
  response.send("Players Details Updated");
});

//API 5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  Delete from
  cricket_team
  Where
  player_id = ${playerId}
  `;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
