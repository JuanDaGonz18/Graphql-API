import { gql, useQuery } from '@apollo/client'

const GET_STUDENTS = gql`
  query {
    students {
      id
      firstName
      lastName
      email
      age
      major
    }
  }
`

export default function StudentQuery() {
  const { loading, error, data } = useQuery(GET_STUDENTS)

  if (loading) return <p>Cargando estudiantes...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>Lista de Estudiantes</h2>
      <ul>
        {data.students.map((s) => (
          <li key={s.id}>
            <strong>{s.firstName} {s.lastName}</strong> — {s.major} ({s.age} años)
          </li>
        ))}
      </ul>
    </div>
  )
}
