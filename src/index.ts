import express from 'express';
import cors from 'cors'
import eventsRouter from "./routes/eventsRouter";
// Serve port
const PORT = process.env.PORT || 4000
// Serve host
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
// App Express
const app = express()
// JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Endpoint source
app.get('/', (req: any, res: any) => {
    res.send('Welcome!')
})
// Cors
app.use(cors({
    origin: ['http://localhost:3000']
}))

//Rotas
app.use('/api/', eventsRouter)
// Default response to any other requests:
app.use((req: any, res: any) => {
    res.status(404)
})
// Start the server
app.listen(PORT, () => {
    console.log(`Serve running successfully ${HOSTNAME}:${PORT}`)
})