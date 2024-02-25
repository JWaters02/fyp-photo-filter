export type RuleType = 'hidePhotosUploadedBy' | 'hidePhotosContaining';

export interface Rule {
    id: string;
    type: RuleType;
    value: string;
}