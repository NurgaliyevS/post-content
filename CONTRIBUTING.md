# Contributing to Post Content

Thank you for your interest in contributing to Post Content! We're excited to have you join our mission to create an open-source Reddit post scheduling solution that helps users optimize their content engagement.

## Table of Contents

- [Contributing to Post Content](#contributing-to-reddit-scheduler)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
  - [Database Management](#database-management)
  - [Coding Guidelines](#coding-guidelines)
    - [General Principles](#general-principles)
    - [JavaScript Guidelines](#javascript-guidelines)
    - [React Guidelines](#react-guidelines)
  - [Documentation](#documentation)
  - [Areas of Contribution](#areas-of-contribution)
  - [Community](#community)
  - [Questions or Need Help?](#questions-or-need-help)

## Getting Started

1. **Fork the Repository**
   - Click the 'Fork' button at the top right of this repository
   - Clone your fork locally: `git clone https://github.com/NurgaliyevS/redditscheduler.git`

2. **Set Up Development Environment**
   - Install [Node.js](https://nodejs.org/) (v18 or higher)
   - Install [MongoDB](https://www.mongodb.com/try/download/community)
   - Clone the repository and install dependencies: `npm install`
   - Copy `.env.example` to `.env`
   - Set up your Reddit OAuth credentials (see [README.md](../README.md))
   - Start MongoDB locally

## Development Workflow

1. **Start the Development Environment**

   ```bash
   # Start MongoDB locally
   mongod
   
   # Start the development server
   npm run dev
   ```

2. **Create a New Branch**

   Always create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**

   - Write clean, maintainable code
   - Follow our coding standards
   - Update documentation if required

4. **Test Your Changes**

   - Make sure the app runs without errors
   - Test your feature thoroughly
   - Ensure Reddit API integration works correctly

5. **Commit Your Changes**

   - Use clear, descriptive commit messages
   - Reference issues and pull requests

   ```bash
   git commit -m "feat: add post scheduling feature

   Implements #123"
   ```

6. **Stay Updated**

   Keep your fork in sync with the main repository:

   ```bash
   git fetch upstream
   git merge upstream/main
   ```

7. **Push to Your Fork**

   ```bash
   git push origin your-branch-name
   ```

8. **Submit a Pull Request**
   - Go to your fork on GitHub and click "New Pull Request"
   - Fill out the PR template completely
   - Link any relevant issues
   - Add screenshots for UI changes

## Database Management

Post Content uses MongoDB with Mongoose. Here's how to work with it:

1. **Database Structure**

   The database models are defined in the `models` directory.

2. **Common Database Tasks**

   ```bash
   # Start MongoDB locally
   mongod
   
   # Connect to MongoDB shell
   mongo
   ```

3. **Database Connection**

   Make sure your MongoDB connection string is in `.env`:

   ```
   MONGODB_URI=mongodb://localhost:27017/redditscheduler
   ```

4. **Troubleshooting**

   - **Connection Issues**: Make sure MongoDB is running
   - **Schema Errors**: Check your model files for errors

## Coding Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow existing code style and patterns
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic, but write self-documenting code where possible

### JavaScript Guidelines

- Use modern JavaScript features
- Follow Prettier configurations
- Use async/await for asynchronous operations
- Properly handle errors and edge cases
- Use proper error handling for Reddit API calls

### React Guidelines

- Use functional components and hooks
- Keep components small and focused
- Follow React best practices for performance
- Implement responsive design with Tailwind CSS
- Use DaisyUI components where appropriate

## Documentation

- Update README.md if needed
- Document new features and APIs
- Add comments for complex logic

## Areas of Contribution

- 📅 Post Scheduling Features
- 📊 Analytics and Insights
- 🎨 UI/UX Improvements
- 🔒 Security Enhancements
- ⚡ Performance Optimizations
- 📝 Documentation
- 🐛 Bug Fixes
- ✨ New Features

## Community

- Join our discussions in GitHub Issues
- Help others in the community
- Share your ideas and feedback
- Be respectful and inclusive
- Follow our Code of Conduct

## Questions or Need Help?

If you have questions or need help, you can:

1. Check our documentation
2. Open a GitHub issue
3. Join our community discussions

---

Thank you for contributing to Post Content! Your actions help make Reddit content management more efficient and effective. 

If you have any questions or need help, please feel free to ask in the issues section.

https://t.me/yatemez or https://x.com/tech_nurgaliyev
