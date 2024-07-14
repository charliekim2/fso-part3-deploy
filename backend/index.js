require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req, _) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.json());
app.use(cors());
app.use(express.static("./backend/dist"));

app.get("/api/persons", (_, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (_, res) => {
  const date = new Date();
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`,
    );
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((_) => {
      res.status(204).end();
    })
    .catch((e) => e);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(400);
    res.send("name or number missing");
  }
  Person.find({ name: body.name }).then((person) => {
    if (person.length > 0) {
      res.status(400);
      res.send("name must be unique");
      return;
    }
    const p = new Person({
      name: body.name,
      number: body.number,
    });
    p.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  });
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Person.findById(id).then((person) => {
    if (!person) {
      res.status(404).end();
      return;
    }
    person.name = body.name;
    person.number = body.number;
    person
      .save()
      .then((updatedPerson) => {
        res.json(updatedPerson);
      })
      .catch((e) => next(e));
  });
});

const errorHandler = (err, res, _, next) => {
  console.errer(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
