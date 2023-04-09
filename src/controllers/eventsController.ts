import {Request, Response} from "express";
import {child, database, get, onValue, push, ref, remove, set, update} from "../../firebaseService";
import dotenv from 'dotenv';

dotenv.config();
const createEvent = async (req: Request, res: Response) => {
    try {
        const {nomeEvento, horario, data, categorias, descricao, status, prazo, local} = req.body;

        const categoriasObj = JSON.parse(categorias);

        const id = push(child(ref(database), 'eventos')).key;

        await set(ref(database, "eventos/" + id), {
            id,
            nomeEvento,
            data,
            horario,
            descricao,
            status,
            prazo,
            local,
            categoriasObj
        })
        res.redirect(`${process.env.FRONTEND}evento/${id}`);
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const getAllEvents = async (req: Request, res: Response) => {
    try {
        const allEvents: object[] = [];

        const eventsRef = ref(database, "eventos/");

        onValue(eventsRef, (snapshot) => {
            snapshot.forEach((elem) => {
                allEvents.push(elem.val())
            });
        });

        res.status(200).json(allEvents);

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'});
    }
}

const getOneEvent = async (req: Request, res: Response) => {

    try {
        const id = req.params.id;
        get(child(ref(database), `eventos/${id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const event = snapshot.val()
                    res.status(200).json(event)
                } else {
                    res.status(400).json({status: 'ITEM_NOT_FOUND'})
                }
            })

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const _deleteEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await remove(ref(database, `eventos/${id}/`));
        res.status(200).json({status: 'EVENT_DELETE'})
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const updateStatusEvent = async (req: Request, res: Response) => {
    try {
        const {id, status} = req.params;
        await update(ref(database, `eventos/${id}`), {status: status});
        res.status(200).json({status: 'ITEM_UPDATE'});
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const getNameCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const idCategory = req.params.idCat;

        get(child(ref(database), `eventos/${id}/categoriasObj/${idCategory}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const event = snapshot.val().nome
                    res.status(200).json(event)
                } else {
                    res.status(400).json({status: 'ITEM_NOT_FOUND'})
                }
            })

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }

}
export default {
    createEvent,
    getAllEvents,
    getOneEvent,
    _deleteEvent,
    updateStatusEvent,
    getNameCategory
}