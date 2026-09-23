import { PartialType } from "@nestjs/mapped-types";
import { CreateNewsTagDto } from "./create-news-tag.dto.js";

export class UpdateNewsTagDto extends PartialType(CreateNewsTagDto) { }