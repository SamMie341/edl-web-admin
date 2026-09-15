import { HttpException, HttpStatus } from "@nestjs/common";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";
import "multer";

export const imageFileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(
            new HttpException('ອະນຸຍາດສະເພາະໄຟລ໌ຮູບພາບເທົ່ານັ້ນ', HttpStatus.BAD_REQUEST),
            false
        );
    }
    callback(null, true);
};

export const editFileName = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
) => {
    const fileExtName = extname(file.originalname);
    const randomName = uuidv4();
    callback(null, `${randomName}${fileExtName}`);
};
