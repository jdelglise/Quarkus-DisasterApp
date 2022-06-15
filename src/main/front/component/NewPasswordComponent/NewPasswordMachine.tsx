import { createMachine, assign } from "xstate";

export interface NewPasswordMachineContext {
  password?: string;
  passwordError?: string;
  password_2?: string;
  passwordError_2?: string;
}

export enum NewPasswordMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum NewPasswordMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: NewPasswordMachineContext): Promise<void> {
  form.passwordError = form.password
    ? undefined
    : "Oops, you forgot your username :(";
  form.passwordError_2 = form.password_2
    ? undefined
    : "Oops, you forgot your password :(";

  if (form.passwordError || form.passwordError_2) {
    throw Error();
  }
}

const NewPasswordMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgBssoBLDAOhIgLHxAActYSAXErDOgD0QFYBmcgA5eABlEAmfgDYAnAEYho2f3noAnonnTR5cfoAs-AwHYhBg7xPI0IIqQoA3AIYEqzlrSQMmrdp28eBAMhcgMJMW0DaXkxWQlpaQ1ECQlZPX15fhMjXnlReRt0ezJyRlgWAH0AMywAJwBbOnK-Dm5EcOSEWV1ZPr6DWV4JeRMegyK7YlLYAFcAY3m4eG8WtjbAjpNyCOkIhWl+UXCTfl4utND9SVV+BRNeaUmSimrnEgJZuq9QNf92hACYRicQWfj8IQSU5qECaBAybbXfgRYzmeSFWwvZq+dYBUBBRRdUbkfp9UTZfLKcS8Gw2IA */
  createMachine(
    {
      context: {} as NewPasswordMachineContext,
      id: "login",
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
          // invoke: {
          //   src: (context) => postLogin(context),
          //   onDone: {
          //     target: "success",
          //   },
          //   onError: {
          //     target: "idle",
          //     actions: ["fetch_error"],
          //   },
          // },
        },
        success: {},
      },
    },
    {
      // s
      actions: {
        update_password: assign({ password: (_, event) => event.data }),
        update_password_2: assign({ password: (_, event) => event.data }),
      },
    }
  );

export default NewPasswordMachine;
