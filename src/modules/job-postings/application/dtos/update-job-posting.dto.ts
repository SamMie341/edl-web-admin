import { PartialType } from '@nestjs/mapped-types';
import { CreateJobPostingDto } from './create-job-posting.dto.js';

export class UpdateJobPostingDto extends PartialType(CreateJobPostingDto) { }