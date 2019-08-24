const express = require("express");

const server = express();

server.use(express.json());
let qtdeReq = 0;
const projects = [];

//mostrar a quantidade de requisões feitas
server.use((req, res, next) => {
  if (req.method) {
    qtdeReq++;
  }
  console.log(`quantidade de requisições: ${qtdeReq}`);
  next();
});

// verificar se existe um projeto com um ID especifico nos parametros
function CheckIdProjectsExist(req, res, next) {
  const projectId = projects.find(item => item.id == req.params.id);
  if (!projectId) {
    return res.status(400).json({ error: "project ID does not exists" });
  }
  return next();
}
// adicionar projetos
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  // passar objetos dentro do array,ficando assim:
  // [{id:valor do id , title: valor do title}]
  projects.push({
    id: id,
    title: title,
    task: []
  });

  return res.json(projects);
});

//listar projetos
server.get("/projects", (req, res) => {
  res.json(projects);
});
//atualizar titulo dos projetos
server.put("/projects/:id", CheckIdProjectsExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);

  project.title = title;

  return res.json(projects);
});

//deletar projetos
server.delete("/projects/:id", CheckIdProjectsExist, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(item => item.id == id);

  projects.splice(index, 1);

  res.send();
});
// adicionar uma nova tarefa ao projeto
server.post("/projects/:id/tasks", CheckIdProjectsExist, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(item => item.id == id);
  const taskArray = project.task;
  taskArray.push(task);

  res.json(projects);
});
server.listen(3000);
