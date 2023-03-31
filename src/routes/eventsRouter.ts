import express from "express";
import eventsController from "../controllers/eventsController";

const eventsRouter = express.Router()

eventsRouter.post('/events', eventsController.create);

eventsRouter.get('/events', eventsController.getAll);

eventsRouter.get('/events/:id', eventsController.getOne);

eventsRouter.put('/events/:id', eventsController.edit);

eventsRouter.delete('/events/:id', eventsController._delete );

export default eventsRouter;