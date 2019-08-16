"use strict";

// Require variables
const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override");

// Express settings
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongoose settings
mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true });
const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  category: String,
  date: { type: Number, default: Date.now() },
});
const Post = mongoose.model("Post", postSchema);
// Mongoose settings to avoid deprecation warnings
mongoose.set("useFindAndModify", false);

// Post.create({
//   title: "Post 1",
//   body: "post 1 title",
//   category: "cat1",
// });

// Routes
app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    err ? res.send("Error!") : res.render("home", { posts });
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/", (req, res) => {
  const newPost = req.body.post;
  Post.create(newPost, (err, newPost) => {
    err ? res.render("Error!") : res.redirect(`/${newPost.id}`);
  });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  Post.findById(id, (err, post) => {
    err ? res.send("Error") : res.render("post", { post });
  });
});

app.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  Post.findById(id, (err, post) => {
    err ? res.send("Error") : res.render("edit", { post });
  });
});

app.put("/:id", (req, res) => {
  const id = req.params.id;
  const postUpdated = req.body.post;

  Post.findByIdAndUpdate(id, postUpdated, (err, updatedBlog) => {
    err ? res.send("Error") : res.redirect(`/${updatedBlog.id}`);
  });
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;

  Post.findByIdAndRemove(id, err => {
    err ? res.send("Error") : res.redirect("/");
  });
});

// Listen port to Express
app.listen(port, () => console.log("Server is running..."));
