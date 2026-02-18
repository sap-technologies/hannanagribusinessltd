# API Documentation

Complete API reference for Hannan Agribusiness Goat Management System.

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Hannan Agribusiness API is running",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

---

### Goats

#### 1. Get All Goats

**GET** `/api/goats`

Retrieve all registered goats.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "goat_id": "G001",
      "breed": "Boer",
      "sex": "Male",
      "date_of_birth": "2024-01-15",
      "production_type": "Meat",
      "source": "Purchased",
      "mother_id": null,
      "father_id": null,
      "status": "Active",
      "weight": 45.5,
      "remarks": "Excellent breeding male",
      "created_at": "2026-02-09T10:30:00.000Z",
      "updated_at": "2026-02-09T10:30:00.000Z"
    }
  ],
  "message": "Goats retrieved successfully"
}
```

---

#### 2. Get Goat by ID

**GET** `/api/goats/:id`

Retrieve a specific goat by ID.

**Parameters:**
- `id` (path parameter): Goat ID

**Example:** `/api/goats/G001`

**Response:**
```json
{
  "success": true,
  "data": {
    "goat_id": "G001",
    "breed": "Boer",
    "sex": "Male",
    ...
  },
  "message": "Goat retrieved successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Goat with ID G999 not found"
}
```

---

#### 3. Create New Goat

**POST** `/api/goats`

Register a new goat.

**Request Body:**
```json
{
  "goat_id": "G002",
  "breed": "Saanen",
  "sex": "Female",
  "date_of_birth": "2025-06-20",
  "production_type": "Dairy",
  "source": "Born on farm",
  "mother_id": "G010",
  "father_id": "G001",
  "status": "Active",
  "weight": 38.2,
  "remarks": "Good milk production potential"
}
```

**Required Fields:**
- goat_id
- breed
- sex (Male or Female)
- date_of_birth
- production_type

**Optional Fields:**
- source
- mother_id
- father_id
- status (default: Active)
- weight
- remarks

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "goat_id": "G002",
    ...
  },
  "message": "Goat registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Goat with ID G002 already exists"
}
```

---

#### 4. Update Goat

**PUT** `/api/goats/:id`

Update an existing goat's information.

**Parameters:**
- `id` (path parameter): Goat ID

**Request Body:**
```json
{
  "breed": "Boer",
  "sex": "Male",
  "date_of_birth": "2024-01-15",
  "production_type": "Breeding",
  "source": "Purchased",
  "mother_id": null,
  "father_id": null,
  "status": "Active",
  "weight": 50.0,
  "remarks": "Updated weight after 6 months"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goat_id": "G001",
    ...
  },
  "message": "Goat updated successfully"
}
```

---

#### 5. Delete Goat

**DELETE** `/api/goats/:id`

Delete a goat from the system.

**Parameters:**
- `id` (path parameter): Goat ID

**Note:** Cannot delete goats that have registered offspring.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goat_id": "G001",
    ...
  },
  "message": "Goat deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete goat G001. It has 3 registered offspring."
}
```

---

#### 6. Get Goats by Status

**GET** `/api/goats/status/:status`

Retrieve goats filtered by status.

**Parameters:**
- `status` (path parameter): Active, Sold, Deceased, Quarantine

**Example:** `/api/goats/status/Active`

**Response:**
```json
{
  "success": true,
  "data": [
    ...goats with specified status
  ],
  "message": "Goats with status 'Active' retrieved successfully"
}
```

---

#### 7. Get Offspring

**GET** `/api/goats/:id/offspring`

Retrieve offspring of a specific goat.

**Parameters:**
- `id` (path parameter): Parent goat ID
- `type` (query parameter): both, mother, father (default: both)

**Examples:**
- `/api/goats/G001/offspring` - All offspring
- `/api/goats/G001/offspring?type=father` - Only as father
- `/api/goats/G001/offspring?type=mother` - Only as mother

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "goat_id": "G002",
      "mother_id": "G010",
      "father_id": "G001",
      ...
    }
  ],
  "message": "Offspring retrieved successfully"
}
```

---

#### 8. Search Goats

**GET** `/api/goats/search/:term`

Search goats by ID, breed, status, production type, or remarks.

**Parameters:**
- `term` (path parameter): Search term

**Example:** `/api/goats/search/Boer`

**Response:**
```json
{
  "success": true,
  "data": [
    ...matching goats
  ],
  "message": "Search completed successfully"
}
```

---

## Data Models

### Goat Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| goat_id | String | Yes | Unique goat identifier |
| breed | String | Yes | Goat breed (e.g., Boer, Saanen) |
| sex | String | Yes | Male or Female |
| date_of_birth | Date | Yes | Birth date (YYYY-MM-DD) |
| production_type | String | Yes | Meat, Dairy, Breeding, etc. |
| source | String | No | Origin of goat |
| mother_id | String | No | Mother's goat ID (must be Female) |
| father_id | String | No | Father's goat ID (must be Male) |
| status | String | No | Active, Sold, Deceased, Quarantine |
| weight | Decimal | No | Weight in kilograms |
| remarks | Text | No | Additional notes |
| created_at | Timestamp | Auto | Registration timestamp |
| updated_at | Timestamp | Auto | Last update timestamp |

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

---

## Validation Rules

### Goat Registration

1. **goat_id**: Must be unique
2. **sex**: Must be exactly "Male" or "Female"
3. **weight**: Must be a positive number
4. **mother_id**: If provided, must exist and be Female
5. **father_id**: If provided, must exist and be Male
6. **Deletion**: Cannot delete goats with registered offspring

---

## Sample Request Examples

### cURL Examples

**Get all goats:**
```bash
curl http://localhost:5000/api/goats
```

**Create a goat:**
```bash
curl -X POST http://localhost:5000/api/goats \
  -H "Content-Type: application/json" \
  -d '{
    "goat_id": "G003",
    "breed": "Alpine",
    "sex": "Female",
    "date_of_birth": "2025-03-10",
    "production_type": "Dairy",
    "status": "Active",
    "weight": 42.5
  }'
```

**Update a goat:**
```bash
curl -X PUT http://localhost:5000/api/goats/G003 \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 45.0,
    "status": "Active"
  }'
```

**Delete a goat:**
```bash
curl -X DELETE http://localhost:5000/api/goats/G003
```

**Search goats:**
```bash
curl http://localhost:5000/api/goats/search/Alpine
```

---

## Frontend Integration

The frontend uses Axios for API calls. Example from `api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const goatService = {
  getAllGoats: async () => {
    const response = await axios.get(`${API_BASE_URL}/goats`);
    return response.data;
  },
  
  createGoat: async (goatData) => {
    const response = await axios.post(`${API_BASE_URL}/goats`, goatData);
    return response.data;
  }
};
```

---

## Testing the API

### Using Postman

1. Import the following as a collection
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint with sample data

### Using Browser DevTools

Open the application and monitor Network tab to see API calls in action.

---

## Rate Limiting

Currently, there are no rate limits. For production, consider implementing rate limiting using `express-rate-limit`.

---

## CORS Configuration

The API allows all origins in development. For production, update CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: 'https://your-production-domain.com'
}));
```
