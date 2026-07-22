# Bank Exam Project Documentation

## Overview
The Bank Exam project is a comprehensive examination system for banking trainees and aspirants. It simulates various types of bank exams, allowing users to practice and enhance their knowledge. The platform now features an intelligent chatbot, real-time statistics tracking with Firestore integration, and live news updates powered by RSS2 feeds.

## Features

### Core Features
- **Question Bank**: A diverse set of questions targeting different areas of banking knowledge.
- **Timed Exams**: Simulates real exam conditions with timed sessions.
- **Performance Tracking**: Provides analytics on your performance to help identify strengths and weaknesses.
- **User Accounts**: Allows users to create accounts to save progress and keep track of their examinations.

### New Features
- **Chat Bot**: An intelligent conversational assistant to help users with exam preparation, answer queries, and provide guidance on banking topics.
- **Real-time Counter with Firestore**: Live statistics and analytics dashboard that tracks user progress, exam attempts, and performance metrics in real-time using Google Firestore database.
- **Live News Updates (RSS2)**: Integrated RSS2 feed reader to deliver the latest banking and financial news updates directly within the application, keeping users informed about market trends and news.

## Project Structure
- `src/`: Contains the core application code.
  - `components/`: React components including chatbot, counter, and news feed components.
  - `services/`: Backend services for Firestore integration and RSS2 feed parsing.
  - `pages/`: Application pages and views.
- `docs/`: Documentation files and guides.
- `tests/`: Contains unit tests for the application.
- `assets/`: Where media files like images and icons are stored.

## Technology Stack
- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: Google Firestore
- **Real-time Updates**: Firestore Real-time Listeners
- **News Integration**: RSS2 Feed Parser
- **Chat Bot**: Integrated conversational AI
- **Package Manager**: npm

## Usage

### Installation
```bash
# Clone the repository
git clone https://github.com/raghavendra-exp/bankexamv2.git

# Navigate to project directory
cd bankexamv2

# Install dependencies
npm install

# Set up Firebase/Firestore credentials
# Create a .env file and add your Firebase configuration
```

### Running the App
```bash
# Start the development server
npm start

# The application will launch at http://localhost:3000
```

### Features Usage

#### Taking an Exam
1. Navigate to the exams section
2. Choose an exam from the question bank
3. Start the timed exam session
4. Complete all questions and submit

#### Using the Chat Bot
- Click the chat icon to open the chatbot interface
- Ask questions related to banking concepts, exam preparation, or specific topics
- Receive instant responses and helpful guidance

#### Viewing Real-time Counter
- Access the dashboard to view live statistics
- Track your exam attempts, scores, and performance metrics
- Data is automatically synced with Firestore for persistent storage

#### Staying Updated with Live News
- Check the News section to view the latest banking and financial news
- RSS2 feeds are updated regularly with breaking news and market updates
- Filter news by category or source

### Viewing Results
After finishing an exam, users can view:
- Detailed score analysis
- Performance analytics
- Area-wise performance breakdown
- Comparison with previous attempts

## Configuration

### Firestore Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Add your credentials to the `.env` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   ```

### RSS2 Feed Configuration
Configure RSS feeds in `src/config/newsFeeds.js`:
```javascript
const newsFeeds = [
  'https://example.com/banking-news/feed',
  'https://example.com/finance-updates/rss2',
  // Add more RSS2 feeds as needed
];
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a pull request for review

## Troubleshooting

### Firestore Connection Issues
- Verify Firebase credentials in `.env`
- Check Firestore database rules allow read/write access
- Ensure internet connection is stable

### Chat Bot Not Responding
- Check backend service is running
- Verify API endpoints are correctly configured
- Clear browser cache and restart the application

### RSS2 Feed Not Updating
- Verify RSS feed URLs are accessible
- Check feed URL format and validity
- Ensure network connectivity

## License
This project is licensed under the MIT License.

## Support
For issues, feature requests, or questions, please open an issue on the [GitHub repository](https://github.com/raghavendra-exp/bankexamv2/issues).

---

**Last Updated**: July 2026
