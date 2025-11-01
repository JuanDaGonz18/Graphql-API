import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

function BreedQuery() {
  const [breedId, setBreedId] = useState("");
  const [selectedFields, setSelectedFields] = useState(["id", "name"]);

  const BREED_QUERY = gql`
    query GetBreed($id: ID!) {
      breed(id: $id) {
        ${selectedFields.join("\n")}
      }
    }
  `;

  const [loadBreed, { loading, data, error }] = useLazyQuery(BREED_QUERY);

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = () => {
    if (breedId) loadBreed({ variables: { id: breedId } });
  };

  return (
    <div className="card">
      <h2>Consultar Raza de Gato</h2>
      <input
        type="text"
        placeholder="ID de la raza"
        value={breedId}
        onChange={(e) => setBreedId(e.target.value)}
      />

      <div className="checkbox-group">
        {["id", "name", "origin", "temperament", "description"].map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => handleFieldChange(field)}
            />
            {field}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>Consultar</button>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      {data && (
        <pre>{JSON.stringify(data.breed, null, 2)}</pre>
      )}
    </div>
  );
}

export default BreedQuery;
