# Chat App

A simple real-time chat web application built using Ruby on Rails for the backend and Next.js for the frontend. The application supports real-time messaging using WebSockets and can also utilize mock data for testing.

## Features

- **Real-time Chatroom:** Messages are updated in real-time without refreshing the page.
- **Public Deployment:** The chat is hosted online, allowing anyone to access it.
- **Mock Data Support:** The app can generate mock data for testing purposes.
- **Modern Frontend:** Built with Next.js, Tailwind CSS, and React.
- **Unit Tests (Bonus):** Basic test implementations for reliability.
- **Tasteful UI:** A simple and clean user interface.

## Live Demo

- **Backend:** [Chat App Backend](https://chat-app-backend-krix.onrender.com)
- **Frontend:** [Chat App Frontend](https://chat-app-frontend-45mp.onrender.com)

## Repository

You can find the full source code on GitHub:
[Chat App Repository](https://github.com/Aul-rhmn/chat-app.git)

## Installation & Setup

### Prerequisites

- Node.js & npm
- Ruby & Rails
- PostgreSQL (or another database)

### Backend (Rails API)

1. Clone the repository:
   ```sh
   git clone https://github.com/Aul-rhmn/chat-app.git
   cd chat-app/backend
   ```
2. Install dependencies:
   ```sh
   bundle install
   ```
3. Set up the database:
   ```sh
   rails db:create db:migrate
   ```
4. Start the Rails server:
   ```sh
   rails server -p 3001
   ```

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:3000`

## Deployment

This project is deployed using Render:

- **Backend:** Hosted on Render as a Rails API.
- **Frontend:** Hosted on Render as a Next.js application.

For custom deployment, refer to:
- [Render Docs](https://render.com/docs)
- [Heroku Deployment](https://devcenter.heroku.com/articles/getting-started-with-rails5)
- [Railway Deployment](https://docs.railway.app/)

## References

### Setting Up Rails
- [Rails Guide](https://guides.rubyonrails.org/getting_started.html)
- [GoRails Setup for Windows](https://gorails.com/setup/windows/10)

### Real-Time Chat in Rails
- [Building Chat with Rails & WebSockets](https://iridakos.com/tutorials/2019/04/04/creating-chat-application-rails-websockets.html)
- [Pusher API Chat Tutorial](https://pusher.com/tutorials/chat-app-ruby-rails)

## Contributing

Feel free to fork the repository and submit pull requests with improvements!

---
