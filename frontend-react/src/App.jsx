import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [studentId, setStudentId] = useState("");
  const [breedId, setBreedId] = useState("");

  const [studentFields, setStudentFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
    age: true,
    major: true,
  });

  const [breedFields, setBreedFields] = useState({
    id: true,
    name: true,
    origin: true,
    temperament: true,
    description: true,
  });

  // --- Construcción dinámica de queries ---
  const buildStudentQuery = () => {
    const selectedFields = Object.keys(studentFields)
      .filter((f) => studentFields[f])
      .join(" ");
    return studentId.trim()
      ? gql`
          query GetStudent($id: ID!) {
            student(id: $id) {
              ${selectedFields}
            }
          }
        `
      : gql`
          query GetStudents {
            students {
              ${selectedFields}
            }
          }
        `;
  };

  const buildBreedQuery = () => {
    const selectedFields = Object.keys(breedFields)
      .filter((f) => breedFields[f])
      .join(" ");
    return gql`
      query GetBreed($id: ID!) {
        breed(id: $id) {
          ${selectedFields}
        }
      }
    `;
  };

  // --- Hooks Apollo ---
  const [getStudents, { loading: loadingAll, error: errorAll, data: dataAll }] =
    useLazyQuery(buildStudentQuery());
  const [getStudent, { loading: loadingOne, error: errorOne, data: dataOne }] =
    useLazyQuery(buildStudentQuery());
  const [getBreed, { loading: loadingBreed, error: errorBreed, data: dataBreed }] =
    useLazyQuery(buildBreedQuery());

  // --- Handlers para checkboxes ---
  const handleStudentCheckbox = (field) => {
    setStudentFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleBreedCheckbox = (field) => {
    setBreedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // --- Consultas ---
  const handleFetchStudents = () => {
    if (studentId.trim()) {
      getStudent({ variables: { id: studentId } });
    } else {
      getStudents();
    }
  };

  const handleFetchBreed = () => {
    if (breedId.trim()) {
      getBreed({ variables: { id: breedId } });
    }
  };

  // --- Resultados renderizados ---
  const students = dataAll?.students || (dataOne?.student ? [dataOne.student] : []);

  return (
    <div className="container">
      <h1>🐾 GraphQL API - Apollo Client Mejorado</h1>

      {/* Sección de estudiantes */}
      <div className="card">
        <h2>Consultar Estudiantes</h2>

        <input
          type="text"
          placeholder="ID del estudiante (opcional)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <div className="checkboxes">
          {Object.keys(studentFields).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={studentFields[key]}
                onChange={() => handleStudentCheckbox(key)}
              />
              {key}
            </label>
          ))}
        </div>

        <button onClick={handleFetchStudents}>Consultar Estudiantes</button>

        {loadingAll || loadingOne ? <p>⏳ Cargando...</p> : null}
        {errorAll || errorOne ? (
          <p className="error">❌ Error al consultar estudiantes</p>
        ) : null}

        {students.length > 0 && (
          <div className="result-box">
            {students.map((student, index) => (
              <div key={index}>
                <p>
                  <strong>👩‍🎓 Nombre:</strong> {student.firstName} {student.lastName}
                </p>
                {student.email && <p><strong>Email:</strong> {student.email}</p>}
                {student.age && <p><strong>Edad:</strong> {student.age}</p>}
                {student.major && <p><strong>Carrera:</strong> {student.major}</p>}
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de razas */}
      <div className="card">
        <h2>Consultar Raza de Gato</h2>

        <input
          type="text"
          placeholder="ID de raza..."
          value={breedId}
          onChange={(e) => setBreedId(e.target.value)}
        />

        <div className="checkboxes">
          {Object.keys(breedFields).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={breedFields[key]}
                onChange={() => handleBreedCheckbox(key)}
              />
              {key}
            </label>
          ))}
        </div>

        <button onClick={handleFetchBreed}>Consultar Raza</button>

        {loadingBreed && <p>⏳ Cargando raza...</p>}
        {errorBreed && <p className="error">❌ Error al consultar raza</p>}

        {dataBreed?.breed && (
          <div className="result-box">
            {breedFields.name && (
              <p><strong>🐱 Nombre:</strong> {dataBreed.breed.name}</p>
            )}
            {breedFields.origin && (
              <p><strong>Origen:</strong> {dataBreed.breed.origin}</p>
            )}
            {breedFields.temperament && (
              <p><strong>Temperamento:</strong> {dataBreed.breed.temperament}</p>
            )}
            {breedFields.description && (
              <p><strong>Descripción:</strong> {dataBreed.breed.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

