import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

export default function ComponenteProjeto({id, name, image, project}) {

    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => {navigation.navigate("Item",{id, name, image, project})}}>
            <View style={styles.item}>
                <Image source={{uri:image}} style={styles.image} />
                <View style={styles.userInfo}>
                    <Text style={styles.userNome}>{name}</Text>
                    <Text style={styles.userProjeto}>{project}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item:{
        width:'80%',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20
    },
    image:{
        width:"15%",
        aspectRatio:1,
        borderRadius: 50,
    },
    userInfo:{
        marginLeft: 20,
    },
    userNome:{
        fontSize:20,
        fontWeight: 'bold'
    },
    userProjeto:{
        fontSize: 16
    }

})