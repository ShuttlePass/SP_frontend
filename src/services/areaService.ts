import { api } from '@/api/axios';

export interface Area {
  ar_idx: number;
  company_idx: number;
  ar_name: string;
  created_at: string;
  updated_at: string;
}

interface AreaResponse {
  message: string;
  code: number;
  data: Area[];
}

export const areaService = {
  // 지역 목록 조회
  getAreas: async (companyIdx?: number): Promise<Area[]> => {
    try {
      const params = companyIdx ? { company_idx: companyIdx } : {};
      const response = await api.get<AreaResponse>('/list/area', { params });
      
      if (response.data.code !== 1) {
        throw new Error(response.data.message || '지역 목록 조회에 실패했습니다.');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('지역 목록 조회 실패:', error);
      throw error;
    }
  }
}; 