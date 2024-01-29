
export type IvaContactInfo = {
  value: string;
  privacy: "PUBLIC" | "AUTHORIZED" | "NOBODY";
}

export type IvaUserCreateData = {
  login: string;
  userType: "ADMIN" | "USER";
  securityLevel: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" | "TOP_SECRET";
  name: string;
  companyId?: string;
  email?: IvaContactInfo;
  phone?: IvaContactInfo;
  additionalContact?: IvaContactInfo;
  aboutSelf?: string;
  defaultMediaGroupId?: Number;
  password?: string;
  vvoipLogin?: string;
  vvoipExtension?: string;
  vvoipSubnet?: string;
  vvoipPassword?: string;
  isConferenceCreationEnabled?: boolean;
}
