import type { AmazonData } from '../../types/index';
import styles from './AmazonDataView.module.css'

export const AmazonDataView = ({ data }: { data: AmazonData[] }) => {
  const headers = Object.keys(data[0])  as (keyof AmazonData)[]

  return <div className={styles.table} style={{ width: '100%', overflow:'scroll', height: '50vh'}}>
    <table>
      <thead>
        <tr>
          {headers.map((header) => <th className={styles.th} key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
       {data.map((row, i) => <tr key={i}>
          {headers.map((header, j) => <td className={styles.td} key={`header-${i}-${j}`}>{row[header] as string}</td>)}
       </tr>)}
      </tbody>
    </table>
  </div>
}