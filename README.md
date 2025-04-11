# Reddit Scheduler

An Open-Source Reddit Post Scheduler for Best Engagement

## What is Reddit Scheduler?

Reddit Scheduler is an open-source tool that helps Reddit users optimize their post timing for maximum engagement. Our goal is to help content creators and marketers reach their target audience at the most effective times.

## Why Reddit Scheduler?

Most Reddit scheduling tools are either **closed-source**, **expensive**, or **lack advanced features**. Reddit Scheduler is different:

- ✅ **Open-Source** – Transparent and community-driven development
- 🕒 **Smart Scheduling** - Best posting times
- 🔒 **Privacy Focused** – Your posts, your data. No tracking, no selling, no middlemen.
- ⚙️ **Easy to Use** – Simple and intuitive interface
- 📊 **Analytics** – Track post performance and engagement
- 🚀 **Developer-Friendly** – Built with extensibility in mind

## Tech Stack

Reddit Scheduler is built with modern and reliable technologies:

- **Frontend**: Next.js, React, Javascript, TailwindCSS, DaisyUI
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Authentication**: Reddit OAuth

## Getting Started

### Prerequisites

**Required Versions:**
- [Node.js](https://nodejs.org/en/download) (v18 or higher)
- [NPM](https://www.npmjs.com/get-npm) (v10 or higher)

### Setup

1. **Clone and Install**
   ```npm
   # Clone the repository
   git clone https://github.com/NurgaliyevS/redditscheduler
   cd redditscheduler

   # Install dependencies
   npm install
   ```

2. **Set Up Environment**
   - Copy `.env.example` to `.env`
   - Configure your environment variables (see below)

3. **Start the App**
   ```npm
   npm run dev
   ```

4. **Open in Browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Reddit OAuth
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_REDIRECT_URI=http://localhost:3000/api/auth/callback/reddit

# Database
MONGODB_URI=mongodb://localhost:27017/redditscheduler
```

### Reddit OAuth Setup

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new application
3. Set the redirect URI to: `http://localhost:3000/api/auth/callback/reddit`
4. Copy the client ID and client secret to your `.env` file

## Features

- **Smart Post Scheduling**: Schedule posts for optimal engagement times
- **Post Performance Tracking**: Monitor your post engagement
- **Cross-Posting**: Easily cross-post content to multiple subreddits

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Later for Reddit](https://laterforreddit.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)
