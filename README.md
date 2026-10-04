# Todo App

A modern, animated To-Do List web application built with vanilla JavaScript.

## Features

- ✅ Create, edit, delete and complete tasks
- 🎯 Priority levels (Low, Medium, High, Critical)
- 📁 Category organization
- 🔍 Search, filter and sort capabilities
- 💾 Persistent storage using LocalStorage
- 📊 Progress tracking and statistics
- 📱 Responsive design (mobile, tablet, desktop)
- ✨ Smooth animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Architecture

The application follows a layered architecture:

- **Models**: Data structures (Task, TaskList, FilterCriteria, Statistics)
- **Services**: Business logic (TaskManager, FilterEngine, StatisticsCalculator, StorageService)
- **Controllers**: Coordination between services and views
- **Views**: UI rendering and user interactions

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite
- **Testing**: Jest, fast-check (property-based testing)
- **Code Quality**: ESLint, Prettier

## Project Structure

```
.
├── src/
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── controllers/     # Coordination layer
│   ├── views/          # UI components
│   ├── styles/         # CSS styles
│   └── main.js         # Application entry point
├── tests/              # Test files
├── public/             # Static assets
└── index.html          # Main HTML file
```

## License

MIT
