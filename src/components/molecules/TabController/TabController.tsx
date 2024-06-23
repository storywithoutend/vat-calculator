import styles from "./TabController.module.css"
import type { Tab } from "@/app/page"
import classNames from "classnames"
export const TabController = ({
  tab,
  onChange,
}: {
  tab: Tab
  onChange: (tab: Tab) => void
}) => {
  return (
    <div className={styles.tabController}>
      <div
        className={classNames(styles.tab, {
          [styles.active]: tab === "amazon",
        })}
        onClick={() => onChange("amazon")}
      >
        Amazon
      </div>
      <div
        className={classNames(styles.tab, {
          [styles.active]: tab === "invoice",
        })}
        onClick={() => onChange("invoice")}
      >
        Invoice
      </div>
      <div
        className={classNames(styles.tab, {
          [styles.active]: tab === "output",
        })}
        onClick={() => onChange("output")}
      >
        Output
      </div>
    </div>
  )
}
