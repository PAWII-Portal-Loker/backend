import * as Yup from 'yup';

export interface JobSeekerCreateDto {
    name: string;
    lastEducation: string;
    major: string;
    gpa: number;
}

export const JobSeekerCreateSchema: Yup.Schema<JobSeekerCreateDto> = Yup.object({
    name: Yup.string()
        .required('name is required')
        .min(3, 'name must be at least 3 characters')
        .max(30, 'name must be at most 30 characters'),

    lastEducation: Yup.string()
        .required('lastEducation is required'),

    major: Yup.string()
        .required('major is required'),

    gpa: Yup.number()
        .required('GPA is required')
        .test('is-decimal', 'GPA must be decimal', value => {
            return /^\d+\.\d+$/.test(value.toString()); 
        })
})
    .noUnknown(true)
    .strict(true);