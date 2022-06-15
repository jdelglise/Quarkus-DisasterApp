import { components } from "./models";
import { API_URL } from "../config";
import {
  TokenRefreshRequest,
  applyAuthTokenInterceptor,
  setAuthTokens,
} from "react-native-axios-jwt";

import axios from "axios";
import i18next from "i18next";

type Login = components["schemas"]["Login"];

type Register = components["schemas"]["User"];
type Entity = components["schemas"]["Entity"];

type resetPassword = {
  id: string;
  password: string;
};
type User = components["schemas"]["User"];
type UserPreference = components["schemas"]["UserPreference"];
type ConversationOverview = components["schemas"]["ConversationOverview"];
type Conversation = components["schemas"]["Conversation"];
type Message = components["schemas"]["Message"];
type Publication = components["schemas"]["Publication"];
type Category = components["schemas"]["Category"];
type CustomFormField = components["schemas"]["CustomFormField"];

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const axiosInstance = axios.create({ baseURL: API_URL });

const requestRefresh: TokenRefreshRequest = async (
  refreshToken: string
): Promise<AuthTokens> => {
  // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor (in our case 'axiosInstance')
  // because this will result in an infinite loop when trying to refresh the token.
  // Use the global axios client or a different instance
  const response = await axios.get(`${API_URL}/auth/refresh`, {
    headers: { Authorization: "bearer " + refreshToken },
  });

  // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

applyAuthTokenInterceptor(axiosInstance, { requestRefresh });

export function login(params: Login) {
  return axiosInstance
    .post("/auth/login", params)
    .then(async (response) => {
      console.log(response.data)
      await setAuthTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
    });
}

export const updateUser = async (params: Register) => {
  return await axiosInstance
    .put("/user", params)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("Something went wrong");
      }
      if (response.status == 201) {
        alert(
          "Your user have been updated"
        );
      }
    })
    .catch((error) => {
      if (error.response.status == 404) {
        return Promise.reject("User or password incorrect");
      } else {
        return Promise.reject("Something went wrong");
      }
    });
};

export const register = async (params: Register) => {
  return await axiosInstance
    .post("/auth/register", params)
    .then(async (response) => {
      if (response.status >= 400) {
        console.log("Something went wrong");
      }
      if (response.status == 201) {
        alert(
          "Your user have been created, close this message to go to the login page"
        );
        window.location.replace("http://localhost:19006/login");
      } else {
        console.log("Something went wrong");
      }
    })
    .catch((error) => {
      if (error.response.status >= 400) {
        return Promise.reject("User or password incorrect");
      } else {
        return Promise.reject("Something went wrong");
      }
    });
};

export const getUserPreferences = async () => {
  return await axiosInstance
    .get("user/preference")
    .then(async (response) => response.data as UserPreference)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const entityRegister = async (params: Entity) => {
  return await axiosInstance
    .post("/entity", params)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("hey");
      }
      if (response.status == 201) {
        alert(
          "Your entity have been created, close this message to go to the login page"
        );
        window.location.replace("http://localhost:19006/login");
      }
    })
    .catch((error) => {
      if (error.response.status == 409) {
        return Promise.reject("You tried to create an existing entity");
      } else if (error.response.status == 410) {
        return Promise.reject(
          "The following user doesn't exist in the database"
        );
      } else {
        return Promise.reject("Something went wrong");
      }
    });
};

