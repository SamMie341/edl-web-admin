import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsCategoryDto } from './create-news-category.dto.js';

export class UpdateNewsCategoryDto extends PartialType(CreateNewsCategoryDto) { }