import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./routes/userRouter.js"
import noteRouter from "./routes/noteRouter.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Routes
app.use("/users", userRouter)
app.use("/api/notes", noteRouter)

// Connect to MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err
    console.log("Connected to MongoDB")
  }
)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
  })
}

// Listen Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("SERVER IS RUNNING ON PORT", PORT)
})
