import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addMedicalConditions, removeMedicalCondition } from '../../redux/actions/registerActions';
import { useNavigation } from '@react-navigation/native';
import { SERVER_BASE_URL } from '@env';
import { useTranslation } from 'react-i18next';
import BackButton from './LoginButton';
import { MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const MedicalConditionsComponent = ({ onStepChange }) => {
  const [newCondition, setNewCondition] = useState('');
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.register.userData);
  const address = useSelector((state) => state.register.addressData);
  const medicalConditions = useSelector((state) => state.register.medicalConditions);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const data = {
    fname: user.firstname,
    lname: user.lastname,
    email: user.email,
    password: user.password,
    phone: address.phoneNumber,
    address: {
      country: address.country,
      city: address.city,
      street: address.street,
      buildingNumber: address.buildingNumber,
      floor: address.floor,
      apartmentNumber: address.apartmentNumber,
      comments: address.additionalNotes,
    },
    dateOfBirth: address.dateOfBirth,
  };

  const handleSelectConditions = (condition) => {
    if (!medicalConditions.includes(condition)) {
      dispatch(addMedicalConditions(condition));
    }
    setNewCondition('');
  };

  const GoToLoginPage = async () => {
    const clientData = await insertClientDataIntoDB(data);
    if (clientData) {
      const medicalConditionsInserted = await insertmedicalConditionsInDB(clientData._id);
      if (medicalConditionsInserted) {
        navigation.navigate('Home');
      }
    }
  };

  const insertClientDataIntoDB = async (ClientData) => {
    try {
      return await axios
        .post(`${SERVER_BASE_URL}/api/patients//add-patient/`, ClientData)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error);
          throw error;
        });
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const insertmedicalConditionsInDB = async (patient_id) => {
    const url = `${SERVER_BASE_URL}/api/medicalConditions/add-medical-conditions/`;
    const data = { patient: patient_id, medicalConditions: medicalConditions };

    try {
      const response = await axios.post(url, data);
      console.log('response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const removeCondition = (conditionToRemove) => {
    dispatch(removeMedicalCondition(conditionToRemove));
  };

  const renderConditions = () => {
    return (
      <View style={styles.conditionsListContainer}>
      <Text style={styles.conditionsListTitle}>Selected Medical Conditions:</Text>
      {medicalConditions.map((condition, index) => (
        <View key={index} style={styles.conditionItem}>
          <Text style={styles.conditionText}>{condition}</Text>
          <TouchableOpacity
            style={styles.removeButtonContainer}
            onPress={() => removeCondition(condition)}
          >
            <Text style={styles.removeButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>    
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <BackButton />

        <View style={styles.middleContainer}>
          <TouchableOpacity onPress={() => onStepChange(4)} style={styles.selectConditionsButton}>
            <MaterialIcons name="list" size={24} color="blue" style={styles.icon} />
            <Text style={styles.selectConditionsButtonText}>Open to select Medical Conditions</Text>
          </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("Other medical condition")}
          value={newCondition}
          onChangeText={(text) => setNewCondition(text)}
        />
        <TouchableOpacity onPress={() => handleSelectConditions(newCondition)}>
          <Text style={styles.addButton}>{t("Add")}</Text>
        </TouchableOpacity>
      </View>


          {renderConditions()}

      <TouchableOpacity style={styles.registerButton} onPress={() => GoToLoginPage()}>
        <Text style={styles.buttonText}>{t("Register")}</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrev} onPress={() => onStepChange(2)}>
          <Text style={styles.buttonText}>{t("Prev")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    maxWidth: 600,
    marginHorizontal: 'auto',
  },
  selectConditionsButton: {
    borderRadius: 5,
    padding: 15,
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'blue',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: windowWidth - 40,
  },
  selectConditionsButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    maxWidth: 600,
    width: '100%',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    color: 'blue',
    padding: 10,
  },
  conditionsListContainer: {
    marginTop: 10,
    width: '100%',
    maxWidth: 600,
  },
  conditionsListTitle: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'green',
    padding: 10,
    margin: 5,
    backgroundColor: 'transparent',
  },
  conditionText: {
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
  },
  removeButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },  
  removeButton: {
    marginLeft: 5,
    color: 'green',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: windowWidth - 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPrev: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 10,
  },
});

export default MedicalConditionsComponent;
