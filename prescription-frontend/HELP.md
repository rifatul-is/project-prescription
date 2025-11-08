# API Documentation

## Authentication APIs

### 1. POST /api/auth/login
Login endpoint to authenticate user and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "username": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid username or password"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Username and password are required"
}
```

---

### 2. GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "username": "admin"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

---

## Prescription APIs

All prescription endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### 3. GET /api/v1/prescription
Get all prescriptions with optional date range filter. If no date range is provided, defaults to current month.

**Query Parameters:**
- `startDate` (optional): Start date in format `yyyy-MM-dd`
- `endDate` (optional): End date in format `yyyy-MM-dd`

**Example Request:**
```
GET /api/v1/prescription?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "prescriptionDate": "2024-01-15",
    "patientName": "John Doe",
    "patientAge": 35,
    "patientGender": "MALE",
    "diagnosis": "Common cold",
    "medicines": "Paracetamol 500mg, 2 times daily",
    "nextVisitDate": "2024-01-22"
  },
  {
    "id": 2,
    "prescriptionDate": "2024-01-16",
    "patientName": "Jane Smith",
    "patientAge": 28,
    "patientGender": "FEMALE",
    "diagnosis": "Headache",
    "medicines": "Ibuprofen 400mg, as needed",
    "nextVisitDate": "2024-01-23"
  }
]
```

---

### 4. GET /api/v1/prescription/{id}
Get a single prescription by ID.

**Example Request:**
```
GET /api/v1/prescription/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "prescriptionDate": "2024-01-15",
  "patientName": "John Doe",
  "patientAge": 35,
  "patientGender": "MALE",
  "diagnosis": "Common cold",
  "medicines": "Paracetamol 500mg, 2 times daily",
  "nextVisitDate": "2024-01-22"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Prescription not found with id: 1"
}
```

---

### 5. POST /api/v1/prescription
Create a new prescription.

**Request:**
```json
{
  "prescriptionDate": "2024-01-15",
  "patientName": "John Doe",
  "patientAge": 35,
  "patientGender": "MALE",
  "diagnosis": "Common cold",
  "medicines": "Paracetamol 500mg, 2 times daily",
  "nextVisitDate": "2024-01-22"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "prescriptionDate": "2024-01-15",
  "patientName": "John Doe",
  "patientAge": 35,
  "patientGender": "MALE",
  "diagnosis": "Common cold",
  "medicines": "Paracetamol 500mg, 2 times daily",
  "nextVisitDate": "2024-01-22"
}
```

**Error Response (400 Bad Request) - Validation Error:**
```json
{
  "error": "Validation failed",
  "errors": {
    "patientName": "Patient name is mandatory",
    "patientAge": "Patient age is mandatory",
    "prescriptionDate": "Prescription date is mandatory"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Error message here"
}
```

**Field Validation Rules:**
- `prescriptionDate`: Required, must be present or past date
- `patientName`: Required, 1-255 characters
- `patientAge`: Required, 0-150
- `patientGender`: Required, must be one of: `MALE`, `FEMALE`, `OTHER`
- `diagnosis`: Optional
- `medicines`: Optional
- `nextVisitDate`: Optional, must be a future date if provided

---

### 6. PUT /api/v1/prescription/{id}
Update an existing prescription.

**Example Request:**
```
PUT /api/v1/prescription/1
```

**Request:**
```json
{
  "prescriptionDate": "2024-01-15",
  "patientName": "John Doe Updated",
  "patientAge": 36,
  "patientGender": "MALE",
  "diagnosis": "Common cold - improved",
  "medicines": "Paracetamol 500mg, 2 times daily",
  "nextVisitDate": "2024-01-25"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "prescriptionDate": "2024-01-15",
  "patientName": "John Doe Updated",
  "patientAge": 36,
  "patientGender": "MALE",
  "diagnosis": "Common cold - improved",
  "medicines": "Paracetamol 500mg, 2 times daily",
  "nextVisitDate": "2024-01-25"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Prescription not found with id: 1"
}
```

**Error Response (400 Bad Request) - Validation Error:**
```json
{
  "error": "Validation failed",
  "errors": {
    "patientName": "Patient name is mandatory"
  }
}
```

---

### 7. DELETE /api/v1/prescription/{id}
Delete a prescription.

**Example Request:**
```
DELETE /api/v1/prescription/1
```

**Response (200 OK):**
```json
{
  "message": "Prescription deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Prescription not found with id: 1"
}
```

---

## Report APIs

All report endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### 8. GET /api/v1/report/day-wise
Get day-wise prescription count. If no date range is provided, defaults to current month.

**Query Parameters:**
- `startDate` (optional): Start date in format `yyyy-MM-dd`
- `endDate` (optional): End date in format `yyyy-MM-dd`

**Example Request:**
```
GET /api/v1/report/day-wise?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200 OK):**
```json
[
  {
    "day": "2024-01-15",
    "prescriptionCount": 3
  },
  {
    "day": "2024-01-16",
    "prescriptionCount": 5
  },
  {
    "day": "2024-01-17",
    "prescriptionCount": 2
  }
]
```

---

## Notes

- All dates should be in `yyyy-MM-dd` format
- All authenticated endpoints require a valid JWT token in the Authorization header
- Gender values must be one of: `MALE`, `FEMALE`, `OTHER`
- Prescriptions are user-specific - users can only access their own prescriptions
- Default admin credentials: username: `admin`, password: `admin`
