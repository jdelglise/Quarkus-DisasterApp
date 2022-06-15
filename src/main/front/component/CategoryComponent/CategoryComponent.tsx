import { useMachine } from "@xstate/react";
import {
  Center,
  CheckIcon,
  Column,
  Divider,
  Input,
  Row,
  ScrollView,
  Select,
  Button,
  Text,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet, Switch } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { createCategory } from "../../shared/api";
import { components } from "../../shared/models";
import CategoryMachine from "./CategoryMachine";
type Category = components["schemas"]["Category"];
type CustomFormField = components["schemas"]["CustomFormField"];

export default function CategoryComponent() {
  const [category, setCategory] = useState({
    name: "",
    prioriy: 0,
    expirationInDays: 0,
    type: "OFFERS",
    customFields: [{ label: "", name: "", required: false, initalValue: "" }],
  } as Category);
  const [expirationString, setExpirationString] = useState("");
  const [priorityString, setPriorityString] = useState("");
  const [open, setOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);

  const [state, send] = useMachine(CategoryMachine);
  const handleChange = (index, name, e) => {
    if (typeof e != "boolean") {
      category.customFields[index][name] = e.target?.value;
    } else {
      category.customFields[index][name] = e;
    }
  };
  const addFields = (event: any) => {
    category.customFields?.push({
      label: event.target.label,
      name: event.target.name,
      required: event.target.required,
      initalValue: event.target.initalValue,
    });
  };
  const removeFields = (index: any) => {
    if (index > 0) {
      category.customFields?.pop();
    }
  };

  const checkFields = () => {
    var expirationNum: number = +expirationString;
    var priorityNum: number = +priorityString;

    if (expirationNum == undefined || expirationNum == 0) {
      alert("expirationInDays should not be empty or equals to 0");
      return false;
    }
    if (isNaN(expirationNum)) {
      alert("expirationInDays should be a numeric value");
      return false;
    }
    if (category.name == undefined || category.name == "") {
      alert("Name should not be empty");
      return false;
    }
    if (priorityNum == undefined || priorityNum == 0) {
      alert("priority should not be empty or equals to 0");
      return false;
    }
    if (isNaN(priorityNum)) {
      alert("Priority should be a numeric value");
      return false;
    }
    if (typeValue == undefined) {
      alert("Type should not be empty");
      return false;
    }
    category.customFields?.forEach((element) => {
      if (element.label == "" || element.label == undefined) {
        alert("customfield label should not be empty");
        return false;
      }
      if (element.name == "" || element.name == undefined) {
        alert("customfield name should not be empty");
        return false;
      }
      if (element.required == undefined) {
        element.required = false;
      }
    });
    category.expirationInDays = expirationNum;
    category.prioriy = priorityNum;
    return true;
  };

  return (
    <ScrollView maxHeight={"80vh"}>
      <Center>
        <Column space={4}>
          <Row space={4}>
            <Input
              label="Name"
              width={"40vw"}
              placeholder="Name"
              onChangeText={(text) => {
                category.name = text;
              }}
            />
            <Input
              type="number"
              width={"40vw"}
              label="Expiration in days"
              placeholder="Expiration in days"
              onChangeText={(text) => {
                setExpirationString(text);
              }}
            />
          </Row>

          <Row space={4} alignItems={"center"}>
            <Input
              width={"40vw"}
              keyboardType="numeric"
              label="Priority"
              placeholder="Priority"
              onChangeText={(text) => {
                setPriorityString(text);
              }}
            />
            <Select
              width={"40vw"}
              accessibilityLabel="Choose Type"
              placeholder="Choose Type"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(value) => {
                setTypeValue(value);
                if (value == "OFFERS") {
                  category.type = "OFFERS";
                } else {
                  category.type = "REQUESTS";
                }
              }}
            >
              <Select.Item label="Offer" value="OFFERS" />
              <Select.Item label="Request" value="REQUESTS" />
            </Select>
          </Row>
          <Divider />

          {category?.customFields &&
            category.customFields.map((field, index) => (
              <Column key={index} space={4}>
                <Row space={4}>
                  <Input
                    label="label"
                    width={"40vw"}
                    placeholder="New field label"
                    value={field.label}
                    onChange={(event) => {
                      handleChange(index, "label", event);
                      send({
                        type: "UPDATE_LABEL_CUSTOM_FIELD",
                      });
                    }}
                  />
                  <Input
                    label="name"
                    width={"40vw"}
                    placeholder="New field name"
                    value={field.name}
                    onChange={(event) => {
                      handleChange(index, "name", event);
                      send({
                        type: "UPDATE_NAME_CUSTOM_FIELD",
                      });
                    }}
                  />
                </Row>
                <Row space={4}>
                  <Input
                    label="initial value"
                    width={"40vw"}
                    placeholder="New field initial value"
                    value={field.initalValue}
                    onChange={(event) => {
                      handleChange(index, "initalValue", event);
                      send({
                        type: "UPDATE_INITIAL_CUSTOM_FIELD",
                      });
                    }}
                  />
                  <Row space={10} alignItems={"center"}>
                    <Text>Is Required ?</Text>
                    <Switch
                      value={field.required}
                      onValueChange={(event) => {
                        handleChange(index, "required", event);
                        send({
                          type: "UPDATE_REQUIRED_CUSTOM_FIELD",
                          data: event,
                        });
                      }}
                    />
                  </Row>
                </Row>
                <Row space={4}>
                  <Button
                    width={"40vw"}
                    shadow={3}
                    variant="subtle"
                    onPress={(event) => {
                      addFields(event);
                      send({
                        type: "ADD_CUSTOM_FIELD",
                      });
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    width={"40vw"}
                    colorScheme="secondary"
                    shadow={3}
                    onPress={() => {
                      removeFields(index);
                      send({
                        type: "REMOVE_CUSTOM_FIELD",
                      });
                    }}
                    variant="outline"
                  >
                    Remove
                  </Button>
                </Row>
              </Column>
            ))}
          <Divider />
          <Center>
            <Button
              width={"40vw"}
              disabledTitleStyle={{ color: "#00F" }}
              loadingProps={{ animating: true }}
              onPress={() => {
                var check = checkFields();
                if (check == true) {
                  createCategory(category);
                }
              }}
            >
              Create
            </Button>
          </Center>
        </Column>
      </Center>
    </ScrollView>
  );
}

interface CategoryComponentProps {
  style: StyleSheet;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignContent: "center",
  },
  lastMenu: {
    marginTop: "auto",
  },
});
