import { createMachine, assign } from "xstate";
import { mapContext } from "xstate/lib/utils";
import {entityRegister} from "../../../shared/api";

export interface EntityRegisterMachineContext{
  name: string;
  nameError?: string;
  email: string;
  emailError?: string;
  phoneNumber: string;
  phoneNumberError?: string;
  streetError?: string;
  numberError?: string;
  cityError?: string;
  postCodeError?: string;
  countryError?:string;
  addressList:{
    street: string,
    number: string,
    city: string,
    postCode: string,
    country: string
  }[];
  street: string,
  number: string,
  city: string,
  postCode: string,
  country: string
  administrator: string;
  administratorError?: string;
  picture: string;
  pictureError?: string;
}

export enum EntityRegisterMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum EntityRegisterMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: EntityRegisterMachineContext): Promise<void> {
  form.nameError = form.name
    ? undefined
    : "Oops, you forgot your name :(";
  form.emailError = form.email
    ? undefined
    : "Oops, you forgot your email :(";
  form.phoneNumberError = form.phoneNumber
    ? undefined
    : "Oops, you forgot your phone :(";
  form.streetError = form.street
    ? undefined
    : "Oops, you forgot your street :(";
  form.numberError = form.number
    ? undefined
    : "Oops, you forgot your house number :(";
  form.cityError = form.city
    ? undefined
    : "Oops, you forgot your city :(";
  form.postCodeError = form.postCode
    ? undefined
    : "Oops, you forgot your postCode :(";
  form.countryError = form.country
  ? undefined
  : "Oops, you forgot your postCode :(";
  /*form.administratorError = form.administrator
      ? undefined
      : "Oops, you forgot to add your administrator :(";*/
  form.pictureError = form.picture
      ? undefined
      : "Oops, you forgot to add a picture :(";
  if (form.nameError
      ||form.emailError
      ||form.phoneNumberError
      ||form.streetError
      ||form.numberError
      ||form.cityError
      ||form.postCodeError
      ||form.countryError
      ||form.administratorError
      ||form.pictureError
       ) {
    throw Error();
  }
  form.addressList=[{
    street: form.street,
    number: form.number,
    city: form.city,
    postCode: form.postCode,
    country: form.country,
  }]
}

const EntityRegisterMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgBssoBLDAOhIgLHxAActYSAXErDOgD0QFYBmcgA5eABlEAmfgDYAnAEYho2f3noAnonnTR5cfoAs-AwHYhBg7xPI0IIqQoA3AIYEqzlrSQMmrdp28eBAMhcgMJMW0DaXkxWQlpaQ1ECQlZPX15fhMjXnlReRt0ezJyRlgWAH0AMywAJwBbOnK-Dm5EcOSEWV1ZPr6DWV4JeRMegyK7YlLYAFcAY3m4eG8WtjbAjpNyCOkIhWl+UXCTfl4utND9SVV+BRNeaUmSimrnEgJZuq9QNf92hACYRicQWfj8IQSU5qECaBAybbXfgRYzmeSFWwvZq+dYBUBBRRdUbkfp9UTZfLKcS8Gw2IA */
  createMachine(
    {
      context: {} as EntityRegisterMachineContext,
      id: "register",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE_NAME: {
              target: "idle",
              actions: ["update_name"],
            },
            UPDATE_EMAIL: {
              target: "idle",
              actions: ["update_email"],
            },
            UPDATE_PHONE: {
              target: "idle",
              actions: ["update_phone"],
            },
            UPDATE_STREET: {
              target: "idle",
              actions: ["update_street"],
            },
            UPDATE_NUMBER: {
              target: "idle",
              actions: ["update_number"],
            },
            UPDATE_CITY: {
              target: "idle",
              actions: ["update_city"],
            },
            UPDATE_POSTCODE: {
              target: "idle",
              actions: ["update_postCode"],
            },
            UPDATE_COUNTRY: {
              target: "idle",
              actions: ["update_country"],
            },
            UPDATE_ADMINISTRATOR: {
              target: "idle",
              actions: ["update_administrator"],
            },
            UPDATE_PICTURE: {
              target: "idle",
              actions: ["update_picture"],
            },
            SUBMIT: {
              target: "submit",
            },
          },
        },
        submit: {
          invoke: {
            src: (context) => isFormValid(context),
            onDone: {
              target: "fetch",
            },
            onError: {
              target: "idle",
            },
          },
        },
        fetch: {
          invoke: {
            src: (context) => entityRegister(context),
            onDone: {
              target: "success",
            },
            onError: {
              target: "idle",
              actions: ["fetch_error"],
            },
          },
        },
        success: {},
      },
    },
    {
      // s
      actions: {
        update_name: assign({name: (_, event) => event.data }),
        update_email: assign({ email: (_, event) => event.data }),
        update_phone: assign({ phoneNumber: (_, event) => event.data }),
        update_street: assign({street: (_, event) => event.data }),
        update_number: assign({number: (_, event) => event.data }),
        update_city: assign({city: (_, event) => event.data }),
        update_postCode: assign({postCode: (_, event) => event.data }),
        update_country: assign({country: (_, event) => event.data }),
        update_administrator: assign({administrator: (_, event) => event.data }),
        update_picture: assign({picture: (_, event) => event.data }),
        fetch_error: assign({nameError: (_, event) => event.data }),
      },
    }
  );

export default EntityRegisterMachine;
