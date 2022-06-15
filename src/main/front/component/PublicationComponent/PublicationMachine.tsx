import { createMachine, assign } from "xstate";
import { mapContext } from "xstate/lib/utils";
import { createPublication } from "../../shared/api";
import { components } from "../../shared/models";
import React, { useState, useEffect } from "react";
type CustomValue = {
  initalValue?: string | undefined;
  label: string;
  name: string;
  required: boolean;
}
type CustomFieldValueList= components["schemas"]["CustomFieldValue"][];
type CustomFormFieldList = components["schemas"]["CustomFormField"][];

export interface PublicationMachineContext{
    publicationError?: string;
    /** @enum {string} */
    type: "OFFERS" | "REQUESTS";
    typeError?: string;
    categoryId?: string;
    creator?: string;
    creatorError?: string;
    mandated?: string;
    mandatedError?: string;
    /** Format: date */
    creationDate?: string;
    creationDateError?: string;
    /** Format: date */
    lastUpdateDate?: string;
    lastUpdateDateError?: string;
    expirationInDays?: number;
    expirationInDaysError?: string;
    title: string;
    titleError?: string;
    message?: string;
    messageError?: string;
    closed?: boolean;
    closedError?: string;
    prioriy?: number;
    prioriyError?: string;
    childPublicationId?: string[];
    childPublicationIdError?: string;
    parentpublicationId?: string;
    parentpublicationIdError?: string;
    keywords?: string[];
    keywordsError?: string;
    category: unknown;
    customFields?: CustomFormFieldList;
    customValues?: CustomFieldValueList;
    customValuesError?:string;
}

export enum PublicationMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum PublicationMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: PublicationMachineContext): Promise<void> {
  form.titleError = form.title
    ? undefined
    : "Oops, you forgot the title";
  form.messageError = form.message
    ? undefined
    : "Oops, you forgot the message";
  form.keywordsError = form.keywords
    ? undefined
    : "Oops, you forgot the keywords";
  form.typeError = form.type
    ? undefined
    : "Oops, you forgot the type";

  if (form.titleError 
      ||form.messageError
      ||form.keywordsError
      ||form.typeError
       ) {
    throw Error();
  }
}
const addCustomValue = (context) =>{
  context.customValues.forEach(element => {

  });
  context.CustomFieldValue.push({initalValue:context.initialValue, label:context.label,name:context.nameFieldValue,required:context.requiredValue} as CustomFormField)  
} 
const PublicationMachine =
  createMachine(
    {
      context: {} as PublicationMachineContext,
      id: "publication",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE_TITLE: {
              target: "idle",
              actions: ["update_title"],
            },
            UPDATE_MESSAGE: {
              target: "idle",
              actions: ["update_message"],
            },
            UPDATE_TYPE: {
              target: "idle",
              actions: ["update_type"],
            },
            UPDATE_KEYWORDS: {
              target: "idle",
              actions: ["update_keywords"],
            },
            UPDATE_CATEGORY: {
              target: "idle",
              actions: ["update_category"],
            },
            ADD_CUSTOM_VALUE: {
              target: "idle",
              actions: ["add_custom_value"],
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
            src: (context) => createPublication(context),
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
        
        update_title: assign({ title: (_, event) => event.data }),
        update_message: assign({ message: (_, event) => event.data }),
        update_type: assign({type: (_, event) => event.data }),
        update_keywords: assign({keywords: (_, event) => event.data }),
        update_category: assign({categoryId: (_, event) => event.data }),
        push_error: assign({
          publicationError: (_, event) => event.data,}),
        add_custom_value: (context) => {
          assign({customFields: (_, event) => event.array})
          /*if(context.customValues == null){
            context.customValues = []
          }
          addCustomValue(context)*/
        },
      },
    }
  );

export default PublicationMachine;
