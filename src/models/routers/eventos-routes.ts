import express from "express";
import { database, onValue, ref, set, get, child, push, update, remove } from "../../../firebaseService";
import Item from "../item";

const eventosRouter = express.Router()

eventosRouter.post('/eventos', (req, res) => {

    const { nomeEvento, horario, data, categorias, descricao, status } = req.body;

    var categoriasObj= JSON.parse(categorias);

    const id = push(child(ref(database), 'eventos')).key;

    set(ref(database, "eventos/" + id), {
        id,
        nomeEvento,
        data,
        horario,
        descricao,
        status,
        categoriasObj
    })
    .then(()=>{
        res.redirect(302, 'http://localhost:3000/');
    }).catch((error)=>{
        res.json(error);
    })
})

eventosRouter.get('/eventos', (req, res) => {

    const dataRetorno : object[] = [];

    const users = ref(database, "eventos/");
    onValue(users, (sanpshot) => {
        sanpshot.forEach((elem) => {
            const dataFilho = elem.val()
            dataRetorno.push(dataFilho)
        });;
    })

    res.json(dataRetorno)

})

eventosRouter.get('/eventos/:id', (req, res) => {

    const id = "fmsf6dsd55";

    get(child(ref(database), `user/${id}`))
        .then(
            (sanpshot) => {
                if (sanpshot.exists()) {
                    res.json(sanpshot.val())
                } else {
                    res.json(404)
                }
            })
        .catch((error) => {
            res.json(error)
        })
})

eventosRouter.put('/eventos/:id', (req, res) => {
    // const id: number = +req.params.id
    // res.status(204).send()

    const id = "fmsf6dsd55";

    const updates = {
        "user/fmsf6dsd55/contato": "Paulo",
        "user/fmsf6dsd55/nome": "Paulo"
    };
    update(ref(database), updates)
        .then(
            () => {
                res.status(200).send()
            }
        ).catch(
            (error) => {
                res.status(404).send(error)

            }
        );
})

eventosRouter.delete('/eventos/:id', (req, res) => {
    const id = "fmsf6dsd55"
    const refLocal = ref(database, `user/${id}`);
    res.json(ref(database, `user/${id}`).ref);

    // refLocal.remove
    // ref(database, `user/${id}`).remove()

    // get(child(ref(database), `user/${id}`)).then((r)=>{
    //     remove(ref)
    // })
    remove(ref(database, `user/${id}`))

    res.send(`Apaga o item ${id}`)
})


// https://medium.com/@eldes.com/tutorial-aplica%C3%A7%C3%A3o-rest-api-com-node-em-typescript-usando-express-e-sqlite-a4ea6a7c3563
export default eventosRouter