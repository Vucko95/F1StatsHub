import countryCodeData from './countryCodes';
import nationalityCodeData from './nationalityCodes';
 
export const getCountryCode = (country?: string) => {
    const countryCode = countryCodeData[country ?? ''] || '';
    return countryCode.toLowerCase();
  };

export const getNationalityCode = (nationality: string) => {
    const nationalityCode = nationalityCodeData[nationality] || '';
    return nationalityCode.toLowerCase();
  };


export const isDateInPast = (dateString: string) => {
    const currentDate = new Date();
    const date = new Date(dateString);
    return date < currentDate;
  };
