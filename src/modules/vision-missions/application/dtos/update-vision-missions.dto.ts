import { PartialType } from '@nestjs/mapped-types';
import { CreateVisionMissionDto } from './create-vision-mission.dto.js';

export class UpdateVisionMissionDto extends PartialType(CreateVisionMissionDto) { }