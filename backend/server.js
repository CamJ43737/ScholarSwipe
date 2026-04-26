require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

/* =======================
   TEST ROUTE
======================= */
app.get("/", (req, res) => {
    res.send("ScholarSwipe API is running");
});

/* =======================
   USER MODEL + ROUTES
======================= */
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    role: String,
    location: String
});

const User = mongoose.model("User", UserSchema);

app.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

/* =======================
   POST MODEL + ROUTES
======================= */
const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", PostSchema);

app.post("/posts", async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/posts", async (req, res) => {
    const posts = await Post.find().populate("userId");
    res.json(posts);
});

/* =======================
   COMMENT MODEL + ROUTES
======================= */
const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", CommentSchema);

app.post("/comments", async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/comments", async (req, res) => {
    const comments = await Comment.find()
        .populate("userId")
        .populate("postId");

    res.json(comments);
});

/* =======================
   START SERVER
======================= */
app.listen(5000, () => {
    console.log("Server running on port 5000");
});