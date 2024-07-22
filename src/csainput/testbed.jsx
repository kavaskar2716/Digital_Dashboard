import React, { useState, useEffect, useRef } from 'react';
import './labtest.css';
import Modal from 'react-modal';
import ApiService from '../services/apiservice.service';
import { useSelector, useDispatch } from 'react-redux';
import { authActions,userActions } from '_store';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

Modal.setAppElement('#root');
const BedTest = () => {
  const initialcsabtateb = {
    csaMtmId: 0,
    csaTestId: 0,
    mtm: "",
    uutSerial: "",
    productName: "",
    blQty: "",
    customerName: "",
    csaReason: "",
    csatesterremarks: "",
    labTestEngineer: "",
    testBed: "",
    labTestRemarks: "",
    csaEngineer:"",
    csaStatus: "",
    notClean: 0,
    wwDependency: 0,
    wwDepStartDate: "",
    wwDepEndDate: "",
    labTestTriggerTime: "",
    labTestStartTime: "",
    labTestEndTime: "",
    csaStartTime: "",
    csaEndTime: "",
    csaVerifier: "",
    csaVerifiedTime: "",
    csaVerifierStatus: "",
    csaVerifierRemarks: "",
    csaFilename: "",
    str: ""
  };

  const savejson = {
    csaId: 0,
    product: "",
    category: "",
    checkPoint: "",
    result: "",
    remarks: "",
    status: "",
    machineSerial: ""
  };
  const [localStorageValue, setLocalStorageValue] = useState(null);
  const dispatch = useDispatch();
  const [csab, setcsab] = useState(initialcsabtateb);
  const [csaj, setcsaj] = useState(savejson);
  const [rowData, setRowData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [tableRes, setTableres] = useState([]);
  const [tableRes1, setTableres1] = useState([]);
  useEffect(() => {
    dispatch(userActions.getAll());

    let storedName = localStorage.getItem('UserName');
    if (storedName) {
      // Remove double quotes from the storedName
      storedName = storedName.replace(/"/g, '');
    }
    setLocalStorageValue(storedName);
  }, [dispatch]);

  useEffect(() => {
    console.log("HII", localStorageValue);
    fetchData();
  }, [localStorageValue]); // This effect runs whenever localStorageValue changes
  const fetchData = async () => {
    try {
      const response = await ApiService.GetCSADetails();
      const dataWithIndex = response.Table3.map((row, index) => ({
        index: index + 1,
        ...row,
      }));
      setRowData(dataWithIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleClear = () => {
    setcsab(initialcsabtateb);
  };
  const ActionButtonsRenderer = ({ data }) => {
    return (
      <>
        <button onClick={() => editItemb(data)} className="nim"><i className="fa fa-edit edi"></i></button>
        <button onClick={() => openModal(data)} className="vie">View</button>
        <button onClick={() => openModaledit(data)} className="edit">Edit</button>
      </>
    );
  };
  const ActionButtonsRenderer1 = ({ data }) => {
    return (
      <>
        <button onClick={() => editItemj(data)} className="nim"><i className="fa fa-edit edi"></i></button>
      </>
    );
  };
  const download = ({ data }) => {
    return (
      <>
        <button onClick={() => downloadFile(data)} className="nim"><i className="fa fa-download edi"></i></button>
      </>
    );
  };
  const downloadFile = async (item) => {
    try {
      const fileName = item.csa_filename; // Assuming item is correctly passed as an argument
      console.log('Sending request to download file:', fileName);

      // Call ApiService to download the file
      const response = await ApiService.downloadCSAFiles({ fileName: fileName });

      // Assuming response is a Blob or file data, handle the file download
      if (response) {
        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response]));

        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Set the filename for download
        document.body.appendChild(link);
        link.click();
        link.remove();

        console.log('File downloaded successfully.');
      } else {
        console.error('Failed to download file: Empty response.');
      }

      // Ensure any necessary state updates here if needed
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle errors as needed
    }
  };

  const openModal = async (row) => {
    setModalIsOpen(true);
    try {
      const response = await ApiService.PostCSAJsonChecklist({ serial: row.uut_serial });
      const tableRes = response.Table;
      const processedData = tableRes.map((c) => {
        if (c.Category === 'CSA_Machine_Details' || c.Category === 'Document Check Item'|| c.Category === 'BIOS_Level_Checking' || c.Category === 'Hardware_OS_Level_Checking' || c.Category === 'Device_port_Test' || c.Category === 'Functional_Test'|| c.Category === 'Extended_Test' || c.Category === 'MDA Time' || c.Category === 'Document Check Item') {
          if (c.CheckPoint === 'MTM' || c.CheckPoint === 'MTM Type' || c.CheckPoint === 'Serial Number' || c.CheckPoint === 'Time In' || c.CheckPoint === 'Time Out' || c.CheckPoint === 'DateTime'|| c.CheckPoint === 'Brand Name' || c.CheckPoint ==='Configuration'|| c.CheckPoint ==='BIOS Version'|| c.CheckPoint ==='BIOS Version'|| c.CheckPoint === 'BIOS Version' || c.CheckPoint === 'CPU Speed and cache' || c.CheckPoint === 'Memory Size and Bus' || c.CheckPoint === 'WIN 10 License(OA2OA3 Status)' || c.CheckPoint === 'System DateTime before explore OS' || c.CheckPoint === 'MTM Serial No'|| c.CheckPoint === 'HDD' || c.CheckPoint ==='Onboard MAC address'||c.CheckPoint === 'WIFI MAC Address' || c.CheckPoint === 'Win10 DPK PN' || c.CheckPoint === 'UUID' || c.CheckPoint === 'Start up sequence' || c.CheckPoint === 'Video Card' || c.CheckPoint === 'On Screen Branding'|| c.CheckPoint === 'Special Setting if Any' || c.CheckPoint ==='EEPROM Update'  || c.CheckPoint === 'Special Setting for Windows 10 OS' || c.CheckPoint === 'ODD' || c.CheckPoint === 'IAMT Feature'|| c.CheckPoint === 'Add on Cards' || c.CheckPoint ==='All USB Port Display in BIOS'  || c.CheckPoint ==='OS(preload)'  || c.CheckPoint ==='Version'  || c.CheckPoint ==='Service Pack details' || c.CheckPoint === 'Disk Management Check' || c.CheckPoint === 'Partition Details' || c.CheckPoint === 'CDDVDDVDRW combo Testing' || c.CheckPoint === 'E-SATA port Testing' || c.CheckPoint === 'AudioMIC port testing' || c.CheckPoint === 'Battery Test'|| c.CheckPoint === 'USB 2.03.0 Testing' || c.CheckPoint ==='VGADP port Testing'||c.CheckPoint === 'LAN' || c.CheckPoint === 'Smartcard Check' || c.CheckPoint === 'Software User Guide' || c.CheckPoint === 'PCI Express' || c.CheckPoint === 'Web Cam testing' || c.CheckPoint === 'Wirelss Connection(NB)'|| c.CheckPoint === 'Card Reader' || c.CheckPoint ==='1394 port Testing (EEE)'  || c.CheckPoint === 'BluetoothIR Testing(NB)' || c.CheckPoint === 'Finger Print reader' || c.CheckPoint === 'WWAN Test'|| c.CheckPoint === 'Add on cards if any' || c.CheckPoint === 'Device Manager' || c.CheckPoint === 'OS Activation' || c.CheckPoint === 'Resolution' || c.CheckPoint === 'Antivirus Update' || c.CheckPoint === 'Multiple Dispaly Test(2 or more)' || c.CheckPoint === 'FN Key Test'|| c.CheckPoint === 'Wake on LAN Testing' || c.CheckPoint ==='Video/Audio Test'||c.CheckPoint === 'Special application test for ant new software if any' || c.CheckPoint === 'Multiple Dispaly Test(2 or more)' || c.CheckPoint === 'Lenovo 1 link testing' || c.CheckPoint === 'LED Test' || c.CheckPoint === 'Antivirus Scanning' || c.CheckPoint === 'Smart USB protection Function check'|| c.CheckPoint === 'Individual USB port Disable testing' || c.CheckPoint === 'Diagnostic Test' || c.CheckPoint === 'Rupee Symbol testing' || c.CheckPoint === 'RCD Testing' || c.CheckPoint === 'WIN10 Desktop application' || c.CheckPoint === 'Recovery Testing After F11(PBR for Win10)' || c.CheckPoint === 'MDA test Result'|| c.CheckPoint === 'Win8 Start screen Apps' || c.CheckPoint ==='For Win10 Downgrades to Win7' || c.CheckPoint === 'MDA Timing Test Results-Before Recovery' || c.CheckPoint === 'Windows Start (Power ON to win Desktop)-Before Recovery' || c.CheckPoint === 'System Shutdown -Before Recovery' || c.CheckPoint === 'Resume from Sleep (S3) -Before Recovery' || c.CheckPoint === 'Resume from Hibernate (S4) -Before Recovery' || c.CheckPoint === 'MDA Timing Test Results-After Recovery'|| c.CheckPoint === 'Windows Start (Power ON to win Desktop)-After Recovery' || c.CheckPoint ==='System Shutdown -After Recovery'||c.CheckPoint === 'Resume from Sleep (S3) -After Recovery' || c.CheckPoint === 'Resume from Hibernate (S4) -After Recovery' || c.CheckPoint === 'Ensure Installed Applications and patches detail with version was taken print using Belarc Advisor Utility' || c.CheckPoint === 'Ensure Hardware configuration,shipgroup as per  PRS | SAP BOM | Windchill BOM' || c.CheckPoint === 'Ensure attached golden report,  work instructions if it is Special Bid MTM' || c.CheckPoint === 'Ensure attached the License linkage (Free good) incase of any software is preloaded in Custom OS as per customer requirement' || c.CheckPoint === 'Quality Audit Status' || c.CheckPoint === 'if any Error'|| c.CheckPoint === 'Error Description' || c.CheckPoint ==='Corrective Action'||c.CheckPoint === 'New Updates') {
            return c;
          }
        }
        return null;
      }).filter(c => c !== null);

      setTableres(processedData);
    } catch (error) {
      console.error('Error fetching modal data:', error);
    }
  };
  const openModaledit = async (row) => {
    setModalIsOpen1(true);
    try {
      const response = await ApiService.PostCSAJsonChecklist({ serial: row.uut_serial });
      const tableRes1 = response.Table.map((row, index) => ({
        index: index + 1,
        ...row,
      }));
      setTableres1(tableRes1);

    } catch (error) {
      console.error('Error fetching modal data:', error);
    }
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setTableres([]);
  };
  const closeModal1 = () => {
    setModalIsOpen1(false);
    setTableres1([]);
  };
  const [columnDefs] = useState([
    {
      headerName: '#',
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,

      filter: false,
      sortable: false,
      minWidth: 150,
      maxWidth: 150
    },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true, minWidth: 50, width:50,maxWidth: 50 },
    { field: 'mtm', headerName: 'MTM', sortable: true, filter: true, floatingFilter: true, minWidth: 100,width:100,maxWidth: 100},
    { field: 'uut_serial', headerName: 'Serial NO', sortable: true, filter: true, floatingFilter: true, minWidth: 100,width:100,
      maxWidth: 100 },
    { field: 'product_name', headerName: 'Model', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'test_bed', headerName: 'Test Bed', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'csa_status', headerName: 'CSA Status', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'ww_dependency', headerName: 'Dependency', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'ww_dep_start_date', headerName: 'Dep start date', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'ww_dep_end_date', headerName: 'Dep end date', sortable: true, filter: true, floatingFilter: true , minWidth: 100,width:100,
      maxWidth: 100},
    { field: 'lab_test_remarks', headerName: 'Lab Test Remarks', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150},
    { field: 'csa_tester_remarks', headerName: 'CSA Tester Remarks', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150},
    { field: 'csa_engineer', headerName: 'CSA Engineer', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150},
    { field: 'csa_verifier_status', headerName: 'CSA Verifier Status', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150},

    {
      field: 'csa_filename',
      headerName: 'CSA filename',
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: download,
 minWidth: 70,width:70,
      maxWidth: 70
    },
    { field: 'csa_start_time', headerName: 'CSA Start Time', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150},
    { field: 'csa_end_time', headerName: 'CSA End Time', sortable: true, filter: true, floatingFilter: true , minWidth: 150,width:100,
      maxWidth: 150}
  ]);
  const [columnDefs1] = useState([
    {
      headerName: '#',
      field: 'actions',
      cellRenderer: ActionButtonsRenderer1,

      filter: false,
      sortable: false,
      minWidth: 100,
      maxWidth: 100
    },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true, minWidth: 50, maxWidth: 50 },
    { field: 'MachineSerial', headerName:'Serial', sortable: true, filter: true, floatingFilter: true },
    { field: 'Product', headerName: 'Product', sortable: true, filter: true, floatingFilter: true },
    { field: 'Category', headerName: 'Category', sortable: true, filter: true, floatingFilter: true },
    { field: 'CheckPoint', headerName: 'Checkpoint', sortable: true, filter: true, floatingFilter: true },
    { field: 'Result', headerName: 'Result', sortable: true, filter: true, floatingFilter: true },
    { field: 'Remarks', headerName: 'Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'Status', headerName: 'Status', sortable: true, filter: true, floatingFilter: true },


  ]);
  const handleInputChangev = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    if (name === 'mtm' && value.length > 8) {
      return;
    }
    setcsab({ ...csab, [name]: inputValue });
    setcsaj({ ...csaj, [name]: value });

  };

  const handleInputChangesw = (e) => {
    const { name, value } = e.target;
    setcsab((prevCsa) => ({
      ...prevCsa,
      [name]: value
    }));
  };
 const handleFileChangefile = (event) => {
        const file = event.target.files[0];
        setcsab({ ...csab, csaFilename: file });
    };
    const saveTutorialb = async (event) => {
      event.preventDefault();
      try {
        // Initialize updatedCsab with the current csab state
        let updatedCsab = { ...csab, csaEngineer: localStorageValue };

        // Set csaStartTime or csaEndTime based on the status
        if (updatedCsab.csaStatus === 'Inprogress') {
          updatedCsab = { ...updatedCsab, csaStartTime: new Date().toISOString() };
        } else if (updatedCsab.csaStatus === 'Completed') {
          updatedCsab = { ...updatedCsab, csaEndTime: new Date().toISOString() };
        }

        let response;
        if (updatedCsab.csaStatus === 'Completed') {
          response = await ApiService.uploadCSAFiles(updatedCsab);
        } else {
          response = await ApiService.PostManageCSAInput(updatedCsab);
        }

        console.log('Item saved/updated:', response);
        fetchData();
        setcsab(initialcsabtateb);
      } catch (error) {
        console.error('Error saving item:', error);
      }
    };


const savejsonfile = async (event) => {
  debugger;
  event.preventDefault();
  try {
    console.log('Sending data to API:', csaj);
    let response = await ApiService.PostManageCSAChecklist(csaj);
    console.log('Item saved/updated:', response);
    setcsaj(savejson); // Ensure savejson is defined properly
    setTableres1(tableRes1); // Ensure this updates the state correctly
  } catch (error) {
    console.error('Error saving item:', error);
  }
};

    const editItemb = (item) => {
      debugger;
        setcsab({
            csaTestId: item.csa_test_id,
            csaMtmId: item.csa_mtm_id,
            uutSerial: item.uut_serial,
            mtm: item.mtm,
            productName: item.model,
            testBed: item.test_bed,
            csaStatus: item.csa_status,
            csatesterremarks: item.csa_tester_remarks,
            csaFilename:item.csa_filename, // Initialize with null or undefined
            csaStartTime: item.csa_start_time,
            csaEngineer:localStorageValue,
            csaEndTime: item.csa_end_time,
            wwDependency: item.ww_dependency,
            wwDepStartDate: item.ww_dep_start_date,
            wwDepEndDate: item.ww_dep_end_date,
            str: 'UPD'
        });
 };
 const editItemj = (item) => {
  debugger;
  setcsaj({
      csaId: item.ID,
      product: item.Product,
      category: item.Category,
      checkPoint: item.CheckPoint,
      result: item.Result,
      remarks: item.Remarks,
      status: item.Status,
      machineSerial: item.MachineSerial
  });
};
const handlePrint = () => {
  window.print();
};
  const handleFileChangeJson = async (event) => {
    try {
      const formData = new FormData();
      formData.append('Json_report', event.target.files[0]);
      const response = await ApiService.PostAddCSAJsonDataIntoTbl(formData);
      console.log('Response from API:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  const gridRef = useRef();


  return (
    <>
      <div>
        <form className="formg" noValidate autoComplete="off" onSubmit={saveTutorialb}>
          <div className="row">
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="uutSerial" id="uutSerial" required
                  value={csab.uutSerial} onChange={handleInputChangev} />
                <label htmlFor="uutSerial">UUT Serial No</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="mtm" id="mtm" required
                  value={csab.mtm} onChange={handleInputChangev} />
                <label htmlFor="mtm">MTM</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="productName" id="productName" required
                  value={csab.productName} onChange={handleInputChangev} />
                <label htmlFor="productName">Product</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <select className="did-floating-select disableddno" name="testBed" id="testBed" required
                  value={csab.testBed} onChange={handleInputChangev}>
                     <option value="">Select Bed</option>
                  <option value="Bed-1">Bed-1</option>
                  <option value="Bed-2">Bed-2</option>
                  <option value="Bed-3">Bed-3</option>
                  <option value="Bed-4">Bed-4</option>
                  <option value="Bed-5">Bed-5</option>
                  <option value="Bed-6">Bed-6</option>
                  <option value="Bed-7">Bed-7</option>
                  <option value="Bed-8">Bed-8</option>
                </select>
                <label htmlFor="testBed" class="top4">CSA Test Bed</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <select className="did-floating-select disableddno" name="csaStatus" id="csaStatus" required
                  value={csab.csaStatus} onChange={handleInputChangev}>
                      <option value="">Select Status</option>
                  <option value="Inprogress">Inprogress</option>
                  <option value="Completed">Completed</option>
                </select>
                <label htmlFor="csaStatus"  class="top4">CSA Status</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="csatesterremarks" id="csatesterremarks" required
                  value={csab.csatesterremarks} onChange={handleInputChangev} />
                <label htmlFor="csaRemarks">CSA Remarks</label>
              </div>
            </div>
            {csab.csaStatus === 'Completed' && (
  <>
    <div className="col-3">
      <input type="file" name="Json_report" onChange={handleFileChangeJson} />
    </div>
    <div className="col-3">
      <input type="file" name="csaFilename" onChange={handleFileChangefile} />
    </div>
  </>
)}

            <div className="col-3">
            <div className="input-wrapper">
            <select
            className="did-floating-select disableddno"
            name="wwDependency"
            id="wwDependency"
            required
            value={csab.wwDependency}
            onChange={handleInputChangesw}
          >
            <option value="">Select Dependency</option>
            <option value="0">No Dependency</option>
            <option value="1">Dependency</option>

          </select>
          <label htmlFor="status" class="top1">Dependency</label>
            </div>
          </div>
          {csab.wwDependency === '1' && (
        <>
          <div className="col-3">
            <div className="input-wrapper">
              <input
                type="date"
                name="wwDepStartDate"
                id="wwDepStartDate"
                required
                value={csab.wwDepStartDate}
                onChange={handleInputChangesw}
              />
              <label htmlFor="ww_dep_start_date" class="top">Start Date</label>
            </div>
          </div>

          <div className="col-3">
            <div className="input-wrapper">
              <input
                type="date"
                name="wwDepEndDate"
                id="wwDepEndDate"
                required
                value={csab.wwDepEndDate}
                onChange={handleInputChangesw}
              />
              <label htmlFor="ww_dep_end_date" class="top">End Date</label>
            </div>
          </div>
        </>
      )}
            <div className="col-2">
              <button name="save" value="Save" className="submitgo" id="btSubmit">Submit</button>
            </div>
          </div>
        </form>
      </div>
      <div className="tabim ag-theme-alpine" style={{ height: 300, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Row Details">

      <div className="demo-section content-wrapper wide">
        <div class="row">
          <div class="col-10"> <h2 class="liscs">CSA Check List - PDY-DOC-QMS-00167 | Version : 3.3</h2></div>
          <div class="col-2"><button onClick={handlePrint} class="print">Print</button> <button onClick={closeModal} class="closef">Close</button></div>
        </div>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>

      <thead>
        <tr>
          <th colSpan="4"class="csa">CSA Machine Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {tableRes.map((c, index) => {
            if (c.Category === 'CSA_Machine_Details' || c.Category === 'Document Check Item') {
              return (
                <React.Fragment key={index}>
                  {c.CheckPoint === 'MTM' && (
                    <td>MTM : {c.Result}</td>
                  )}
                  {c.CheckPoint === 'Serial Number' && (
                    <td>Serial Number: {c.Result}</td>
                  )}
                  {c.CheckPoint === 'Time In' && (
                    <td>Time In: {c.Result}</td>
                  )}
                  {c.CheckPoint === 'Time Out' && (
                    <td>Time Out: {c.Result}</td>
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </tr>
        <tr>
          {tableRes.map((c, index) => {
            if (c.Category === 'CSA_Machine_Details') {
              return (
                <React.Fragment key={index}>
                  {c.CheckPoint === 'DateTime' && (
                    <td>DateTime : {c.Result}</td>
                  )}

                  {c.CheckPoint === 'MTM Type' && (
                    <td colspan="2">MTM Type: {c.Result}</td>
                  )}

                  {c.CheckPoint === 'Brand Name' && (
                    <td>Brand: {c.Result}</td>
                  )}

                </React.Fragment>
              );
            }
            return null;
          })}
        </tr>
        <tr>
          <td colspan="4">Reason For CSA :</td></tr>
          <tr>
          {tableRes.map((c, index) => {
            if (c.Category === 'CSA_Machine_Details') {
              return (
                <React.Fragment key={index}>
                  {c.CheckPoint === 'Configuration' && (
                    <td colspan="4">Configuration : {c.Result}</td>
                  )}


                </React.Fragment>
              );
            }
            return null;
          })}
        </tr>
        </tbody>
        </table>




        <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">BIOS Level Checking</td>
        </tr>
        <tr>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'BIOS Version' && (
            <>
              <td>BIOS Version</td>
              <td>{c.Result }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'MTM Serial No' && (
            <>
              <td>MTM Serial No</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'CPU Speed and cache' && (
            <>
              <td>CPU Speed and cache</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'ODD' && (
            <>
              <td>ODD</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Memory Size and Bus' && (
            <>
              <td>Memory Size and Bus</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'HDD' && (
            <>
              <td>HDD</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Video Card' && (
            <>
              <td>Video Card</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Onboard MAC address' && (
            <>
              <td>Onboard MAC address</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'On Screen Branding' && (
            <>
              <td>On Screen Branding</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'WIFI MAC Address' && (
            <>
              <td>WIFI MAC Address</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'WIN 10 License(OA2OA3 Status)' && (
            <>
              <td>WIN 10 License(OA2OA3 Status)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Win10 DPK PN' && (
            <>
              <td>Win10 DPK PN</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'System DateTime before explore OS' && (
            <>
              <td>System DateTime before explore OS</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'UUID' && (
            <>
              <td>UUID</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Special Setting if Any' && (
            <>
              <td>Special Setting if Any</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'IAMT Feature' && (
            <>
              <td>IAMT Feature</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'EEPROM Update' && (
            <>
              <td>EEPROM Update</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Special Setting for Windows 10 OS' && (
            <>
              <td>Special Setting for Windows 10 OS</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Start up sequence' && (
            <>
              <td>Start up sequence</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Add on Cards' && (
            <>
              <td>Add on cards if any</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'BIOS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'All USB Port Display in BIOS' && (
            <>
              <td>All USB Port Display in BIOS</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
      </tbody>
    </table>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">Hardware_OS_Level_Checking</td>
        </tr>
        <tr>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Hardware_OS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'OS(preload)' && (
            <>
              <td>OS(preload)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Version' && (
            <>
              <td>Version</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Hardware_OS_Level_Checking') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Service Pack details' && (
            <>
              <td>CPU Speed and cache</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
      </tbody>
    </table>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">Device Port Test</td>
        </tr>
        <tr>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Disk Management Check' && (
            <>
              <td>Disk Management Check</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Partition Details' && (
            <>
              <td>Partition Details</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'CDDVDDVDRW combo Testing' && (
            <>
              <td>CDDVDDVDRW combo Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'E-SATA port Testing' && (
            <>
              <td>E-SATA port Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'AudioMIC port testing' && (
            <>
              <td>AudioMIC port testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Battery Test' && (
            <>
              <td>Battery Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'USB 2.03.0 Testing' && (
            <>
              <td>USB 2.03.0 Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'VGADP port Testing' && (
            <>
              <td>VGADP port Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'LAN' && (
            <>
              <td>LAN</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Smartcard Check' && (
            <>
              <td>Smartcard Check</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Software User Guide' && (
            <>
              <td>Software User Guide</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'PCI Express' && (
            <>
              <td>PCI Express</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Web Cam testing' && (
            <>
              <td>Web Cam testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Wirelss Connection(NB)' && (
            <>
              <td>Wirelss Connection(NB)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Card Reader' && (
            <>
              <td>Card Reader</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === '1394 port Testing (EEE)' && (
            <>
              <td>1394 port Testing (EEE)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'BluetoothIR Testing(NB)' && (
            <>
              <td>BluetoothIR Testing(NB)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Finger Print reader' && (
            <>
              <td>Finger Print reader</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Device_port_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'WWAN Test' && (
            <>
              <td>WWAN Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Add on cards' && (
            <>
              <td>Add on cards if any</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

      </tbody>
    </table>

    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">Functional Test</td>
        </tr>
        <tr>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Device Manager' && (
            <>
              <td>Device Manager</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'OS Activation' && (
            <>
              <td>OS Activation</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Resolution' && (
            <>
              <td>Resolution</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Antivirus Update' && (
            <>
              <td>Antivirus Update</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Multiple Dispaly Test(2 or more)' && (
            <>
              <td>Multiple Dispaly Test(2 or more)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'FN Key Test' && (
            <>
              <td>FN Key Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Wake on LAN Testing' && (
            <>
              <td>Wake on LAN Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Video/Audio Test' && (
            <>
              <td>Video/Audio Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Special application test for ant new software if any' && (
            <>
              <td>Special application test for ant new software if any</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Multiple Dispaly Test(2 or more)' && (
            <>
              <td>Multiple Dispaly Test(2 or more)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Lenovo 1 link testing' && (
            <>
              <td>Lenovo 1 link testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'LED Test' && (
            <>
              <td>LED Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Antivirus Scanning' && (
            <>
              <td>Antivirus Scanning</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Smart USB protection Function check' && (
            <>
              <td>Smart USB protection Function check</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Functional_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Individual USB port Disable testing' && (
            <>
              <td>Individual USB port Disable testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>


      </tbody>
    </table>

    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">Extended Test</td>
        </tr>
        <tr>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
          <th class="itemd">Item</th>
          <th class="test">Test Parameter</th>
          <th class="remark">Remarks</th>
          <th class="stus">Status</th>
        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Extended_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Diagnostic Test' && (
            <>
              <td>Diagnostic Test</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Rupee Symbol testing' && (
            <>
              <td>Rupee Symbol testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Extended_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'RCD Testing' && (
            <>
              <td>RCD Testing</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'WIN10 Desktop application' && (
            <>
              <td>WIN10 Desktop application</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Extended_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Recovery Testing After F11(PBR for Win10)' && (
            <>
              <td>Recovery Testing After F11(PBR for Win10)</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

          {c.CheckPoint === 'Win8 Start screen Apps' && (
            <>
              <td>Win8 Start screen Apps</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Extended_Test') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'For Win10 Downgrades to Win7' && (
            <>
              <td>For Win10 Downgrades to Win7</td>
               <td>{c.Result || 'Nil' }</td>
               <td>{c.Remarks || 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>



      </tbody>
    </table>

    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <td colSpan="8" class="csa">MDA Time</td>
        </tr>
        <tr>
          <th style={{ width: '76.6%'}}></th>
          <th>Before Recovery</th>
          <th>After Recovery</th>

        </tr>
        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'MDA Timing Test Results-Before Recovery' && (
            <>
              <td>MDA Timing Test Results-Before Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>
              {c.CheckPoint === 'Windows Start (Power ON to win Desktop)-Before Recovery' && (
            <>
              <td>Windows Start (Power ON to win Desktop)-Before Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}





        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'System Shutdown -Before Recovery' && (
            <>
              <td>System Shutdown -Before Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>
           {c.CheckPoint === 'Resume from Sleep (S3) -Before Recovery' && (
            <>
              <td>Resume from Sleep (S3) -Before Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'Resume from Hibernate (S4) -Before Recovery' && (
            <>
              <td>Resume from Hibernate (S4) -Before Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'MDA Timing Test Results-After Recovery' && (
            <>
              <td>MDA Timing Test Results-After Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'Windows Start (Power ON to win Desktop)-After Recovery' && (
            <>
              <td>Windows Start (Power ON to win Desktop)-After Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'System Shutdown -After Recovery' && (
            <>
              <td>System Shutdown -After Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'Resume from Sleep (S3) -After Recovery' && (
            <>
              <td>Resume from Sleep (S3) -After Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'MDA Time') {
      return (
        <React.Fragment key={index}>

           {c.CheckPoint === 'Resume from Hibernate (S4) -After Recovery' && (
            <>
              <td>Resume from Hibernate (S4) -After Recovery</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}



        </React.Fragment>
      );
    }
    return null;
  })}
</tr>


      </tbody>
    </table>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <th colSpan="6" class="csa">
        Document Check Item</th>
        <th class="csa">Result</th>
          <th class="csa">Y/N/NA</th>
        </tr>

        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Ensure Installed Applications and patches detail with version was taken print using Belarc Advisor Utility' && (
            <>
              <td colSpan="6">Ensure Installed Applications and patches detail with version was taken print using Belarc Advisor Utility</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
              {c.CheckPoint === 'Ensure Hardware configuration,shipgroup as per  PRS | SAP BOM | Windchill BOM' && (
            <>
              <td colSpan="6">Ensure Hardware configuration,shipgroup as per  PRS | SAP BOM | Windchill BOM</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}





        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Ensure attached golden report,  work instructions if it is Special Bid MTM' && (
            <>
              <td colSpan="6">Ensure attached golden report,  work instructions if it is Special Bid MTM</td>
               <td>{c.Result || 'Nil' }</td>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
           {c.CheckPoint === 'Ensure attached the License linkage (Free good) incase of any software is preloaded in Custom OS as per customer requirement' && (
            <>
              <td colSpan="6">Ensure attached the License linkage (Free good) incase of any software is preloaded in Custom OS as per customer requirement</td>
               <td>{c.Result|| 'Nil' }</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}

        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
      </tbody>
    </table>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <th colSpan="7" class="csa" style={{ width: '76.6%'}}>
        Quality Audit Status</th>
        <th class="csa">PASS/FIAL</th>

        </tr>

        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Quality Audit Status' && (
            <>
              <td colSpan="7">Result</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

      </tbody>
    </table>

    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <th colSpan="8" class="csa">If Any Error</th>
        </tr>

        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Error Description' && (
            <>
              <td>Error Description</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
<tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'Corrective Action' && (
            <>
              <td style={{ width: '76.6%'}}>Corrective Action</td>
               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>

      </tbody>
    </table>

    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <th colSpan="8" class="csa">New Updates</th>
        </tr>

        <tbody>
        <tr>
  {tableRes.map((c, index) => {
    if (c.Category === 'Document Check Item') {
      return (
        <React.Fragment key={index}>
          {c.CheckPoint === 'New Updates' && (
            <>

               <td>{c.Status|| 'Nil' }</td>
            </>
          )}


        </React.Fragment>
      );
    }
    return null;
  })}
</tr>
      </tbody>
    </table>
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%'}}>
        <tr>
        <th colSpan="8" class="csa">Clearance Detail</th>
        </tr>
        <tr>
        <th>Description</th>
        <th>Name</th>
        <th>Signature</th>
        <th>Date</th>
        <th class="remark">Remarks</th>
        </tr>

        <tbody>
<tr>
<td><span class="boldview">CSA Audited By</span></td>
<td>
Yuvaraja Ramadass</td>
<td>






</td>
<td>
2022-12-19 19:31:53</td>
<td>
</td>
</tr>
<tr>
<td><span class="boldview">CSA Approved By</span></td>
<td>
Vishnu Priya</td>
<td>


	</td>
<td>
2022-12-27 09:57:47</td>
<td>

</td>
</tr>
<tr>
</tr>

</tbody>
    </table>
  </div>

</Modal>
<Modal isOpen={modalIsOpen1} onRequestClose={closeModal1} contentLabel="Row Details">
<button onClick={closeModal1}>Close</button>
<form className="formg" noValidate autoComplete="off" onSubmit={savejsonfile}>
          <div className="row">
            <div className="col-3">
              <div className="input-wrapper">
              <input type="text" name="csaId" id="csaId" class="vamu" value={csaj.csaId}  onChange={handleInputChangev} />
                <input type="text" name="machineSerial" id="machineSerial" required
                  value={csaj.machineSerial} onChange={handleInputChangev} />
                <label htmlFor="uutSerial">Serial No</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="category" id="category" required
                  value={csaj.category} onChange={handleInputChangev} />
                <label htmlFor="mtm">Category</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="product" id="product" required
                  value={csaj.product} onChange={handleInputChangev} />
                <label htmlFor="productName">Product</label>
              </div>
            </div>

            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="checkPoint" id="checkPoint" required
                  value={csaj.checkPoint} onChange={handleInputChangev} />
                <label htmlFor="csaRemarks">CheckPoint</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="result" id="result" required
                  value={csaj.result} onChange={handleInputChangev} />
                <label htmlFor="csaRemarks">Result</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <input type="text" name="remarks" id="remarks" required
                  value={csaj.remarks} onChange={handleInputChangev} />
                <label htmlFor="remarks">Remarks</label>
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <select className="did-floating-select disableddno" name="status" id="status" required
                  value={csaj.status} onChange={handleInputChangev}>
                     <option value="">Select Status</option>
                  <option value="Pass">PASS</option>
                  <option value="Fail">FAIL</option>

                </select>
                <label htmlFor="testBed" class="top4">Select status</label>
              </div>
            </div>

            <div className="col-1">
              <button name="save" value="Save" className="submitgo" id="btSubmit">Submit</button>
            </div>
            <div className="col-1">
              <button type="submit" className="submitgo clear" id="btSubmit" onClick={handleClear}>Clear</button>
            </div>
          </div>
        </form>
<AgGridReact
          ref={gridRef}
          rowData={tableRes1}
          columnDefs={columnDefs1}
          pagination={false}
          paginationPageSize={20}
        />
</Modal>
    </>
  );
};

export default BedTest;
