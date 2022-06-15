import { createMachine, assign } from "xstate";
import { register } from "../../shared/api";

//constant to validate the form
const birthdatecheck = /^\d{4}\-\d{2}\-\d{2}$/
const emailcheck= /^\S+@\S+\.\S+$/

export interface RegistrationMachineContext{
  password: string;
  passwordError?: string;
  password_2: string;
  passwordError_2?: string;
  login: string;
  loginError?: string;
  email: string;
  emailError?: string;
  firstName: string;
  firstNameError?: string;
  lastName: string;
  lastNameError?: string;
  phoneNumber: string;
  phoneNumberError?: string;
  birthdate: string;
  birthdateError?: string;
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
}

export enum RegistrationMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum RegistrationMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: RegistrationMachineContext): Promise<void> {
  form.passwordError = form.password
    ? undefined
    : "Oops, you forgot your password :(";
  form.passwordError_2 = form.password_2
    ? undefined
    : "Oops, you forgot your password_2 :(";
  form.loginError = form.login
    ? undefined
    : "Oops, you forgot your username :(";
  form.emailError = form.email
    ? undefined
    : "Oops, you forgot your email :(";
  //Check email is in correct format
  if(!emailcheck.test(form.email)){form.emailError="Your email doesn't seem valid"}
  form.firstNameError = form.firstName
    ? undefined
    : "Oops, you forgot your firstname :(";
  form.lastNameError = form.lastName
    ? undefined
    : "Oops, you forgot your lastname :(";
  form.phoneNumberError = form.phoneNumber
    ? undefined
    : "Oops, you forgot your phone :(";
  form.birthdateError = form.birthdate
    ? undefined
    : "Oops, you forgot your birthdate :(";
  //Check birthdate is in correct format
  if(!birthdatecheck.test(form.birthdate)){form.birthdateError="Check the date, format is year-month-day like 1992-03-12"}    
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
  if (form.passwordError 
      ||form.passwordError_2
      ||form.loginError
      ||form.emailError
      ||form.firstNameError
      ||form.lastNameError
      ||form.phoneNumberError
      ||form.birthdateError
      ||form.streetError
      ||form.numberError
      ||form.cityError
      ||form.postCodeError
      ||form.countryError
       ) {
    throw Error();
  }
  //This part fill in the object addressList as its not possible with xstate
  if(form.password!=form.password_2){form.passwordError_2="Passwords doesn't match";throw Error();}
  form.addressList=[{
    street: form.street,
    number: form.number,
    city: form.city,
    postCode: form.postCode,
    country: form.country,
  }]
}

const RegistrationMachine =
  createMachine(
    {
      context: {} as RegistrationMachineContext,
      id: "register",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE_PASSWORD: {
              target: "idle",
              actions: ["update_password"],
            },
            UPDATE_PASSWORD_2: {
              target: "idle",
              actions: ["update_password_2"],
            },
            UPDATE_USERNAME: {
              target: "idle",
              actions: ["update_username"],
            },
            UPDATE_EMAIL: {
              target: "idle",
              actions: ["update_email"],
            },
            UPDATE_FIRSTNAME: {
              target: "idle",
              actions: ["update_firstname"],
            },
            UPDATE_LASTNAME: {
              target: "idle",
              actions: ["update_lastname"],
            },
            UPDATE_PHONE: {
              target: "idle",
              actions: ["update_phone"],
            },
            UPDATE_BIRTHDATE: {
              target: "idle",
              actions: ["update_birthdate"],
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
            src: (context) => register(context),
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
      // actions to get data from the form
      actions: {
        update_password: assign({ password: (_, event) => event.data }),
        update_password_2: assign({ password_2: (_, event) => event.data }),
        update_username: assign({login: (_, event) => event.data }),
        update_email: assign({ email: (_, event) => event.data }),
        update_firstname: assign({ firstName: (_, event) => event.data }),
        update_lastname: assign({ lastName: (_, event) => event.data }),
        update_phone: assign({ phoneNumber: (_, event) => event.data }),
        update_birthdate: assign({ birthdate: (_, event) => event.data }),
        update_street: assign({street: (_, event) => event.data }),
        update_number: assign({number: (_, event) => event.data }),
        update_city: assign({city: (_, event) => event.data }),
        update_postCode: assign({postCode: (_, event) => event.data }),
        update_country: assign({country: (_, event) => event.data }),
        fetch_error: assign({
          loginError: (_, event) => event.data,
        }),
      },
    }
  );

export default RegistrationMachine;
