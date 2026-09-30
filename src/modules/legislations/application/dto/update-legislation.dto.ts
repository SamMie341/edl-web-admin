import { PartialType } from '@nestjs/mapped-types';
import { CreateLegislationDto } from './create-legislation.dto.js';

export class UpdateLegislationDto extends PartialType(CreateLegislationDto) {}
