import { JobPosting } from "../../../../generated/prisma/client.js";

export const JOB_POSTING_REPOSITORY = 'JOB_POSTING_REPOSITORY';

export interface IJobPostingRepository {
    findAll(search?: string, page?: number, limit?: number): Promise<{ data: JobPosting[], meta: any }>;
    findById(id: number): Promise<JobPosting | null>;
    create(data: any): Promise<JobPosting>;
    update(id: number, data: any): Promise<JobPosting>;
    delete(id: number): Promise<JobPosting>;
}