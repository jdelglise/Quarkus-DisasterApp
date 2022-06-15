import { useMachine } from "@xstate/react";
import { CheckIcon, Column, Input, Row, Select } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Card } from "react-native-elements";
import { createPublication, getCategories } from "../../shared/api";
import { components } from "../../shared/models";
import PublicationMachine from "./PublicationMachine";
import "./stylePublication.css";

type Category = components["schemas"]["Category"];
type Publication = components["schemas"]["Publication"];
type CategoryList = components["schemas"]["Category"][];
type CustomFormFieldList = components["schemas"]["CustomFormField"][];
type CustomFieldValueList = components["schemas"]["CustomFieldValue"][];
export default function PublicationCreationComponent() {
  const [category, setCategory] = useState({} as Category);
  const [categoryChoosed, setCategoryChoosed] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);
  const [publication, setPublication] = useState({} as Publication);

  useEffect(() => {
    getCategories()
      .then((datas) => {
        return datas;
      })
      .then((datas) => {
        datas.forEach((data) => {
          if (data.name != "") {
            categories.push({ label: data.name, value: data });
          }
        });
      })
      .catch((err) => {
        console.log(123123);
      });
  }, []);

  useEffect(() => {
    if (categories.length != 0) {
      const list = [];
      categories.forEach((element) => {
        if (element.value.type == publication.type) {
          list.push({ label: element.value.name, value: element.value.id });
        }
      });
      setCategoriesName(list);
    }
  }, [publication.type]);
  const [openType, setOpenType] = useState(false);
  const [type, setType] = useState(null);
  const [types, setTypes] = useState([
    { label: "Offers", value: "OFFERS" },
    { label: "Requests", value: "REQUESTS" },
  ]);
  const [customValues, setCustomValues] = useState([] as CustomFieldValueList);
  const [tags, setTags] = useState([]);
  const addTag = (e) => {
    if (e.key == " ") {
      if (e.target.value.length > 0) {
        setTags([...tags, e.target.value]);
        e.target.value = "";
      }
    }
  };

  const removeTag = (e) => {
    const newTags = tags.filter((tag) => tag != e);
    setTags(newTags);
    publication.keywords = tags;
  };
  const handleChange = (index, field, e) => {
    category.customFields[index][field] = e.target?.value;
    setCategory(category);
  };

  const checkFields = () => {
    if (publication.title == undefined || publication.title == "") {
      alert("Title should not be empty");
      return false;
    }
    if (publication.keywords == undefined || publication.keywords.length == 0) {
      alert("Keywords should not be empty");
      return false;
    }
    if (publication.message == undefined || publication.message == "") {
      alert("Message should not be empty");
      return false;
    }
    if (publication.type == undefined) {
      alert("Type should not be empty");
      return false;
    }
    if (category == null || category == undefined) {
      alert("Category should not be empty");
      return false;
    }
    var checkFields = false;
    category.customFields?.forEach((element) => {
      if (
        (element.initalValue == "" || element.initalValue == undefined) &&
        element.required
      ) {
        alert(element.label + " field should not be empty");
        checkFields = true;
        return;
      }
    });
    if (checkFields) {
      return false;
    }
    return true;
  };
  const [shouldShow, setShouldShow] = useState(false);
  const [state, send] = useMachine(PublicationMachine);
  return (
    <View>
      <Card>
        <Card.Title>Create a Publication</Card.Title>
        <Card.Divider></Card.Divider>
        <Column space={4}>
          <Row space={4}>
            <Input
              width={'40vw'}
              label="Title"
              placeholder="Title"
              onChangeText={(text) => {
                publication.title = text;
              }}
              errorMessage={state.context.titleError}
            />
            <Input
              width={'40vw'}
              label="Message"
              placeholder="Message"
              onChangeText={(text) => {
                publication.message = text;
              }}
              errorMessage={state.context.messageError}
            />
          </Row>

          <div className="tag-container">
            {tags.map((tag, index) => {
              return (
                <div key={index} className="tag">
                  {tag}
                  <span onClick={() => removeTag(tag)}>x</span>
                </div>
              );
            })}
            <input placeholder="Keywords" onKeyDown={addTag} />
          </div>
          <Row space={4}>
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
                setShouldShow(true);
                if (value == "REQUESTS") {
                  publication.type = "REQUESTS";
                } else {
                  publication.type = "OFFERS";
                }
              }}
            >
              <Select.Item label="Offer" value="OFFERS" />
              <Select.Item label="Request" value="REQUESTS" />
            </Select>
            {shouldShow ? (

              <Dropdown
                placeholder="Category"
                value={categoryChoosed}
                data={categoriesName}
                labelField="label"
                valueField="value"
                onChange={(item) => {
                  categories.forEach((element) => {
                    if (element.value.id == item.value) {
                      setCategory(element.value);
                      publication.customValues = [];
                    }
                  });
                }}
              />
            ) : null}
          </Row>

          {category?.customFields?.map((field, index) => (
            <div key={index}>
              <Input
                label={field.label}
                placeholder={field.label}
                value={field.initalValue}
                onChange={(event) => {
                  handleChange(index, "initalValue", event);
                  send({
                    type: "UPDATE_CATEGORY",
                    data: field.initalValue,
                  });
                }}
              />
            </div>
          ))}
          <Button
            disabledTitleStyle={{ color: "#00F" }}
            loadingProps={{ animating: true }}
            onPress={() => {
              publication.keywords = tags;
              publication.categoryId = category.id;
              category.customFields?.forEach((field) => {
                if (field.initalValue != undefined && field.initalValue != "") {
                  const customValue = {
                    name: field.name!,
                    value: field.initalValue!,
                  };
                  publication.customValues.push(customValue);
                }
              });
              var check = checkFields();
              if (check == true) {
                createPublication(publication);
              } else {
                publication.customValues = [];
              }
            }}
            title="Publish"
            type="outline"
          />
        </Column>
      </Card>
    </View>
  );
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
