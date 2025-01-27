declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        mongoString: string;
        // DATABASE_URL: string;
        // add more environment variables and their types here
      }
    }
  }