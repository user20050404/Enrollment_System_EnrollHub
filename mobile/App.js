
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import AddStudentScreen from './src/screens/AddStudentScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import AddSubjectScreen from './src/screens/AddSubjectScreen';
import SectionsScreen from './src/screens/SectionsScreen';
import AddSectionScreen from './src/screens/AddSectionScreen';
import EnrollmentsScreen from './src/screens/EnrollmentsScreen';
import AddEnrollmentScreen from './src/screens/AddEnrollmentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: 16 },
  headerBackTitleVisible: false,
};

function MainTabs() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      ...headerStyle,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray400,
      tabBarStyle: { borderTopColor: colors.gray200, paddingBottom: 4, height: 58 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Dashboard: focused ? 'grid' : 'grid-outline',
          Students: focused ? 'people' : 'people-outline',
          Subjects: focused ? 'book' : 'book-outline',
          Sections: focused ? 'school' : 'school-outline',
          Enrollments: focused ? 'document-text' : 'document-text-outline',
          Chatbot: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'EnrollHub', headerTitle: 'EnrollHub' }} />
      <Tab.Screen name="Students" component={StudentsScreen}
        options={({ navigation }) => ({
          headerRight: () => isAdminOrStaff ? (
            <TouchableOpacity onPress={() => navigation.navigate('AddStudent')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>
          ) : null,
        })}
      />
      {isAdminOrStaff && (
        <Tab.Screen name="Subjects" component={SubjectsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddSubject')} style={{ marginRight: 16 }}>
                <Ionicons name="add-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
      )}
      {isAdminOrStaff && (
        <Tab.Screen name="Sections" component={SectionsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddSection')} style={{ marginRight: 16 }}>
                <Ionicons name="add-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
      )}
      <Tab.Screen name="Enrollments" component={EnrollmentsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddEnrollment')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Assistant', headerTitle: 'AI Assistant' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray50 }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ ...headerStyle }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} options={{ title: 'Add Student' }} />
          <Stack.Screen name="EditStudent" component={AddStudentScreen} options={{ title: 'Edit Student' }} />
          <Stack.Screen name="AddSubject" component={AddSubjectScreen} options={{ title: 'Add Subject' }} />
          <Stack.Screen name="EditSubject" component={AddSubjectScreen} options={{ title: 'Edit Subject' }} />
          <Stack.Screen name="AddSection" component={AddSectionScreen} options={{ title: 'Create Section' }} />
          <Stack.Screen name="AddEnrollment" component={AddEnrollmentScreen} options={{ title: 'Enroll Student' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
