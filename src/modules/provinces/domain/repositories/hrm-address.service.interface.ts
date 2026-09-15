export const HRM_ADDRESS_SERVICE = 'HRM_ADDRESS_SERVICE';

export interface IHrmAddressService {
    fetchProvinces(): Promise<any[]>;
}