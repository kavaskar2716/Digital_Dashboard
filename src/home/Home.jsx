import { useEffect,useState} from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { userActions } from '_store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CsaInput from '../csainput/CsaInput';
import ApiService from "../services/apiservice.service";
import LabTest from '../csainput/labtest';
import BedTest from '../csainput/testbed';
import CSAVerifier from '../csainput/csaverifier';
import Overall from 'csainput/overall';
export { Home };
function Home() {
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await ApiService.GetCSADetails();
      const table = response.Table[0];
      console.log(table);
      setTableData(table);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Tabs>
      <TabList>
        <Tab>CSA Input <span className="spc">{tableData.newcnt}</span></Tab>
        <Tab>CSA Lab Test <span className="spc">{tableData.LabtestCnt}</span></Tab>
        <Tab>CSA Test Bed <span className="spc">{tableData.csatestCnt}</span></Tab>
        <Tab>CSA Verifier <span className="spc">{tableData.verifierCnt}</span></Tab>
        <Tab>CSA Overall Report <span className="spc">{tableData.overallCnt}</span></Tab>
      </TabList>

        <TabPanel>
         <CsaInput />
        </TabPanel>
        <TabPanel>
        <LabTest />
        </TabPanel>
        <TabPanel>
        <BedTest />
        </TabPanel>
        <TabPanel>
        <CSAVerifier />
        </TabPanel>
        <TabPanel>
        <Overall />
        </TabPanel>

      </Tabs>
    );
}

export default Home;
