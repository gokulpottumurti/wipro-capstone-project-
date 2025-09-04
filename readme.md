# Healthcare & Wellness Management System

A microservices-based web application for managing patients, providers, appointments, wellness services, enrollments, and payments.

## 🚀 Tech Stack

* **Frontend**: React.js (Bootstrap, Axios)
* **Backend**: Spring Boot (Microservices, REST APIs)
* **Database**: MySQL
* **Auth**: Spring Security with JWT
* **Build Tools**: Maven (backend), npm (frontend)

---

## 📂 Project Structure

```
frontend/                # React UI
backend/                 # Microservices
  ├── appointment-service
  ├── enrollment-service
  ├── patient-service
  ├── provider-service
  ├── wellness-service
  ├── payment-service
auth-service/            # Authentication & JWT service
```

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <your-repo-url>
cd <repo-root>
```

### 2. Start Frontend (React)

```bash
cd frontend
npm install
npm start
```

* Runs on **[http://localhost:3000](http://localhost:3000)**
* Connects to backend APIs listed below

---

### 3. Start Backend Microservices

Each service is a **Spring Boot app** with its own `pom.xml`.
Make sure **MySQL** is running and update `application.properties` with your DB credentials.

Run from inside each service folder:

```bash
mvn spring-boot:run
```

#### 🔑 Auth Service

* Port: **8080**
* Endpoints:

  * `POST /api/auth/register` – Register (Patient/Provider/Admin)
  * `POST /api/auth/login` – Login & get JWT

#### 🧑 Patient Service

* Port: **9091**
* Endpoints:

  * `POST /patients/register`
  * `POST /patients/login`
  * `GET /patients/{id}` (JWT required)
  * `PUT /patients/{id}` (update profile)
  * `GET /patients/{id}/records`

#### 👨‍⚕️ Provider Service

* Port: **9092**
* Endpoints:

  * `POST /api/providers`
  * `PUT /api/providers/{id}`
  * `DELETE /api/providers/{id}`

#### 📅 Appointment Service

* Port: **9093**
* Endpoints:

  * `POST /appointments` (create)
  * `GET /appointments/{id}`
  * `PUT /appointments/{id}`
  * `DELETE /appointments/{id}`

#### 🧘 Wellness Service

* Port: **9094**
* Endpoints:

  * `POST /services`
  * `PUT /services/{id}`
  * `DELETE /services/{id}`
  * `GET /services`

#### 📝 Enrollment Service

* Port: **9095**
* Endpoints:

  * `POST /enrollments`
  * `PUT /enrollments/{id}`
  * `DELETE /enrollments/{id}`
  * `GET /enrollments`

#### 💳 Payment Service

* Port: **9096**
* Endpoints:

  * `POST /payments`
  * `PUT /payments/{id}`
  * `DELETE /payments/{id}`
  * `GET /payments`

---

## 🔗 API Base URLs

```js
AUTH_API        = http://localhost:8080/api/auth
PATIENT_API     = http://localhost:9091/patients
PROVIDER_API    = http://localhost:9092/api/providers
APPOINTMENT_API = http://localhost:9093/appointments
WELLNESS_API    = http://localhost:9094/services
ENROLLMENT_API  = http://localhost:9095/enrollments
PAYMENT_API     = http://localhost:9096/payments
```

---

## 🛠️ Running All Services Together

* Open multiple terminals (or use IDE run configs like Eclipse/IntelliJ).
* Start **MySQL** first, then run **auth-service**, then other microservices, then **frontend**.
* Swagger UI available for each service at:

  ```
  http://localhost:<PORT>/swagger-ui.html
  ```

---

## ✅ Features

* Secure JWT Authentication
* Patient registration & health record management
* Provider management (doctors, wellness experts)
* Appointment booking & tracking
* Wellness service enrollment
* Payments tracking
* Admin dashboard for managing all data