export const getEntities = async () => {
  return await axiosInstance
    .get("/entity")
    .then(async (response) => response.data as Entity[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const resetPassword = async (params: resetPassword) => {
  return await axiosInstance
    .put("/admin/user/password/" + params.id + "?password=" + params.password)
    .then(async (response) => {
      if (response.status == 201 || response.status == 200) {
        alert("password has been reset");
      } else {
        console.log("Something went wrong");
      }
    })
    .catch((error) => {
      if (error.response.status == 404) {
        return Promise.reject("User or password incorrect");
      } else {
        return Promise.reject("Something went wrong");
      }
    });
};
export const getConversations = async (): Promise<ConversationOverview[]> => {
  return await axiosInstance
    .get("/messaging/conversation")
    .then(async (response) => response.data as ConversationOverview[]);
};

export const getMyOffers = async (): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publication/offer")
    .then(async (response) => response.data as Publication[]);
};

export const getMyRequests = async (): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publication/requests")
    .then(async (response) => response.data as Publication[]);
};

export const getAllOffers = async (): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publications/offers")
    .then(async (response) => response.data as Publication[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getAllRequests = async (): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publications/requests")
    .then(async (response) => response.data as Publication[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getOffersByCategory = async (id: string): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publications/offers/category/" + id)
    .then(async (response) => response.data as Publication[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getRequestsByCategory = async (id: string): Promise<Publication[]> => {
  return await axiosInstance
    .get("/publications/requests/category/" + id)
    .then(async (response) => response.data as Publication[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getPublication = async (id: string): Promise<Publication> => {
  return await axiosInstance
    .get("/publication/" + id)
    .then(async (response) => response.data as Publication)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getRelatedPublication = async (id: string): Promise<Publication[]> => {
  return await axiosInstance
    .put("/publication/related/" + id)
    .then(async (response) => response.data as Publication[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const closePublication = async (id: string) => {
  return await axiosInstance
    .put("/publication/close/" + id)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getUser = async () => {
  return await axiosInstance
    .get("user")
    .then(async (response) => response.data as User)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getUserById = async (id: string) => {
  return await axiosInstance
    .get("user/" + id)
    .then(async (response) => response.data as User)
    .catch((error) => Promise.reject("Something went wrong"));
};
export const getConversation = async (id: string): Promise<Conversation> => {
  return await axiosInstance
    .get("/messaging/conversation/" + id)
    .then(async (response) => response.data as Conversation)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const sendMessage = async (convId: string, body: Message) => {
  return await axiosInstance
    .post("/messaging/send/conversation/" + convId, body)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("error while sending message");
      }
      if (response.status == 201) console.log("message sent");
      return response;
    });
};

export const createPublication = async (params: Publication) => {
  return await axiosInstance
    .post("/publication", params)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("hey");
        alert("Hey");
      }
      if (response.status == 201) {
        alert("The publication has been created");
        window.location.replace("http://localhost:19006/home");
      }
    })
    .catch((error) => {
      if (error.response.status == 404) {
        return Promise.reject("Invalid request");
      } else {
        return Promise.reject("Something went wrong");
      }
    });
};

export const sendMessageToUser = async (login: string, body: Message) => {
  return await axiosInstance
    .post("/messaging/send/" + login, body)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("error while sending message");
      }
      if (response.status == 201) {
        console.log("message sent");
      } else {
        alert("Something went wrong");
        return Promise.reject("Something went wrong");
      }
    });
};

export const getCategories = async () => {
  return await axiosInstance
    .get("/category")
    .then(async (response) => response.data as Category[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getCategoriesByType = async (type: string) => {
  return await axiosInstance
    .get("/category/type/" + type)
    .then(async (response) => response.data as Category[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getCategory = async (id: string) => {
  return await axiosInstance
    .get("/category/" + id)
    .then(async (response) => response.data as Category)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const createCategory = async (params: Category) => {
  return await axiosInstance
    .post("/admin/category/create", params)
    .then(async (response) => {
      if (response.status == 404) {
        console.log("hey");
        alert("Hey");
      }
      if (response.status == 201) {
        alert("The category has been created");
        window.location.replace("http://localhost:19006/admin");
      }
    })
    .catch((error) => {
      if (error.response.status == 404) {
        alert(i18next.t("ERRORS.INVALID_RECIPIENT"));
        return Promise.reject("Invalid recipient"); //text kept as string to make sure all logs are in english
      } else {
        alert(i18next.t("ERRORS.SOMETHING_WENT_WRONG"));
        return Promise.reject("Something went wrong");
      }
    });
};

export const getCurrentUser = async () => {
  return await axiosInstance
    .get("user")
    .then(async (response) => response.data as User)
    .catch((error) => Promise.reject("Something went wrong"));
};

export const getUnvalidatedUsers = async (): Promise<User[]> => {
  return await axiosInstance
    .get("admin/user/unvalidated")
    .then(async (response) => response.data as User[])
    .catch((error) => Promise.reject("Something went wrong"));
};

export const validateUser = async (id: string) => {
  return await axiosInstance
    .put("admin/user/validate/" + id)
    .then(async (response) => response.data)
    .catch((error) => Promise.reject("Something went wrong"));
}
