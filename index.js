const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors');
const multer = require('multer')
const path = require('path')

const app = express()
const port = 8800

const route = require('./routes')
const db = require('./config/db')

db.connect()

dotenv.config()

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cors())
app.use("/images", express.static(path.join(__dirname, 'public/images')))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + file.originalname
        req.body.name = uniqueSuffix
        cb(null, uniqueSuffix)
    }
})

const upload = multer({storage})

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json(req.body.name)
    } catch (error) {
        console.log(error);
    }
})

route(app)

app.listen(port, () => {
    console.log(`Backend Server is running! at ${port}`);
})