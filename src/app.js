const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0,
  }
  repositories.push(repository);
  return response.json(repositories[repositories.indexOf(repository)]);
});

app.put("/repositories/:id", (request, response) => {
  const {id} =  request.params;
  const logLabel = `${id.toUpperCase()} `;
  const repository = repositories.find(repository => repository.id === id);
  if(repositories.indexOf(repository)<0) 
    return response.status(400).json({error: "repository id not found"});
  const rep = request.body;
  if(rep.likes)
    return response.status(400).json({"likes": 0});
  repository.title = rep.title;
  repository.url = rep.url;
  repository.techs = rep.techs;
  return response.json(repositories[repositories.indexOf(repository)]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  const index = repositories.indexOf(repository);
  if(index<0)
    return response.status(400).Json({error:"ID not found!"});
  repositories.splice(index,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if(!repositories.find(repository => repository.id === id ))
    return response.status(400).json({error: "repository not found!"});
  const repository = repositories.find(repository => repository.id === id);
  repository.likes += 1;
  return response.json(repositories[repositories.indexOf(repository)]);
});

module.exports = app;
