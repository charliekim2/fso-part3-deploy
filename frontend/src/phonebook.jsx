import { useState } from "react";

const Add = ({ onSubmit, inputs }) => {
  const formInput = inputs.map((i) => {
    return (
      <div>
        {i.title}: <input value={i.value} onChange={i.handler} />
      </div>
    );
  });
  return (
    <form onSubmit={onSubmit}>
      <div>
        {formInput}
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = ({ term, handler }) => {
  return (
    <div>
      <p>filter by name:</p>
      <input value={term} onChange={handler} />
    </div>
  );
};

const Numbers = ({ persons, term, onDelete }) => {
  return (
    <div>
      {persons
        .filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))
        .map((p) => (
          <li key={p.id}>
            {p.name} {p.number}
            <button onClick={() => onDelete(p)}>Delete</button>
          </li>
        ))}
    </div>
  );
};

const Notification = ({ type, message }) => {
  if (message === null) {
    return null;
  }
  return <div className={type}>{message}</div>;
};

export { Add, Filter, Numbers, Notification };
