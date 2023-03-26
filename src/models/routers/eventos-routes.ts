import express from "express";
import { database, onValue, ref, set, get, child, push, update, remove } from "../../../firebaseService";
import Item from "../item";

const eventosRouter = express.Router()

eventosRouter.post('/eventos', (req, res) => {
    const userId = "fmsf6dsd55";
    const nome = "fmsf655";
    const cotato = "fmsf655";
    const mesa = "fmsf655";

    get(child(ref(database), `user/${userId}}`))
        .then(
            (sanpshot) => {
                if (sanpshot.exists()) {
                    console.log("Ja exite parça");
                    
                    res.json("existe")
                } else {
                    set(ref(database, "user/" + userId), {
                        cotato,
                        nome,
                        mesa,
                    }).then(() => {
                        res.json(200)
                    }).catch((error) => {
                        res.json(error)
                    })
                }
            })
        .catch((error) => {
            res.json(error)
        })


    // const item: Item = req.body
    // //TODO: Criar e salvar um novo item
    // const id = 123
    // res.status(201).location(`/eventos/${id}`).send()
})

eventosRouter.get('/eventos', (req, res) => {

    const users = ref(database, "user/");
    onValue(users, (sanpshot) => {
        const data = sanpshot.val();
        res.json(data)
    })

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