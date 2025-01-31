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


## Run the Application. Navigate to the 'intern-project-backend' folder then write the following

```sh
npm run dev
```

## Check if the express server is working by visiting the following URL. If your App is working, you will get success message.

```sh
http://localhost:5000/
```

## API endpoints to create, login, logout and authorize users are given below.

## Create new user

NB: passport library with passport-jwt is used for user authentication and authorization. We use Json web Token which will be automatically stored in the browser cookies under the name "internship" whenever user signup or Login is successful.

```sh
URL: http://localhost:5000/user/create_user

Request Method: "POST"

Request Body should have username (string), email (string) and password (string). Example of request body to be sent from frontend to the backend: {
  username: "pixelflow",
  email: "pixelflow@gmail.com",
  password: "ABCabc@1234"
}

Successful Signup Response contains the following object:
 {
  success: true,
  message: "Signup Successful!",
  user: { username:"string", email:"string", password:"string" },
}

```
## Login user

Json web Token will be automatically stored in the browser cookies under the name "internship" when the user login is successful.

```sh
URL: http://localhost:5000/user/login_user

Request Method: "POST"

Request Body should have only  email  and password. Example of request body to be sent from frontend to the backend:
{
  email: "pixelflow@gmail.com",
  password: "ABCabc@1234"
}

Successful Login Response  contains the following object:
{
  success: true,
  message: "Login Successful!",
  user: { username:"string", email:"string", password:"string" },
}
```

## Logout user

Json web Token will be removed from the  browser-cookies  user Logout is successful.

```sh
URL: http://localhost:5000/user/logout_user

Request Method: "GET"

Successful Logout Response contains the following object:
{
success: true, message: "Logout successful",
}
```

## To grant  Access to protected routes (example - Dashboard)

Json web Token should be sent from browser-cookies to the backend whenever user authorization is required to give access to protected routes (Dashboard).

```sh
URL: http://localhost:5000/user/dashboard

Request Method: "GET"

Successful authorization Response contains the following object:
{
success: true,
message: "User successfully authenticated! You can access your dashboard",
}
```


## Author

👤 **keyr**

---
