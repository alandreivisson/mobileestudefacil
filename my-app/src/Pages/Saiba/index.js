import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';

const Detalhes = ({ route }) => {
  const { id } = route.params; // Supondo que 'id' seja o parâmetro correto, substitua por TematicaId se necessário
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando requisição com id:', id);
        const response = await axios.post('https://estudefacil.azurewebsites.net/api/HomeApi/DetalhesJson', {
          TematicaId: id, // Certifique-se de passar o parâmetro correto
        });
        console.log('Dados do usuário recebidos:', response.data); // Verifica os dados recebidos

        if (response.data && response.data.length > 0) {
          setUsuario(response.data[0]); // Acessar o primeiro objeto do array
        } else {
          setUsuario(null);
        }
      } catch (error) {
        setError('Erro ao buscar os detalhes');
        console.error('Erro ao buscar os detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.center}>
        <Text>Dados não encontrados</Text>
      </View>
    );
  }

  const formatPhoneNumber = (number) => {
    const phoneNumber = number.toString();
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7)}`;
  };
  const getFullPhotoUrl = (relativePath) => {
    const baseUrl = 'https://estudefacil.azurewebsites.net';
    return `${baseUrl}${relativePath}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
      <Image
                  source={{ uri: getFullPhotoUrl(usuario.usuarioCaminhoFoto) }}
                  style={styles.image}
                />
        <Text style={styles.titulo}>{usuario.usuarioNome}</Text>
        <Text style={styles.info}>Email: {usuario.usuarioEmail}</Text>
        {usuario.telefone && (
          <Text style={styles.info}>Telefone: {formatPhoneNumber(usuario.telefone)}</Text>
        )}
        <Text style={styles.sectionTitle}>Minha Experiência</Text>
        <Text style={styles.info}>{usuario.biografia}</Text>
        <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        <Text style={styles.info}>Temática: {usuario.tematicaDescricao}</Text>
        <Text style={styles.info}>Categoria: {usuario.categoriaDescricao}</Text>
        <Text style={styles.info}>Modelo: {usuario.modeloDescricao}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default Detalhes;
