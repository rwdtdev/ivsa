export type UserCredentials = {
  username: string;
  password: string;
};

export type ProviderCredentials = Record<'username' | 'password', string> | undefined;

export type ReactChildren = {
  children: React.ReactNode;
};
