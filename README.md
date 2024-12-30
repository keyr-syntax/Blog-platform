This is a blog platform built using JavaScript, React/Vite, React-Bootstrap, Node.js, Express.js, and a MySQL database.

See deployed website here--> https://syntax-blog-platform-project.keyrunasir.com/

Use the following credentials if necessary username = syntax blog, email= syntax@gmail.com, password= admin


The blog platform has included all Must-Have Features, Bonus Features as well as additional Extra Features.

Must-Have Features:
  1. Create, edit, and delete blog posts.
  2. A commenting system for posts.
  3. Tags for post categorization.

Bonus Features:
  1. Integrated TinyMCE Rich Text Editor for writing and formatting posts.
  2. Passport.js for user authentication and profile management.
  3. Chart.js for visualizing blog analytics, including views, likes, and shares.

Extra Features:
  1. AI Integration: Leverages ChatGPT in the blog editor to help users generate content or brainstorm ideas.
  2. Personalized reading lists: Users can save blogs to read later.
  3. Blog scheduling: Bloggers can schedule posts for future publication.
  4. Media gallery: Bloggers can upload and store images for use in their blogs.


To run the code in your PC, use the following
1. to install dependencies use npm install
2. to run the backend, go to backend folder then write npm start
3. to run the frontend, go to frontend folder then write npm run dev

Go to the backend folder then add the following values in the .env file

OPENAI_API_KEY=your openai_api_key

DB_NAME=mySQL database name

DB_USER=mySQL database username

DB_PASSWORD=mySQL database password

DB_HOST=localhost

DB_DIALECT=mysql

TOKEN_SECRET = generate secret key for passport JWT

cloud_name=cloudinary image storage name

api_key=cloudinary api_key

api_secret=cloudinary api_secret



