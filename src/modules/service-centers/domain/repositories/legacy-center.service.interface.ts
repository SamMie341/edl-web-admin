export const LEGACY_CENTER_SERVICE = 'LEGACY_CENTER_SERVICE';

export interface ILegacyCenterService {
    fetchCentersByProvince(provinceId: number): Promise<any[]>;
    downloadImage(url: string, fileName: string): Promise<string | null>;
}