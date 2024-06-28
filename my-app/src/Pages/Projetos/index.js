import React, { useEffect, useState } from 'react'
import {Text, View, TouchableOpacity, FlatList, StyleSheet} from 'react-native'

import ComponenteProjeto from './ComponenteProjeto'
//--------------
import {SelectAll} from '../../Servicos/projetosApi'
import { useIsFocused } from '@react-navigation/native'

export default function Projetos({navigation, route}){

    const [projeto, setProjeto] = useState([])
    const telaAtiva = useIsFocused()

    useEffect(
        ()=>{
            async function carregarDados(){
                const resultado = await SelectAll();
                setProjeto(resultado)
                console.log(projeto);
            }
            carregarDados()
        }, [telaAtiva]
    )



    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Projetos</Text>

            <FlatList

                data={projeto}
                keyExtractor={item => item.id}
                renderItem={({item}) => (<ComponenteProjeto {...item} />)}
                // renderItem={({item}) => {<ComponenteProjeto {...item} />}}<<< ERRO
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    titulo:{
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: '25'
    }
})