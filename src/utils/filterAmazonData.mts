import { AmazonData } from '../types';

export const filterAmazonData = async (data: AmazonData[]): Promise<AmazonData[]> => {
  return data.filter((item) => item.TAX_REPORTING_SCHEME === 'UNION-OSS')
}