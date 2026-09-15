export const HRM_VILLAGE_SERVICE = 'HRM_VILLAGE_SERVICE';

export interface IHrmVillageService {
    fetchVillage(): Promise<any[]>;
}