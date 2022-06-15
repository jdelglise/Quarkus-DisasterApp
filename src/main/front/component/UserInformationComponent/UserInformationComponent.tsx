import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput} from "react-native";
import { Button, Card, Switch } from "react-native-elements";
import { getUserPreferences } from "../../shared/api";
import { components } from "../../shared/models";
import { updateUser } from "../../shared/api";
type User = components["schemas"]["User"];



export default function UserInformationComponent(props: {object: User}) {
  const [editable, setEditable] = useState(false)
return(<Card>
      <Card.Title>User information</Card.Title>
      <Card.Divider />
      <View>
        <Text>Firstname</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.firstName}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.firstName = text
            }}
        />
      </View>
      <View>
        <Text>Lastname</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.lastName}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.lastName = text  
            }}
        />
      </View>
      <View>
        <Text>Login</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.login}
            editable={false}
        />
      </View>
      <View>
        <Text>Email</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.email}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.email = text
            }}
        />
      </View>
      <View>
        <Text>Phonenumber</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.phoneNumber}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.phoneNumber = text  
            }}
        />
      </View>
      <View>
        <Text>Birthdate</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.birthdate}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.birthdate = text  
            }}
        />
      </View>
      <View>
        <Text>City</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.addressList[0]?.city}
            editable={editable}
            onChangeText = {(text)=>{
              props.object.addressList = [{}]
            }}
        />
      </View>
      <View>
        <Text>Country</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.addressList[0]?.country}
            editable={false}
        />
      </View>
      <View>
        <Text>Number</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.addressList[0]?.number}
            editable={false}
        />
      </View>
      <View>
        <Text>PostCode</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.addressList[0]?.postCode}
            editable={false}
        />
      </View>
      <View>
        <Text>Street</Text>
        <TextInput
            style={styles.field}
            defaultValue={props.object?.addressList[0]?.street}
            editable={false}
        />
      </View>
     
    {editable?(
      <Button
      onPress={() =>
        {
          updateUser(props.object)
        }
      }
      title="Confirm"
    />
    ):null}
    {editable?(
      <Button
        onPress={() =>
          {
            setEditable(false);
          }
        }
        title="Cancel"      
      />
    ):null}
    {!editable?(
      <Button
      onPress={() =>
        {
          setEditable(true)
        }
      }
      title="Edit informations"
    />):null}
    </Card>)
}

const styles = StyleSheet.create({
    field: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });