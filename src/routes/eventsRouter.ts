import express from "express";
import eventsController from "../controllers/eventsController";
import participantsController from "../controllers/participantsController";

const eventsRouter = express.Router()

eventsRouter.post('/events', eventsController.createEvent);

eventsRouter.get('/events', eventsController.getAllEvents);

eventsRouter.get('/events/:id', eventsController.getOneEvent);

eventsRouter.put('/events/:id', eventsController.editEvent);

eventsRouter.delete('/events/:id', eventsController._deleteEvent);

eventsRouter.post('/events/:id/category/:idCat/participants', participantsController.createParticipants);

eventsRouter.delete('/events/:id/category/:idCat/participants/:idParticipants', participantsController._deleteParticipants);

eventsRouter.get('/events/:id/category/:idCat/participants', participantsController.getAllParticipants);

eventsRouter.get('/events/:id/category/:idCat/name', eventsController.getNameCategory);

export default eventsRouter;