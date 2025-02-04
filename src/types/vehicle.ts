export interface Area {
  sa_idx: number;
  shuttle_idx: number;
  area_idx: number;
  ar_name: string;
}

export interface Vehicle {
  sh_name: string;
  sh_state: number;
  sh_max_cnt: number;
  sh_idx: number;
  us_idx: number | null;
  us_name: string | null;
  us_contact: string | null;
  areas: Area[];
}

export interface VehicleResponse {
  message: string;
  code: number;
  data: Vehicle[];
  pageInfo: {
    size: number;
    page: number;
    total_count: number;
  };
}

export interface BusStop {
  id: string;
  name: string;       
  address: string;    
  order: number;      
  time: string;       
  students: string[]; 
} 