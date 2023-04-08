import {Request, Response} from "express";
import {child, database, onValue, push, ref, remove, set, update} from "../../firebaseService";

const createParticipants = async (req: Request, res: Response) => {
    try {
        const {nomeSobrenome, telefone, dtaNascimento, status} = req.body;
        const idEvent = req.params.id;
        const idCategory = req.params.idCat;
        const idParticipants = push(child(ref(database), `eventos/${idEvent}/categoriasObj/${idCategory}/participantes`)).key;

        await set(ref(database, `eventos/${idEvent}/categoriasObj/${idCategory}/participantes/${idParticipants}`), {
                idParticipants,
                nomeSobrenome,
                telefone,
                dtaNascimento,
                status
            }
        );
        res.status(200).json({status: 'ITEM_CREATED'});

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}
const _deleteParticipants = async (req: Request, res: Response) => {
    try {
        const idEvent = req.params.id;
        const idCategory = req.params.idCat;
        const idParticipants = req.params.idParticipants;

        await remove(ref(database, `eventos/${idEvent}/categoriasObj/${idCategory}/participantes/${idParticipants}`));
        res.status(200).json({status: 'Participants_DELETE'})

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
            snapshot.forEach((elem) => {
                allParticipants.push(elem.val())
            });
        });
        res.status(200).json(allParticipants);

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'});
    }
}
const validateParticipants = async (req: Request, res: Response) => {
    try {
        const idEvent = req.params.id;
        const idCategory = req.params.idCat;
        const idParticipants = req.params.idParticipants;
        const actualization = {status: 1};

        await update(ref(database, `eventos/${idEvent}/categoriasObj/${idCategory}/participantes/${idParticipants}`), actualization);
        res.status(200).json({status: 'ITEM_UPDATE'})

    } catch {
        res.status(500).json({status: 'INTERNAL_ERROR'})
    }
}

export default {
    createParticipants,
    _deleteParticipants,
    getAllParticipants,
    validateParticipants
}