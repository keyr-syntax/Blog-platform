<h1 align="center">Welcome to Syntax Blog 👋</h1>

Syntax Blog is an advanced blog platform built by using React/Vite, React-Bootstrap, node.js/Express and MySQL database.
see live demo here: https://syntax-blog-platform-project.keyrunasir.com

This advanced blog platform has the following features:-
1. Create, edit, and delete blog posts.
2. A commenting system for posts.
3. Tags for post categorization.
4. Integrated TinyMCE Rich Text Editor for writing and formatting posts.
5. Jason web token based user authentication and profile management.
6. Integrated Chart.js for visualizing blog analytics, including views, likes, and shares.
7. AI Integration: Leverages ChatGPT in the blog editor to help users generate content or brainstorm ideas.
8. Personalized reading lists: Users can save blogs to read later.
9. Blog scheduling: Bloggers can schedule posts for future publication.
10. Media gallery: Bloggers can upload and store images for use in their blogs.

## Usage

## First clone the repository into your Laptop
```sh
https://github.com/keyr-syntax/Blog-platform.git
```

## Inside the backend folder fill the following values in .env file.

```sh
OPENAI_API_KEY=your-openai-api-key
DB_NAME=MySQL database name
DB_USER=MySQL database user
DB_PASSWORD=MySQL database password
DB_HOST=localhost
DB_DIALECT=mysql
TOKEN_SECRET="your JWT token secret"
cloud_name=cloudinary name for image storage
api_key=cloudinary api key
api_secret=cloudinary secret
```


## Navigate to 'backend' folder and run the following
```sh
npm install
```
## After package installation is complete, run the following to start the backend server
```sh
npm start
```

## Check if the express server is working by visiting the following URL. If your App is working, you will get success message.

```sh
http://localhost:5000/
```

## Navigate to 'frontend' folder and run the following
```sh
npm install
```
## After package installation is complete, run the following to start your react App
```sh
npm run dev
```
## Now your App will run smoothly. Enjoy!

## Author

👤 **keyru Nasir**

---
