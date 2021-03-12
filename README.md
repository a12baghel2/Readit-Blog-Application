# Read _it_ :- A mardown blog website with user authentication

---

## Description

Read _it_ is a simple markdown blog application where you can write blog using markdown. The user interface is simple to use. You can write, edit and delete an article.
The backend is written in **Express** and the database used is **mongoDB**. **MongoDB** is a *NoSQL* database and **Express** is very popular in writing the web backend. And the template engine used for rendering the views is **ejs**. For the user authentication and authorization this application uses **Passport.js**, a popular middleware for this. The styling is done using **Bootstrap**. This project uses **bcrypt.js** for password encryption and **hapi/joi** for input validation so that inputs are correctly entered.

## Features
 - Simple Blog Platform 
 - Uses Markdown
 
 ## Dependecy
  - Node.js - `v12.10.0`
  - Express - `v4.17.1`
  - Passport - `v0.4.1`
  - Mongoose - `v5.11.15`
  - Ejs - `v3.1.6`
  - bcryptjs - `v2.4.3`
  - @hapi/joi - `v17.1.1`
  
  
  ## Development 
  To run in your local dev environment, do this
  ```shell
   npm i
   npm start
   ```
