import styles from "./TabController.module.css";
import type { Tab } from "@/app/page";
export const TabController = ({
  tab,
  onChange,
}: {
  tab: Tab,
  onChange: (tab: Tab) => void
}) => {
  return (
    <div className={styles.tabController}>
      <div onClick={() => onChange('amazon')}>Amazon</div>
      <div onClick={() => onChange('invoice')}>Invoice</div>
      <div onClick={() => onChange('output')}>Output</div>
    </div>
  )
}