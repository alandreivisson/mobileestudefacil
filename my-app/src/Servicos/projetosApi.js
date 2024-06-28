import api from "./api"

export async function SelectAll(){
    try {
        const resultado = await api.get('/user')
        return resultado.data
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function SelectId(id){
    try{
        const resultado = await api.get(`/user/${id}`)
        return resultado.data
    }catch(error){
        console.log(error)
        return[]

    }
}

export async function insert(name,image,projetc){
    try{
        await api.post('/user', {
            name: name,
            image: image,
            projetc: projetc
        })

        return 'sucesso'
    }catch(error){
        console.log(error);
        return 'erro'
    }
}

export async function update(id, name, image, projetc){
    try{
        await api.put(`/user/${id}`,{
            name : name,
            image: image,
            projetc: projetc,
            id: id
        })
        return 'sucesso'
    }catch(error){
        console.log(error);
        return 'erro'
    }
}

export async function deleteuser(id){
    try{
        await api.delete(`/user/${id}`)
        return 'sucesso'
    }catch(error){
        console.log(error);
        return 'erro'
    }
}