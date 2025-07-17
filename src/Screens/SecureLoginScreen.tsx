import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

interface LoginValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: LoginValues = { email: '', password: '' };
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const token = '1234567890';
      await SecureStore.setItemAsync('toeken', token);
      setIsLoading(false);
      Alert.alert('Success', 'Login Successful', [
        {
          text: 'Ok',
          onPress: () => {
            navigation.navigate('Home' as never);
          },
        },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          handleBlur,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button
                title="Login"
                onPress={handleSubmit as any}
                disabled={isLoading}
              />
            )}
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
