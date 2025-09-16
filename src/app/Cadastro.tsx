import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Timer } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!nome || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    // Validação de email: deve conter '@'
    if (!email.includes('@')) {
      Alert.alert('Erro', 'Digite um email válido');
      return;
    }
    try {
      // Buscar usuários já cadastrados
      const storedUsers = await AsyncStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verificar se já existe esse email
      const userExists = users.some((user: any) => user.email === email);

      if (userExists) {
        Alert.alert('Cadastro não permitido', 'Este e-mail já está cadastrado. Por favor, utilize outro e-mail ou faça login.');
        return;
      }

      // Adicionar novo usuário
      const newUser = { nome, email, password };
      users.push(newUser);

      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.replace('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Timer size={32} color="#DC2626" style={{ marginRight: 8 }} />
        <Text style={styles.appName}>FocusTime</Text>
      </View>
      <Text style={styles.title}>Cadastro</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.link}>
        <Text>Já tem uma conta? Faça login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
    fontFamily: 'System',
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
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
  },
});