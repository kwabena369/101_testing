# HTTP JSON Storage Service

A  HTTP backend service that allows you to save JSON data to the filesystem, retrieve it, and list all stored data IDs. 

## Features

- Save JSON data to the filesystem (`POST /data/:id`)
- Retrieve JSON data from the filesystem (`GET /data/:id`)
- List all available data IDs (`GET /data`)
- In-memory caching for faster data retrieval
- Basic request logging for debugging
- Comprehensive error handling for various edge cases
<!-- the bonus -->
- Delete stored data (`DELETE /data/:id`)
- Update existing data (`PUT /data/:id`)

## Project Setup

### Prerequisites
- Node.js (v14 or later recommended)
- npm (comes bundled with Node.js)

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

The server will start on port 3000 by default. To use a different port, set the `PORT` environment variable (e.g., `export PORT=4000` on Unix-based systems or `set PORT=4000` on Windows).

### Required Dependencies

The project uses the following dependencies, as defined in `package.json`:
- `express`: For building the HTTP server
- `fs` (Node.js built-in): For filesystem operations
- `nodemon` (dev dependency): For auto-restarting the server during development

Here’s the relevant `package.json` configuration:
```json
{
  "name": "nexus_test",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## API Endpoints

### Save JSON Data
- **Method**: POST
- **Endpoint**: `/data/:id`
- **Request Body**: Any valid JSON payload
- **Example**:
  ```
  curl -X POST -H "Content-Type: application/json" -d '{"name":"Alice","age":30}' http://localhost:3000/data/user123
  ```
- **Response** (on success):
  ```json
  {
    "success": true,
    "message": "Data saved successfully with ID: user123"
  }
  ```

### Retrieve JSON Data
- **Method**: GET
- **Endpoint**: `/data/:id`
- **Example**:
  ```
  curl http://localhost:3000/data/user123
  ```
- **Response** (on success):
  ```json
  {
    "name": "Kofi",
    "age": 10
  }
  ```

### List All Data IDs
- **Method**: GET
- **Endpoint**: `/data`
- **Example**:
  ```
  curl http://localhost:3000/data
  ```
- **Response** (on success):
  ```json
  {
    "success": true,
    "count": 1,
    "ids": ["user123"]
  }
  ```

### Delete JSON Data
- **Method**: DELETE
- **Endpoint**: `/data/:id`
- **Example**:
  ```
  curl -X DELETE http://localhost:3000/data/user123
  ```
- **Response** (on success):
  ```json
  {
    "success": true,
    "message": "Data with ID user123 deleted successfully"
  }
  ```

### Update JSON Data
- **Method**: PUT
- **Endpoint**: `/data/:id`
- **Request Body**: JSON payload with fields to update
- **Example**:
  ```
  curl -X PUT -H "Content-Type: application/json" -d '{"age":31}' http://localhost:3000/data/user123
  ```
- **Response** (on success):
  ```json
  {
    "success": true,
    "message": "Data with ID user123 updated successfully",
    "data": {
      "name": "Alice",
      "age": 31
    }
  }
  ```

## Error Handling

The service handles the following error scenarios gracefully:
- Invalid JSON in the request body (returns 500 with error message)
- Missing files when retrieving or deleting data (returns 404)
- Invalid IDs containing path separators (`/` or `\`) (returns 400)
- File I/O errors (returns 500 with detailed error in development mode)
- JSON parsing errors when reading files (returns 500)

## Implementation Details

- **Storage**: Data is stored in the `data/` directory as individual JSON files, named `<id>.json` (e.g., `user123.json`).
- **Caching**: In-memory caching (using a `Map`) improves read performance by storing frequently accessed data in memory.
- **Cache Invalidation**: The cache is invalidated on write operations (POST, PUT, DELETE) to ensure data consistency.
- **Logging**: Each request is logged with a timestamp, method, and URL for debugging purposes.

## Testing the API

You can test the API using tools like `curl` (as shown in the examples above) or Postman:
1. Start the server with `npm run dev`.
2. Use Postman to send requests to the endpoints.
3. Verify responses and check the `data/` directory for stored files.
