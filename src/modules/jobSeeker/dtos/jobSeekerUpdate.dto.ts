import { LAST_EDUCATION_TYPE } from '@enums/consts/lastEducationTypes';
import * as Yup from 'yup';
export interface JobSeekerUpdateDto {
    name: string;
    lastEducation: string;
    major: string;
    gpa: number;
}

export const JobSeekerUpdateSchema: Yup.Schema<JobSeekerUpdateDto> = Yup.object({
    name: Yup.string()
        .required('name is required')
        .min(3, 'name must be at least 3 characters')
        .max(30, 'name must be at most 30 characters'),

    lastEducation: Yup.string()
        .required('last_education is required')
        .oneOf(
            LAST_EDUCATION_TYPE,
            `Invalid last_education, must be one of "${LAST_EDUCATION_TYPE.join(", ")}"`,
        ),

    major: Yup.string()
        .required('major is required'),

    gpa: Yup.number()
        .required('gpa is required')
        .test('is-decimal', 'gpa must be decimal', value => {
            return /^\d+\.\d+$/.test(value.toString());
        }),
}).noUnknown(true).strict(true);