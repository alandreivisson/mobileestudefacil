// Arquivo Notificacoes.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

const Notificacoes = ({ route }) => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  // Função para buscar as notificações do usuário
  const fetchNotificacoes = async () => {
    try {
      const response = await axios.post('https://estudefacil.azurewebsites.net/api/UsuariosApi/NotificacoesJson', {
        id: route.params.id // id do usuário passado via parâmetro de rota
      });
      setNotificacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  // Função para fechar uma notificação
  const fecharNotificacao = async (idNotificacao) => {
    try {
      const response = await axios.post('https://estudefacil.azurewebsites.net/api/UsuariosApi/FecharNotificacao', {
        id: idNotificacao
      });
      if (response.data.status) {
        // Se fechou com sucesso, atualiza a lista de notificações removendo a notificação fechada
        setNotificacoes(notificacoes.filter(notif => notif.id !== idNotificacao));
      } else {
        console.error('Erro ao fechar notificação:', response.data.status);
      }
    } catch (error) {
      console.error('Erro ao fechar notificação:', error);
    }
  };

  // Função para renderizar cada item de notificação
  const renderNotificacao = ({ item }) => {
    return (
      <View style={styles.notificacao}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <TouchableOpacity onPress={() => fecharNotificacao(item.id)}>
          <Text style={styles.fechar}>Fechar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <FlatList
        data={notificacoes}
        renderItem={renderNotificacao}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notificacao: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  descricao: {
    fontSize: 16,
    flex: 1,
  },
  fechar: {
    color: '#FF0000',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Notificacoes;
