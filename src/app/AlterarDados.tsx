import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../hooks/useAuth';

type User = {
  nome: string;
  email: string;
  password: string;
};

export default function AlterarDados() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }
    setNome((user as User).nome || '');
    setEmail(user.email || '');
    setPassword(user.password || '');
  }, [user]);

  const handleUpdate = async () => {
    if (!nome || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    if (!email.includes('@') || email.split('@')[1].length === 0) {
      Alert.alert('Erro', 'Digite um email válido!');
      return;
    }
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      // Atualiza os dados do usuário logado
      const updatedUsers = users.map((u: User) =>
        u.email === user!.email ? { ...u, nome, email, password } : u
      );
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      Alert.alert('Sucesso', 'Dados atualizados!');
      router.replace('/');
      signOut();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Dados</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#DC2626',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    height: 36,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'System',
  },
});
