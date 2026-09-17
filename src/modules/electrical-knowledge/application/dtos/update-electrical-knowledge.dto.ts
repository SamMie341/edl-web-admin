import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricalKnowledgeDto } from './create-electrical-knowledge.dto.js';

export class UpdateElectricalKnowledgeDto extends PartialType(CreateElectricalKnowledgeDto) { }