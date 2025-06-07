//As June 2025 I know not to hardcode API Keys and other important variables and instead put them in env files
import { createContext } from "react";

const ip = ""; //Redacted for public Repo

const AuthContext = createContext();

export { ip, AuthContext };
