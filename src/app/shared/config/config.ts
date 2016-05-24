export const API_CONFIG: ApiConfig = {
  base: 'http://localhost:59176/api',
  propertyApi: {
    base: '/properties'
  },
  companyApi: {
    base: '/companies'
  }
};

interface ApiConfig {
  base: string;
  propertyApi: {
    base: string
  },
  companyApi: {
    base: string
  }
}
