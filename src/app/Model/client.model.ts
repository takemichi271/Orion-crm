export interface IClient {
  addresses: any;
  id: string;
  clientName: string;
  rnc: string;
  status: 'Active' | 'Pending' | 'Inactive';
  phone: string;
  email: string;
  enterpriseName: string;
  imageUrl?: string;
}

export class Client implements IClient {
  addresses: any;
  id: string;
  clientName: string;
  rnc: string;
  status: 'Active' | 'Pending' | 'Inactive';
  phone: string;
  email: string;
  enterpriseName: string;
  imageUrl?: string;

  constructor(
    addresses: any = 0,
    id: string = '',
    clientName: string = '',
    rnc: string = '',
    mode: string = '',
    status: 'Active' | 'Pending' | 'Inactive' = 'Active',
    phone: string = '',
    email: string = '',
    enterpriseName: string = '',
    imageUrl: string = '',
  ) {
    this.addresses = addresses;
    this.id = id;
    this.clientName = clientName;
    this.rnc = rnc;
    this.status = status;
    this.phone = phone;
    this.email = email;
    this.enterpriseName = enterpriseName;
    this.imageUrl = imageUrl;
  }
}
