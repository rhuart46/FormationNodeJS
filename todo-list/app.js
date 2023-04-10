const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;

// Configure express:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "zisiz ze riseum of ze naïte",
    resave: false,
    saveUninitialized: true,
}));

app.set("view engine", "ejs");

// Define the API endpoints:
app.post("/task", (req, res) => {
    if (req.body.task) {
        req.session.tasks.push({
            title: req.body.task,
            done: false,
        });
    }
    res.redirect("/");
});

app.get("/task/:id/done", (req, res) => {
    const task = req.session.tasks[req.params.id];
    if (task) {
        task.done = true;
    }
    res.redirect("/");
});

app.get("/task/:id/delete", (req, res) => {
    const task = req.session.tasks[req.params.id];
    if (task && task.done) {
        req.session.tasks.splice(req.params.id, 1);
    }
    res.redirect("/");
});

app.get("/", (req, res) => {
    if (!req.session.tasks) {
        req.session.tasks = [];
    };
    res.render("todolist", { tasks: req.session.tasks });
});

// Launch the server:
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}.`);
});
