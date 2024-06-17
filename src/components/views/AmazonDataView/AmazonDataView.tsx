import React from 'react';
import type { AmazonData } from '@/types/index';
import { Table } from '@/components/atoms/Table/Table';
import 'ka-table/style.css';

export const AmazonDataView = ({ data }: { data: AmazonData[] }) => {
  return <div>
    <Table 
      data={data}
    />
  </div>
}