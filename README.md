# Job Assistant: Your Job Application Assistant

Job Assistant is an open-source application that helps you find your perfect job match by analyzing job postings and comparing them with your resume. The app extracts job details from popular platforms like LinkedIn, Indeed, Xing, and Stepstone, and uses AI to provide valuable insights about your fit for each position.

## Features

- **Automatic Job Data Extraction**: Chrome extension captures job details from popular job sites
- **AI-Powered Analysis**: Uses Gemini AI to compare job requirements with your resume
- **Comprehensive Insights**:
  - Overall match percentage
  - Missing keywords
  - Matching keywords
  - Job posting language detection
  - Foreign language requirements
  - Information about international applicant acceptance
  - Suggestions on how to improve your resume for the position
- **Application Tracking**: Monitor your application status and update as you progress
- **AI Cover Letter Generation**: Generate personalized cover letters based on your CV and job description with customizable AI prompts

## Installation Guide

This guide is designed for both technical and non-technical users. Follow these steps to set up Job Assistant on your computer.

### Prerequisites

Before starting, you need to install Node.js:

1. **Install Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the "LTS" (Long Term Support) version
   - Run the installer and follow the prompts (accept all defaults)
   - To verify installation, open Command Prompt (Windows) or Terminal (Mac/Linux) and type: `node -v`

### Setting Up the Web Application

1. **Get the Application**:

   - If you know Git: Clone the repository using `git clone [repository-url]`
   - If you don't know Git: Download the project as a ZIP file and extract it to a folder

2. **Open Command Prompt or Terminal**:

   - Navigate to the project folder (use the `cd` command)
   - Example: `cd C:\Users\YourName\Downloads\JobMatchPro`

3. **Install Dependencies**:

   - Run: `npm install`
   - Wait for all packages to be installed

5. **Set Up the Database**:

   - Run: `npm run db:migrate`

6. **Build the Application**:

   - Run: `npm run build`

7. **Start the Application**:
   - Run: `npm run start`
   - The app will be available at: http://localhost:3007

### Updating the Application

You can simply run `npm run fresh-start` if you have cloned the repo using git

### Installing the Chrome Extension

1. **Open Chrome Extension Page**:

   - Type `chrome://extensions/` in your Chrome browser address bar
   - Press Enter

2. **Enable Developer Mode**:

   - Toggle the "Developer mode" switch in the top-right corner to ON

3. **Load the Extension**:

   - Click "Load unpacked"
   - Navigate to the project folder
   - Select the `extension` folder inside the project
   - Click "Select Folder"

4. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Find the Job Assistant extension
   - Click the pin icon to keep it visible

### Configuring Your Profile

1. **Access the Web App**:

   - Open your browser and visit: http://localhost:3007

2. **Set Up Your Profile**:

   - Click on the "Profile" icon in the navigation menu
   - You'll need to add two important things:
     - Gemini API Key
     - Your Resume Content

3. **Get a Gemini API Key**:

   - Watch this tutorial: [How to Get Gemini API Key](https://www.youtube.com/watch?v=6BRyynZkvf0)
   - Follow the steps to create your free API key

4. **Add Your Resume Content**:

   - Format your resume according to the example in `resume-example.txt` file
   - Copy your resume text into the designated field

5. **Save Your Profile**:
   - Click the "Save" button to store your information

### Google Doc Resume Integration

_Documentation for connecting your Google Doc resume template will be added in a future update._

## Using Job Assistant

1. **Browse Job Sites**:

   - Visit LinkedIn, Indeed, Xing, or Stepstone
   - Find a job posting you're interested in

2. **Extract Job Details**:

   - Click the Job Assistant extension icon in your browser and click on "start"
   - The extension will extract job information and send it to your app

3. **View Analysis**:

   - Go to http://localhost:3007
   - See all your saved jobs with AI analysis
   - Review match percentage, keywords, and other insights

4. **Generate Cover Letters**:

   - For any job, you can generate a personalized cover letter
   - The AI uses your CV and the job description to create tailored content
   - Customize the AI prompt to match your writing style and preferences

5. **Track Applications**:
   - For jobs you apply to, click "Apply" to move them to your tracking list
   - Update status as you progress: "Waiting", "Invited to Interview", "Failed", or "Success"

## Technical Stack

- **Frontend**: React + Vite
- **Frontend**: Node.js + Hono framework
- **Database**: SQLite with Drizzle ORM
- **Validation**: Zod
- **AI Integration**: Gemini AI

## Troubleshooting

- **Application won't start**: Make sure you've created the `.env` file and run the database migrations
- **Extension not working**: Verify it's properly installed and you've reloaded the job posting page
- **Analysis not showing**: Check that your Gemini API key is valid and properly saved
- **Database issues**: Try running `npx drizzle-kit migrate` again to ensure all migrations are applied

## Support

If you encounter any issues or have questions, please open an issue on our GitHub repository.

---

Happy job hunting with Job Assistant! May your perfect match be just a click away.

Farhad Faraji
[My LinkedIn](https://linkedin.com/in/farhadfaraji)
farhadham2@gmail.com
