 type EventModel  = {
    id?: string
    nomeEvento: string
    data: string
    horario: string
    descricao: string
    status: string
    categoriasObj: object[]
}
export default EventModel;