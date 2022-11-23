import { Request, Response, NextFunction } from 'express'

const express = require("express")
const fs = require('fs')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 2691

app.post("/create", (req: Request, res: Response) => {

});

 /* Return Current Playlist from Pi */
app.get("/playlist", async (req: Request, res: Response) => {
    // res.json({ message: "Hello from server!" })
    const path: string = __dirname + '/audio'
    let files = fs.readdirSync(path).filter((file: string) => !file.endsWith('.bin') && !file.startsWith('.'))
    res.send({files})
  });

/* Return song to be played */
app.get('/audio/:filename', async (req: Request, res: Response) => {
  res.sendFile(__dirname + `/audio/${req.params.filename}`)
});




  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
  });