export interface CompanyUser {
  cnpj: string;
  companyName: string;
  email: string;
  segment: string;
  billingEmail?: string;
  phone?: string;
  address?: string;
  documentStatus?: 'Pendente' | 'Enviado' | 'Verificado';
}