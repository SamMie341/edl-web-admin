import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { CreateNewsTagUseCase } from "../application/use-cases/create-news-tag.use-case.js";
import { UpdateNewsTagUseCase } from "../application/use-cases/update-news-tag.use-case.js";
import { DeleteNewsTagUseCase } from "../application/use-cases/delete-news-tag-use-case.js";
import { GetAllNewsTagUseCase } from "../application/use-cases/get-all-news-tag.use-case.js";
import { GetNewsTagByIdUseCase } from "../application/use-cases/get-by-id.use-case.js";
import { CreateNewsTagDto } from "../application/dtos/create-news-tag.dto.js";
import { UpdateNewsTagDto } from "../application/dtos/update-news-tag.dto.js";

@UseGuards(JwtAuthGuard)
@Controller('news-tags')
export class NewsTagsController {
    constructor(
        private readonly createUseCase: CreateNewsTagUseCase,
        private readonly updateUseCase: UpdateNewsTagUseCase,
        private readonly deleteUseCase: DeleteNewsTagUseCase,
        private readonly getAllUseCase: GetAllNewsTagUseCase,
        private readonly getByIdUseCase: GetNewsTagByIdUseCase,
    ) { }

    @Post()
    create(@Body() dto: CreateNewsTagDto) {
        return this.createUseCase.execute(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsTagDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deleteUseCase.execute(id);
    }

    @Get()
    findAll() {
        return this.getAllUseCase.execute();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.getByIdUseCase.execute(id);
    }
}