# Messenger Web Application

## Technologies

- **Frontend**: React + TypeScript  
- **Backend**: Python FastAPI  
- **Database**: Postgres / MySQL  
- **Styling**: Tailwind CSS  
- **Containerization**: Docker

---

## Main Features

- One-on-one messaging application (group chats are not implemented).  
- User **registration and authentication**.  
- Ability to send messages with **multiple file attachments**.  
- Users can **edit and delete their own messages**.  
- **Authentication** implemented using FastAPI built-in features:
  - JWT tokens  
  - OAuth2 schemes  
  - Middleware for authentication verification  

---

## Running the Project

### Using Docker

**1.** Clone the repository:

```bash
git clone https://github.com/mafinzyx/messanger.git
cd messanger
```

**2.** Build and run the containers:
```bash
docker-compose up --build
```

**3.** The app will be available at:

```bash
http://localhost:3000
```

### Running Without Docker

**1.** Frontend:
```bash
cd frontend
npm install
npm start
```

**2.** Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

- Ensure the backend runs on http://localhost:8000.
  
---

## Project Structure

- ```frontend/``` - React + TypeScript frontend code

- ```backend/``` - FastAPI backend code

- ```docker-compose.yml``` - Docker Compose configuration

---

## API Usage

- **Register:** POST /auth/register

- **Login:** POST /auth/login (returns JWT token)

- **Send Message:** POST /messages/

- **Edit Message:** PUT /messages/{id}

- **Delete Message:** DELETE /messages/{id}

- **Get Messages:** GET /messages/{user_id}

