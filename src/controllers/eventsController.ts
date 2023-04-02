import {Request, Response} from "express";
import {child, database, get, onValue, push, ref, remove, set, update} from "../../firebaseService";
import moment from "moment";

const createEvent = async (req: Request, res: Response) => {
    try {
        const {nomeEvento, horario, data, categorias, descricao, status} = req.body;

        const categoriasObj = JSON.parse(categorias);

        const id = push(child(ref(database), 'eventos')).key;

        await set(ref(database, "eventos/" + id), {
            id,
            nomeEvento,
            data,
            horario,
            descricao,
            status,
            categoriasObj
        })

        res.status(200).json({status: 'ITEM_CREATED'});

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
        await remove(ref(database, `eventos/${id}`));
        res.status(200).json('EVENT_DELETE')
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const editEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await update(ref(database, `eventos/${id}`), updates);
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const createParticipants = async (req: Request, res: Response) => {
    try {
        const {nomeSobrenome, telefone, dtaNascimento, status} = req.body;
        const idEvent = req.params.id;
        const idCategory = req.params.idCat;

        get(child(ref(database), `eventos/${idEvent}/categoriasObj/${idCategory}`))
            .then(async (snapshot) => {
                if (snapshot.exists()) {
                    const idParticipants = push(child(ref(database), `eventos/${idEvent}/categoriasObj/${idCategory}/participantes`)).key;

                    await set(ref(database, `eventos/${idEvent}/categoriasObj/${idCategory}/participantes/${idParticipants}`), {
                        idParticipants,
                        nomeSobrenome,
                        telefone,
                        dtaNascimento,
                        status
                    }).then(() => {
                            res.status(200).json({status: 'ITEM_CREATED'});
                        }
                    );
                }
                if (!snapshot.exists()) {
                    res.status(400).json({status: 'ITEM_NOT_FOUND'})
                }
            })
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const getAllParticipants = async (req: Request, res: Response) => {

    try {
        const idEvent = req.params.id;
        const idCategory = req.params.idCat;
        const allParticipants: object[] = [];
        const participantsRef = ref(database, `eventos/${idEvent}/categoriasObj/${idCategory}/participantes`);

        onValue(participantsRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((elem) => {
                    allParticipants.push(elem.val())
                });
                res.status(200).json(allParticipants);
            } else {
                res.status(400).json({status: 'ITEM_NOT_FOUND'})
            }
        });

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'});
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
export default {createEvent, getAllEvents, getOneEvent, _deleteEvent, editEvent, createParticipants, getAllParticipants, getNameCategory}