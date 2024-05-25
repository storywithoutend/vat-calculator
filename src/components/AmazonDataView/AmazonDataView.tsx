import React from 'react';
import type { AmazonData } from '../../types/index';
import styles from './AmazonDataView.module.css'
import { Table } from '../Table/Table';
import 'ka-table/style.css';

export const AmazonDataView = ({ data }: { data: AmazonData[] }) => {
  return <div>
    <Table 
      data={data}
    />
  </div>
}