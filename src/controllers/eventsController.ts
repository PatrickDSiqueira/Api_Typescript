import {Request, Response} from "express";
import {child, database, get, onValue, push, ref, remove, set, update} from "../../firebaseService";

const create = async (req: Request, res: Response) => {
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

const getAll = async (req: Request, res: Response) => {
    try {
        const allEvents: object[] = [];

        const eventsRef = ref(database, "eventos/");

        onValue(eventsRef, (snapshot) => {
            snapshot.forEach((elem) => {
                allEvents.push(elem.val())
            });
        });

        res.status(200).json({allEvents});

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'});
    }
}

const getOne = async (req: Request, res: Response) => {

    try {
        const id = req.params.id;
        get(child(ref(database), `eventos/${id}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const event = snapshot.val()
                    res.status(200).json({event})
                } else {
                    res.status(400).json({status: 'ITEM_NOT_FOUND'})
                }
            })

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }


}

const _delete = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await remove(ref(database, `eventos/${id}`));
        res.status(200).json('EVENT_DELETE')
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

const edit = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await update(ref(database, `eventos/${id}`), updates);
    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}


export default {create, getAll, getOne, _delete, edit}