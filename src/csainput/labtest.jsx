import React, { useState, useEffect, useRef } from 'react';
import './labtest.css';
import ApiService from "../services/apiservice.service";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import moment from 'moment';
const LabTest = () => {
  const initialCsaStates = {
    csaMtmId: 0,
    csaTestId: 0,
    mtm: "",
    uutSerial: "",
    productName: "",
    blQty: "",
    customerName: "",
    csaReason: "",
    csaRemarks: "",
    labTestEngineer: "",
    csaEngineer: "",
    testBed: "",
    labTestRemarks: "",
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
    str: "" // default value
  };

  const [csas, setCsas] = useState(initialCsaStates);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const handleClear = () => {
    setCsas(initialCsaStates);
  };
  const fetchData = async () => {
    try {
      const response = await ApiService.GetCSADetails();
     // const data = response.Table1; // Adjust based on actual response structure

      // Adding index to each row
      const dataWithIndex = response.Table2.map((row, index) => ({
        index: index + 1,
        ...row, // Assuming each row contains other properties
      }));

      setRowData(dataWithIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const ActionButtonsRenderer = ({ data }) => {
    return (
      <>
        <button onClick={() => editItem(data)} class="nim"><i class="fa fa-edit edi"></i></button>
        <button onClick={() => DelItem(data)} class="nim"><i class="fa fa-trash tra"></i></button>
      </>
    );
  };
  const [columnDefs] = useState([
    {
      headerName: '#',
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      filter: false,
      sortable: false,
      minWidth: 70,
      maxWidth: 70
    },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true,minWidth: 50,
      maxWidth: 50 },
    { field: 'mtm', headerName: 'MTM', sortable: true, filter: true, floatingFilter: true },
    { field: 'uut_serial', headerName: 'Serial NO', sortable: true, filter: true, floatingFilter: true },
    { field: 'model', headerName: 'Model', sortable: true, filter: true, floatingFilter: true },
    { field: 'bl_qty', headerName: 'BL Qty', sortable: true, filter: true, floatingFilter: true },
    { field: 'customer_name', headerName: 'Customer Name', sortable: true, filter: true, floatingFilter: true },
    { field: 'Lab_test_engineer', headerName: 'Lab Test Engineer', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_remarks', headerName: 'CSA Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'lab_test_remarks', headerName: 'Lab Test Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_status', headerName: 'CSA Status', sortable: true, filter: true, floatingFilter: true },

    { field: 'ww_dependency', headerName: 'Dependency', sortable: true, filter: true, floatingFilter: true },
    { field: 'ww_dep_start_date', headerName: 'Dependency Start Date', sortable: true, filter: true, floatingFilter: true },
    { field: 'ww_dep_end_date', headerName: 'Dependency End Date', sortable: true, filter: true, floatingFilter: true },
    { field: 'lab_test_trigger_time', headerName: 'Lab Test Trigger Time', sortable: true, filter: true, floatingFilter: true },
    { field: 'lab_test_start_time', headerName: 'Lab Test Start Time', sortable: true, filter: true, floatingFilter: true },
    { field: 'lab_test_end_time', headerName: 'Lab Test End Time', sortable: true, filter: true, floatingFilter: true },
    { field: 'HOURS', headerName: 'HOURS', sortable: true, filter: true, floatingFilter: true },

  ]);


  const handleInputChange = event => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
     // Perform validation for mtm field
     if (name === 'uutSerial' && value.length > 8) {
      return; // Or handle the validation error as per your UI/UX requirements
    }

    setCsas({ ...csas, [name]: inputValue });
  };
  const handleInputChangesl = (e) => {
    const { name, value } = e.target;
    setCsas((prevCsa) => ({
      ...prevCsa,
      [name]: value
    }));

  };
  const saveTutorials = async event => {
    event.preventDefault();
    try {
      const response = await ApiService.PostManageCSAInput(csas);
      console.log('Item saved/updated:', response);
      fetchData();
      setCsas(initialCsaStates);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const editItem = (item) => {
    let labTestTriggerTime = csas.labTestTriggerTime;

    // Conditionally update labTestTriggerTime if csa_status is 'To be Start'
    if (item.csa_status === 'To be Start') {
      labTestTriggerTime = new Date().toISOString(); // Update to current ISO date/time
    }

    // Update the state with only the specified fields
    setCsas((prevCsas) => ({
      ...prevCsas,                // Spread previous state
      csaTestId: item.csa_test_id,
      csaMtmId: item.csa_mtm_id,
      mtm: item.mtm,
      uutSerial: item.uut_serial,
      csaReason: item.csa_reason,
      productName: item.product_name,
      blQty: item.bl_qty,
      customerName: item.customer_name,
      csaRemarks: item.csa_remarks,
      labTestTriggerTime: labTestTriggerTime,
      csaStatus: item.csa_status,
      labTestRemarks: item.lab_test_remarks,
      labTestEngineer: item.Lab_test_engineer,
      labTestStartTime: item.lab_test_start_time,
      labTestEndTime: item.lab_test_end_time,
      wwDependency: item.ww_dependency,
      wwDepStartDate: item.ww_dep_start_date,
      wwDepEndDate: item.ww_dep_end_date,
      str: "UPD"                  // Update 'str' field
    }));
  };

  const DelItem = async (item) => {
    const deleteData = {
      csaMtmId: item.csa_mtm_id,
      str: "DEL"
    };

    try {
      // Now make the API call using the updated state
      const response = await ApiService.PostManageCSAInput(deleteData);
      console.log('Item deleted:', response);
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const gridRef = useRef();

  return (
    <>
      <div>
         <form className="formg" noValidate autoComplete="off" onSubmit={saveTutorials}>
        <div className="row">
          <div className="col-3">
            <div className="input-wrapper">
              <select className="did-floating-select disableddno" name="labTestEngineer" id="labTestEngineer"
                required value={csas.labTestEngineer} onChange={handleInputChange}>
                    <option value="">Select Engineer</option>
                <option value="Yuvaraj">Yuvaraj</option>
                <option value="Gobi">Gobi</option>
              </select>
              <label htmlFor="category" class="top">Lab Test Engineer</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
              <input type="text" name="csaTestId" id="csaTestId" className="disnon"
                value={csas.csaTestId} onChange={handleInputChange} />
                 <input type="text" name="csaMtmId" id="csaMtmId" className="disnon"
                value={csas.csaMtmId} onChange={handleInputChange} />
              <input type="text" name="mtm" id="mtm" required
                value={csas.mtm} onChange={handleInputChange} />
              <label htmlFor="MTM">MTM</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
              <input type="text" name="uutSerial" id="uutSerial" required
                value={csas.uutSerial} onChange={handleInputChange} />
              <label htmlFor="product">Serial No</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
              <input type="text" name="csaReason" id="csaReason" required
                value={csas.csaReason} onChange={handleInputChange} />
              <label htmlFor="bl_qty">CSA Reason</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
              <input type="text" name="labTestRemarks" id="labTestRemarks" required
                value={csas.labTestRemarks} onChange={handleInputChange} />
              <label htmlFor="customer_name">Lab Test Remarks</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
              <select className="did-floating-select disableddno" name="csaStatus" id="csaStatus" required
                value={csas.csaStatus} onChange={handleInputChange} placeholder=''>
                  <option value="">Select Status</option>
                <option value="Lab Test Started">Lab Test Started</option>
                <option value="Lab Test Completed">Lab Test Completed</option>
              </select>
              <label htmlFor="status" class="top">CSA Status</label>
            </div>
          </div>
          <div className="col-3">
            <div className="input-wrapper">
            <select
            className="did-floating-select disableddno"
            name="wwDependency"
            id="wwDependency"
            required
            value={csas.wwDependency}
            onChange={handleInputChangesl}
          >
            <option value="">Select Dependency</option>
            <option value="0">No Dependency</option>
            <option value="1">Dependency</option>

          </select>
          <label htmlFor="status" class="top1">Dependency</label>
            </div>
          </div>
          {csas.wwDependency === '1' && (
        <>
          <div className="col-3">
            <div className="input-wrapper">
              <input
                type="date"
                name="wwDepStartDate"
                id="wwDepStartDate"
                required
                value={csas.wwDepStartDate}
                onChange={handleInputChangesl}
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
                value={csas.wwDepEndDate}
                onChange={handleInputChangesl}
              />
              <label htmlFor="ww_dep_end_date" class="top">End Date</label>
            </div>
          </div>
        </>
      )}
          <div className="col-1">
            <button name="save" value="Save" className="submitgo" id="btSubmit">Submit</button>
          </div>
          <div className="col-1">
              <button type="submit" className="submitgo clear" id="btSubmit" onClick={handleClear}>Clear</button>
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
    </>
  );
};

export default LabTest;
