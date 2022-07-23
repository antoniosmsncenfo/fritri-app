export interface IRegistration {
    name: string;
    email: string;
    gender: string;
    country: string;
    password: string;
    confirmPassword: string;
    agreed: boolean;
    status: RegistrationStatus;
  }

  export enum RegistrationStatus {
    New = 'NEW',
    Success = 'SUCCESS',
    Duplicated = 'DUPLICATED',
    Error = 'ERROR'
  }

  export enum ResetPasswordStatus {
    Pending = 'PENDING',
    Success = 'SUCCESS',
    WrongEmail = 'WRONG_EMAIL',
    Error = 'ERROR',
    TimeLimit = 'TIME_LIMIT'
  }