import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const requestData = {
        Email: email,
        Senha: password,
        Opcoes: '3'
      };

      const response = await axios.post('https://estudefacil.azurewebsites.net/api/UsuariosApi/LoginApiJson', requestData);

      if (response.data && response.data.permissoes === "3") {
        const { id, caminhoFoto, nome } = response.data.usuario;
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        console.log(nome);
        console.log(caminhoFoto);
        console.log(id);
        // Navegue para a tela Home passando os dados do usuário como parâmetro
        navigation.navigate('Home', { usuario: { nome: nome, caminhoFoto: caminhoFoto, id:id } });
      } 
      else {
        Alert.alert('Erro', 'Email ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Algo deu errado. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar com seu login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#010AE6',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  btn: {
    backgroundColor: '#010AE6',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
