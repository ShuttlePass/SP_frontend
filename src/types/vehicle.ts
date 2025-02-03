export interface Vehicle {
  id: string;
  number: string;    
  name: string;      
  phone: string;      
  type: '등원' | '하원';      
  instructor: string;  
  contact: string;     
  route: string;   
  stops: BusStop[];   
}

export interface BusStop {
  id: string;
  name: string;       
  address: string;    
  order: number;      
  time: string;       
  students: string[]; 
} 