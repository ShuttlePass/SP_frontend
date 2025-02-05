export interface Area {
  area_idx: number;
  ar_name: string;
}

export interface ShuttleArea {
  sa_idx: number;
  shuttle_idx: number;
  area_idx: number;
  ar_name: string;
}

export interface Vehicle {
  sh_idx: number;
  sh_name: string;
  sh_max_cnt: number;
  us_idx: number | null;
  us_name: string | null;
  us_id: string | null;
  us_contact: string | null;
  areas: {
    sa_idx: number;
    ar_name: string;
  }[];
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

export interface Driver {
  us_idx: number;
  us_name: string;
  us_contact: string;
  us_id: string;
  us_level: string;
  company_idx?: number;
  sh_idx?: number | null;
} 