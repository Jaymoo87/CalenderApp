export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  email_verified: boolean;
  phone_verified: boolean;
}

export interface Event {
  id: number;
  user_id: User['id'];
  name: string;
  description?: string;
  location?: string;
  date_time: string;
}
