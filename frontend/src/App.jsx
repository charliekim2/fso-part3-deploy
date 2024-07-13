import "./App.css";
import { Add, Filter, Numbers, Notification } from "./phonebook";
import db from "./service/db.js";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("error");

  useEffect(() => {
    db.readAll().then((r) => {
      setPersons(r.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumChange = (event) => {
    setNumber(event.target.value);
  };

  const onSubmitPerson = (event) => {
    event.preventDefault();
    // Not needed because there is no endpoint for PUT
    // if (persons.some((p) => name == p.name)) {
    //   const guy = persons.find((p) => name == p.name);
    //   if (window.confirm(`${guy.name} exists, replace number?`)) {
    //     db.update({
    //       name,
    //       number,
    //       id: guy.id,
    //     }).then((r) => {
    //       setPersons(persons.map((p) => (p.id !== guy.id ? p : r.data)));
    //     });
    //   }
    //   return;
    // }
    const newPerson = {
      name,
      number,
    };
    db.create(newPerson).then((r) => {
      let nl = [...persons];
      nl.push(r.data);
      setPersons(nl);
      setMessage(`${newPerson.name} created`);
      setType("success");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const onDelete = (guy) => {
    if (window.confirm(`Delete ${guy.name}?`))
      db.remove(guy.id)
        .then((_) => {
          setPersons(persons.filter((p) => p.id != guy.id));
        })
        .catch((_) => {
          setMessage(`${guy.name} was already deleted`);
          setType("error");
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id != guy.id));
        });
  };

  const inputs = [
    {
      title: "name",
      value: name,
      handler: handleNameChange,
    },
    {
      title: "number",
      value: number,
      handler: handleNumChange,
    },
  ];

  const handleFilter = (event) => {
    setFilterTerm(event.target.value);
  };

  return (
    <div>
      <Notification type={type} message={message} />
      <Add onSubmit={onSubmitPerson} inputs={inputs} />
      <Filter handler={handleFilter} />
      <Numbers persons={persons} term={filterTerm} onDelete={onDelete} />
    </div>
  );
}

export default App;
