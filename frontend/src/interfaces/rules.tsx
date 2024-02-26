export type RuleType = 'hideAllPhotosUploadedByMeFrom' | 'hideMyPhotosContainingMeFrom';

export interface Rule {
    id: string;
    type: RuleType;
    uid: string;
    user: string;
}

export interface FamilyMember {
    uid: string;
    firstName: string;
    lastName: string;
}