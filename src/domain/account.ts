export interface AccountId {
  readonly id: string;
}

export interface Account {
  readonly identity: AccountId;
  readonly email: string;
  readonly phone: string | null;
  readonly profile: AccountProfile;
  readonly verificationStatus: AccountVerificationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AccountProfile {
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly language: string;
  readonly region: string | null;
}

export interface AccountVerificationStatus {
  readonly emailVerified: boolean;
  readonly phoneVerified: boolean;
  readonly identityVerified: boolean;
  readonly verifiedAt: Date | null;
}
