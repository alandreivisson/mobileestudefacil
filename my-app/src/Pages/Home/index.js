import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import axios from 'axios';
import ModalSelector from 'react-native-modal-selector';
import { useNavigation, useRoute } from '@react-navigation/native';

const Home = ({ route }) => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tematicas, setTematicas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedTematica, setSelectedTematica] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioNome, setUsuarioNome] = useState('');
  const [usuarioCaminhoFoto, setUsuarioCaminhoFoto] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [matriculaStatusMap, setMatriculaStatusMap] = useState({});
  const [showAllCards, setShowAllCards] = useState(true); // Estado para controlar se devem ser exibidos todos os cards
  const [dropdownVisible, setDropdownVisible] = useState(false); // Estado para controlar a visibilidade do dropdown

  const navigation = useNavigation();

  // Função fetchData para carregar dados iniciais
  const fetchData = async () => {
    try {
      const response = await axios.get('https://estudefacil.azurewebsites.net/api/HomeApi/IndexJson');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Função para carregar filtros
  

  // Verificar matrícula para um item específico
  const verificarMatricula = async (tematicaId) => {
    try {
      const requestData = {
        id: tematicaId,
        IdAprendiz: usuarioId
      };

      const response = await axios.post('https://estudefacil.azurewebsites.net/api/HomeApi/VerificarMatriculaJson', requestData);
      console.log('Tematica:', tematicaId);
      console.log('Aprendiz:', usuarioId);
      console.log('Resposta:', response.data.status);

      return response.data.status;
    } catch (error) {
      console.error('Erro ao verificar matrícula:', error);
      return null;
    }
  };

  // Solicitar matrícula para um item específico
  const solicitarMatricula = async (idTematicaMestre) => {
    try {
      const requestData = {
        IdTematicaMestre: idTematicaMestre,
        IdAprendiz: usuarioId
      };

      const response = await axios.post('https://estudefacil.azurewebsites.net/api/HomeApi/solicitarMatriculaJson', requestData);
      if (response.data.status === 1) {
        // Recarregar os dados após a solicitação de matrícula bem-sucedida
        fetchData(); // Isso recarrega os dados, incluindo a verificação de matrícula
      } else {
        console.log('Erro ao solicitar matrícula');
      }
    } catch (error) {
      console.error('Erro ao solicitar matrícula:', error);
    }
  };

  // Efeito para carregar dados iniciais e filtros ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  // Efeito para atualizar dados do usuário quando route.params.usuario mudar
  useEffect(() => {
    if (route.params?.usuario?.nome && route.params?.usuario?.caminhoFoto) {
      const { nome, caminhoFoto, id } = route.params.usuario;
      setUsuarioNome(nome);
      setUsuarioCaminhoFoto(caminhoFoto);
      setUsuarioId(id);
    }
  }, [route.params]);

  // Efeito para verificar a matrícula de todos os itens da lista quando os dados ou o usuário mudam
  useEffect(() => {
    if (data.length > 0 && usuarioId !== null) {
      const promises = data.map(item => {
        return verificarMatricula(item.key ?? item.id);
      });

      Promise.all(promises).then(matriculaStatuses => {
        const newMatriculaStatusMap = {};
        matriculaStatuses.forEach((status, index) => {
          newMatriculaStatusMap[data[index].id] = status;
        });
        setMatriculaStatusMap(newMatriculaStatusMap);
      }).catch(error => {
        console.error('Erro ao verificar matrículas:', error);
        // Tratar erro, se necessário
      });
    }
  }, [data, usuarioId]);

  // Função para obter URL completa da foto do usuário
  const getFullPhotoUrl = (relativePath) => {
    const baseUrl = 'https://estudefacil.azurewebsites.net';
    return `${baseUrl}${relativePath}`;
  };

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    setUsuarioNome('');
    setUsuarioCaminhoFoto('');
    setUsuarioId(null);
  };

  // Função para aplicar filtros selecionados
  const applyFilters = async () => {
    try {
      const requestData = {
        categoriaId:  null,
        tematicaId:  null,
        modeloId:  null,
        searchTerm: searchTerm || ''
      };

      const response = await axios.post('https://estudefacil.azurewebsites.net/api/HomeApi/FiltrarApiJson', requestData);
      console.log('Chegou aqui nos filtros');
      setData(response.data);
      setShowAllCards(false); // Define como falso para mostrar apenas os cards filtrados
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const applyFiltersPost = async (newData) => {
   
      try {
        const requestData = {
          categoriaId: newData.selectedCategoria,
          tematicaId: newData.selectedTematica,
          modeloId: newData.selectedModelo,
          searchTerm: newData.searchTerm || ''
        };
    
        const response = await axios.post('https://estudefacil.azurewebsites.net/api/HomeApi/FiltrarApiJson', requestData);
        setData(response.data);
        setShowAllCards(false); // Define como falso para mostrar apenas os cards filtrados
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
     
  };


  // Renderização condicional para todos os cards ou cards filtrados
  const renderCards = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    } else if (showAllCards || (!selectedCategoria && !selectedTematica && !selectedModelo && !searchTerm)) {
      // Mostra todos os cards se nenhum filtro estiver selecionado
      return (
        <FlatList
          data={data}
          renderItem={({ item }) => renderCard(item)}
          keyExtractor={item => item.id.toString()}
        />
      );
    } else {
      // Mostra apenas os cards filtrados
      return (
        <FlatList
          data={data}
          renderItem={({ item }) => renderCard(item)}
          keyExtractor={item => item.id.toString()}
        />
      );
    }
  };

  // Função para renderizar cada card individual
  const renderCard = (item) => {
    return (
      <View style={styles.card}>
        {usuarioId !== null && usuarioId !== undefined && (
          <View>
            {matriculaStatusMap[item.id] === 0 ? (
              <Text style={styles.matriculado}>Matriculado</Text>
            ) : matriculaStatusMap[item.id] === 1 ? (
              <Text style={styles.aguardando}>Pendente</Text>
            ) : (
              <TouchableOpacity onPress={() => solicitarMatricula(item.id)}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Matricular</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.boldText}>{item.tematicaDescricao}</Text>
        <View style={styles.row}>
          <Text style={styles.titulo}>{item.usuarioNome}</Text>
        </View>
        <Image
          source={{ uri: getFullPhotoUrl(item.usuarioCaminhoFoto) }}
          style={styles.image}
        />
        <View style={styles.titulo}>
          <Text style={styles.boldText}>Categoria: {item.categoriaDescricao}</Text>
        </View>
        <Text style={styles.boldText}>Modelo: {item.modeloDescricao}</Text>
        <Text style={styles.tematicaDescricao}>{item.biografia}</Text>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={() => {
            if (usuarioNome) {
              navigation.navigate('Detalhes', { id: item.id });
            } else {
              navigation.navigate('Login');
            }
          }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Saiba Mais</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {usuarioNome ? (
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
              <Image
                source={{ uri: getFullPhotoUrl(usuarioCaminhoFoto) }}
                style={styles.userImage}
              />
            </TouchableOpacity>
            <View style={styles.dropdown}>
             
              {dropdownVisible && (
  <View style={styles.dropdownMenu}>
    <Text style={styles.dropdownItem}>{usuarioNome}</Text>
    <TouchableOpacity onPress={() => {
      navigation.navigate('Notificacoes', { id: usuarioId });
      setDropdownVisible(false);
    }}>
      <Text style={styles.dropdownItem}>Notificações</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {
      handleLogout();
      setDropdownVisible(false);
    }}>
      <Text style={styles.dropdownItem}>Sair</Text>
    </TouchableOpacity>
  </View>
)}

            </View>
          </View>
        ) : (
          <View style={styles.headerLinks}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.headerButtonText}>Entrar</Text>
            </TouchableOpacity>

          
          </View>



          
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          onChangeText={(text) => {
            setSearchTerm(text);
            applyFiltersPost({
              selectedCategoria,
              selectedTematica,
              selectedModelo,
              searchTerm: text
            });
          }}
          value={searchTerm}
        />
      </View>

      <View style={styles.boldText}>
        <Text style={styles.textoInicial}>Encontre o melhor Mestre para você!</Text>
      </View>

      <View style={styles.cards}>
        {renderCards()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLinks: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 10,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 40,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdown: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'relative',
    top: 40,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: 150,
    zIndex: 1000,
  },


  
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#EFEFEF',
  },
  selector: {
    backgroundColor: '#fafafa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  selectorText: {
    fontSize: 18,
    color: '#000000',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  cards: {
    flex: 1,
    padding: 25,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  tematicaDescricao: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'justify',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  image: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#010AE6',
    width: Dimensions.get('window').width / 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerButton: {
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  matriculado: {
    fontSize: 15,
    color: '#008000'
  },
  aguardando: {
    fontSize: 15,
    color: '#FF0000'
  },
  btn: {
    backgroundColor: '#0000FF',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  textoInicial:{
    marginTop:10,
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000', // Vermelho
    textAlign:'center'
  }
});

export default Home;
