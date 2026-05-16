/** Google Identity Services (accounts.google.com/gsi/client) — tipado mínimo */

export type GisCodeResponse = {
  code?: string;
  error?: string;
  error_description?: string;
};

export type GisCodeClient = {
  requestCode: () => void;
};

export type GisCodeClientConfig = {
  client_id: string;
  scope: string;
  ux_mode: 'popup';
  callback: (response: GisCodeResponse) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: GisCodeClientConfig) => GisCodeClient;
        };
      };
    };
  }
}

export {};
