
import express from 'express';
import itensRouter from "./models/routers/itens-router";

import cors from 'cors'
import eventosRouter from './models/routers/eventos-routes';
// Porta do servidor
const PORT = process.env.PORT || 4000
// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
// App Express
const app = express()
// JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Endpoint raiz
app.get('/', (req:any, res:any) => {
    res.send('Bem-vindo!')
})
// Cors
app.use(cors({
    origin: ['http://localhost:3000']
}))

//Rotas
app.use('/api', itensRouter)
app.use('/api/admin', eventosRouter)
// Resposta padrão para quaisquer outras requisições:
app.use((req:any, res:any) => {
    res.status(404)
})
// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`)
})