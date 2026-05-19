import { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((res) => res.json())
      .then((data) => setToys(data));
  }, []);

  function handleAddToy(newToyData) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToyData, likes: 0 }),
    })
      .then((res) => res.json())
      .then((createdToy) => setToys((prev) => [...prev, createdToy]));
  }

  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, { method: "DELETE" }).then(
      (res) => {
        if (res.ok) setToys((prev) => prev.filter((toy) => toy.id !== id));
      }
    );
  }

  function handleLikeToy(id, currentLikes) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: currentLikes + 1 }),
    })
      .then((res) => res.json())
      .then((updatedToy) =>
        setToys((prev) =>
          prev.map((toy) => (toy.id === updatedToy.id ? updatedToy : toy))
        )
      );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="button-bar">
        <button onClick={() => setShowForm((show) => !show)}>
          Add a Toy
        </button>
      </div>
      <ToyContainer
        toys={toys}
        onLike={handleLikeToy}
        onDelete={handleDeleteToy}
      />
    </>
  );
}

export default App;