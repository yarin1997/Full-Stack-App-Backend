const express = require('express')
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors())

const db = require('./models')


const postRouter = require("./routes/Posts");
app.use("/Posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter= require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('The server is running on port 3001')
    })
})
