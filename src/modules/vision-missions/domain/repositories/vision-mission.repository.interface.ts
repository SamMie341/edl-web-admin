import { VisionMission } from "../../../../generated/prisma/client.js";


export const VISION_MISSION_REPOSITORY = 'VISION_MISSION_REPOSITORY';

export interface IVisionMissionRepository {
    findAll(): Promise<VisionMission[]>;
    findById(id: number): Promise<VisionMission | null>;
    create(data: any): Promise<VisionMission>;
    update(id: number, data: any): Promise<VisionMission>;
    delete(id: number): Promise<VisionMission>;
}