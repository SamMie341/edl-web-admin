export const HRM_DISTRICT_SERVICE = 'HRM_DISTRICT_SERVICE';

export interface IHrmDistrictService {
    fetchDistricts(): Promise<any[]>;
}