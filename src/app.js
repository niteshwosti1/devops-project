const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

// Health check — DevOps best practice
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id',(req,res) => {
  const task = tasks.find(t=>t.id === Number.parseInt(req.params.id))
  if(!task) return res.status(404).json({error:'Task not found'})
  res.json(task)
})

app.delete('/tasks/:id',(req,res)=>{
  const taskID = Number.parseInt(req.params.id);

  if (Number.isNaN(taskID)){
    return res.status(404).json({error:"Invalid Task Id"})
  } 
  const index = tasks.findIndex(t=>t.id === taskID);
  if (index === -1){
    return res.status(404).json("error: Task not found")
  }
  const deletedTask = tasks.splice(index,1)
  res.status(200).json({message:"Task Deleted Successfully", task: deletedTask[0]})

})

// Create a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Mark task done
app.patch('/tasks/:id/done', (req, res) => {
  const task = tasks.find(t => t.id === Number.parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.done = true;
  res.json(task);
});

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => console.log('Server running on port 3000'));
}