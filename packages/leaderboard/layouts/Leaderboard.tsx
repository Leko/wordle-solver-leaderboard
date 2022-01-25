import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import { LayoutPage } from "./page";
import { NextLinkComposed } from "../components/NextLinkComposed";
import { TabContext, TabPanel } from "@mui/lab";
import { useRouter } from "next/router";

type Props = {
  title: string;
  maxWordleId: number;
};

export const LayoutLeaderboard: React.FC<Props> = (props) => {
  const router = useRouter();
  const { title, maxWordleId, children } = props;
  return (
    <LayoutPage title={title}>
      <TabContext value={router.asPath}>
        <TabList aria-label="Tabs">
          <Tab
            label={`Today (#${maxWordleId})`}
            value="/"
            to="/"
            component={NextLinkComposed}
          />
          {/* <Tab
            label="Last 7 days"
            value="/leaderboard/last7days"
            to="/leaderboard/last7days"
            component={NextLinkComposed}
          /> */}
          <Tab
            label="All"
            value="/leaderboard/all"
            to="/leaderboard/all"
            component={NextLinkComposed}
          />
        </TabList>
        <TabPanel value={router.asPath}>{children}</TabPanel>
      </TabContext>
    </LayoutPage>
  );
};
