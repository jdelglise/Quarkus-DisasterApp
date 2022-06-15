import { createMachine, assign } from "xstate";
import { resetPassword } from "../../shared/api";

export interface AdminPasswordResetMachineContext {
  id?: string;
  idError?: string;
  password?: string;
  passwordError?: string;
}

export enum AdminPasswordResetMachineState {
  IDLE = "idle",
  VALIDATE = "validate",
  POST_FORM = "post_form",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum AdminPasswordResetMachineEvent {
  SUBMIT_FORM,
}

async function isFormValid(form: AdminPasswordResetMachineContext): Promise<void> {
  form.idError = form.id
    ? undefined
    : "Oops, you forgot the username :(";
  form.passwordError = form.password
    ? undefined
    : "Oops, you forgot the password :(";

  if (form.idError||form.passwordError) {
    throw Error();
  }
}

const AdminPasswordResetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgBssoBLDAOhIgLHxAActYSAXErDOgD0QFYBmcgA5eABlEAmfgDYAnAEYho2f3noAnonnTR5cfoAs-AwHYhBg7xPI0IIqQoA3AIYEqzlrSQMmrdp28eBAMhcgMJMW0DaXkxWQlpaQ1ECQlZPX15fhMjXnlReRt0ezJyRlgWAH0AMywAJwBbOnK-Dm5EcOSEWV1ZPr6DWV4JeRMegyK7YlLYAFcAY3m4eG8WtjbAjpNyCOkIhWl+UXCTfl4utND9SVV+BRNeaUmSimrnEgJZuq9QNf92hACYRicQWfj8IQSU5qECaBAybbXfgRYzmeSFWwvZq+dYBUBBRRdUbkfp9UTZfLKcS8Gw2IA */
  createMachine(
    {
      context: {} as AdminPasswordResetMachineContext,
      id: "login",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE_ID: {
              target: "idle",
              actions: ["update_id"],
            },
            UPDATE_PASSWORD: {
              target: "idle",
              actions: ["update_password"],
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
             src: (context) => resetPassword(context),
            onDone: {
              target: "idle",
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
        update_id: assign({ id: (_, event) => event.data }),
        update_password: assign({ password: (_, event) => event.data }),
      },
    }
  );

export default AdminPasswordResetMachine;
