import React from 'react'

import {Text, View, TouchableOpacity, StyleSheet, Image, Alert, Dimensions, TextInput} from 'react-native'
import { deleteuser } from '../../Servicos/projetosApi'

export default function DeletarItem({navigation, route}){

    const id = route.params.id
    const name = route.params.name
    const project = route.params.project
    const image = route.params.image


    async function deletar(){
        const resultado = await deleteuser(id)

        if(resultado === 'sucesso'){
            Alert.alert("Projeto foi de Vasco!!!")
            navigation.navigate('Projetos')
        }else{
            Alert.alert("Erro ao ir de Vasco!!")
        }
    }


    return (
        <View style={styles.container}>
        <View>
        
            <Text style={styles.alerta}>O projeto irá de VASCO pra sempre!!!</Text>
            <View style={styles.imgContainer}>
                <Image source={{uri:image}} style={styles.image} />
            </View>

            <View style={styles.info}>
                <Text style={styles.titulo}>{name}</Text>
                <Text style={styles.descricao}>{project}</Text>
            </View>
        </View>   

        <View style={styles.containerButton}>
           

            <TouchableOpacity style={[styles.btn, styles.btnDeletar]} onPress={deletar}>
                <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
        </View> 
        
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    imgContainer:{
        alignItems:"center"
    },
    image:{
        width:Dimensions.get('window').width*0.5,
        height:Dimensions.get('window').width * 0.5 ,
        borderRadius:100
    },
    info:{
        width:Dimensions.get('window').width*0.8,
        marginVertical: 10,
    },
    titulo:{
        fontSize: 28,
        fontWeight: 'bold'
    },
    descricao:{
        fontSize: 18,
    },
    containerButton:{
        flexDirection: 'row'
    },
    btn:{
        width:Dimensions.get('window').width / 3,
        margin: 10,
        padding:10,
        borderRadius: 10,
        elevation: 5,
        alignItems:"center"
    },
    btnEditar:{
        backgroundColor:"#ffc107"
    },
    btnDeletar:{
        backgroundColor:"#f44336"
    },
    btnText:{
        fontSize:18
    },
    alerta:{
        textAlign:"center",
        fontSize: 28,
        color: "red",
        fontWeight: 'bold',
        marginBottom:25,

    }
})