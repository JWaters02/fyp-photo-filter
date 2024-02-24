export type RuleType = 'hideMyPhotos' | 'hidePhotosContainingMe';

export interface Rule {
    id: string;
    type: RuleType;
    value: string;
}