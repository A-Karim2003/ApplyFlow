export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

//* fields used for the Companies House response
export type CompaniesHouseItem = {
  title: string;
  company_number: string;
  company_status: string;
  address?: {
    locality: string;
  };
};

export type SearchResult = {
  name: string;
  companyNumber: string;
  location?: string;
};

export type CompaniesHouseResponse = {
  items: CompaniesHouseItem[];
};
