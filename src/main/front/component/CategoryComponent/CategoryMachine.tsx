import { createMachine, assign } from "xstate";
import { mapContext } from "xstate/lib/utils";
import { createCategory } from "../../shared/api";
import { components } from "../../shared/models";
import React, { useState, useEffect } from "react";

type CustomFormField = components["schemas"]["CustomFormField"];
export interface CategoryMachineContext{
  categoryError?: string;
  name: string;
  /** @enum {string} */
  type: "OFFERS" | "REQUESTS";
  customFields?: CustomFormField[] 
  expirationInDays?: number;
  disabled?: boolean;
  /** Format: date */
  creationDate?: string;
  prioriy?: number;
  nameError?: string;
  typeError?:string;
  expirationInDaysError?:string;
  prioriyError?:string;
  formFieldNameError?:string;
  formFieldLabelError?:string;
  formFieldInitialValueError?:string;
  formFieldRequiredError?:string;
  label?:string;
  initialValue?:string;
  nameFieldValue?:string;
  requiredValue?:boolean;
}

export enum CategoryMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum CategoryMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: CategoryMachineContext): Promise<void> {
  form.nameError = form.name
    ? undefined
    : "Oops, you forgot the title";
  form.typeError = form.type
    ? undefined
    : "Oops, you forgot the type";
  form.expirationInDaysError = form.expirationInDays
    ? undefined
    : "Oops, you forgot the expiration in days";
  form.customFields?.forEach(
    (field,index) => {
      form.formFieldNameError = field.name
      ? (undefined)
      : "Oops, you forgot the name for the field " + index; 
      form.formFieldLabelError = field.label
      ? (undefined)
      : "Oops, you forgot the label for the field " + index;
      form.formFieldInitialValueError = field.initalValue
      ? (undefined)
      : "Oops, you forgot the initial value for the field " + index;
      /*form.formFieldRequiredError = field.required
      ? undefined
      : "Oops, you forgot the required for the field " + index;*/
    }   
  )
  if (form.nameError 
      ||form.typeError
      ||form.nameError
      ||form.expirationInDaysError
      ||form.formFieldInitialValueError
      ||form.formFieldLabelError
      ||form.formFieldNameError
      ||form.formFieldRequiredError
       ) {
    throw Error();
  }
  form.disabled = false
}

const addCustomField = (context) =>{
  context.customFields.push({initalValue:context.initialValue, label:context.label,name:context.nameFieldValue,required:context.requiredValue} as CustomFormField)  
} 

const removeCustomField = (context, index) =>{
  if(index.data>0){
    const values = [...context.customFields];
    values.splice(index.data,1);
    context.customFields = values
  } 
}

const CategoryMachine =

  createMachine(
    {
      context: {} as CategoryMachineContext,
      id: "category",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE_NAME: {
              target: "idle",
              actions: ["update_name"],
            },
            UPDATE_EXPIRATIONINDAYS: {
              target: "idle",
              actions: ["update_expirationindays"],
            },
            UPDATE_PRIORITY: {
              target: "idle",
              actions: ["update_priority"],
            },
            UPDATE_TYPE: {
              target: "idle",
              actions: ["update_type"],
            },
            UPDATE_LABEL_CUSTOM_FIELD: {
              target: "idle",
              actions: ["update_label_custom_field"],
            },
            UPDATE_NAME_CUSTOM_FIELD: {
              target: "idle",
              actions: ["update_name_custom_field"],
            },
            UPDATE_INITIAL_CUSTOM_FIELD: {
              target: "idle",
              actions: ["update_initial_custom_field"],
            },
            UPDATE_REQUIRED_CUSTOM_FIELD: {
              target: "idle",
              actions: ["update_required_custom_field"],
            },
            ADD_CUSTOM_FIELD:{
              target: "idle",
              actions: ["add_custom_field"],
            },  
            REMOVE_CUSTOM_FIELD:{
              target: "idle",
              actions: ["remove_custom_field"],
            },  
            SUBMIT: {
              target: "submit"
            },
          },
        },
        submit: {
          invoke: {
            src: (context) => isFormValid(context),
            onDone: {
              target: "push",
            },
            onError: {
              target: "idle",
            },
          },
        },
        push: {
          invoke: {
            src: (context) => createCategory(context),
            onDone: {
              target: "success",
            },
            onError: {
              target: "idle",
              actions: ["push_error"],
            },
          },
        },
        success: {},
      },
    },
    {
      // s
      actions: {
        
        update_name: assign({ name: (_, event) => event.data }),
        update_expirationindays: assign({ expirationInDays: (_, event) => event.data }),
        update_type: assign({type: (_, event) => event.data }),
        update_priority: assign({prioriy: (_, event) => event.data }),
        update_label_custom_field: assign({label: (_, event) => event.data }),
        update_name_custom_field: assign({nameFieldValue: (_, event) => event.data }),
        update_initial_custom_field: assign(
          {
            initialValue: (_, event) => event.data 
          }),
        update_required_custom_field: assign({requiredValue: (_, event) => event.data }),
        push_error: assign({
          categoryError: (_, event) => event.data,
        }),
        add_custom_field: (context, index) => {
          if(context.customFields == null){
            context.customFields = []
          }
          addCustomField(context)
        },
        remove_custom_field: (context, index) => {
          removeCustomField(context, index)
        }
      },
    }
  );

export default CategoryMachine;
