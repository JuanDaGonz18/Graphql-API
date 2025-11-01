# GraphQL API - Frontend y Backend

## Estructura del proyecto

    Graphql-API/
    ├─ frontend-plain/   ← HTML plano con app.js y styles.css
    └─ backend-plain/    ← Servidor GraphQL con Node.js + SQLite

------------------------------------------------------------------------

## Backend

1.  **Entrar a la carpeta del backend:**

    ``` bash
    cd backend-plain
    ```

2.  **Instalar dependencias:**

    ``` bash
    npm install
    ```

3.  **Ejecutar el servidor:**

    ``` bash
    node server.js
    ```

    El servidor queda disponible en: <http://localhost:4000/>

------------------------------------------------------------------------

## Frontend

1.  Abre el archivo `frontend-plain/index.html` en tu navegador.

2.  En la interfaz podrás:

    -   **Consultar Estudiantes** → Trae todos los estudiantes.
    -   **Consultar Raza** → Trae datos de la raza según el ID
        ingresado.

El frontend se conecta automáticamente al backend local.
