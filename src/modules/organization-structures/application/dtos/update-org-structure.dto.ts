import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgStructureDto } from './create-org-structure.dto.js';

export class UpdateOrgStructureDto extends PartialType(CreateOrgStructureDto) { }