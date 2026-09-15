export const HRM_SERVICE = 'HRM_SERVICE';

export interface IHrmService {
    getEmployeeData(employeeCode: string): Promise<any>;
}