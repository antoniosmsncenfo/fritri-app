export declare type GoogleUser = {
  id?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
  email?: string;
};
export declare type LogInResult = {
  type: 'cancel';
} | {
  type: 'success';
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  user: GoogleUser;
};

export interface GoogleSecrets {
  iosClientId: string;
  androidClientId: string;
}

