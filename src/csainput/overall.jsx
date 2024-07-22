import React, { useState, useRef, useEffect } from 'react';
import './labtest.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Modal from 'react-modal';
import ApiService from '../services/apiservice.service';

Modal.setAppElement('#root');

const Overall = () => {
  const gridRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [rowDatas, setRowDatas] = useState([]);
  const [tableRes, setTableres] = useState([]);

  useEffect(() => {
    fetchData();

  }, []);
  const handlePrint = () => {
    window.print();
  };
  const fetchData = async () => {
    try {
      const response = await ApiService.GetCSADetails();
      const dataWithIndex = response.Table5.map((row, index) => ({
        index: index + 1,
        ...row,
      }));
      setRowData(dataWithIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columnDefs = [
    {
      headerName: '#',
      field: 'action',
      cellRenderer: (params) => (
        <button onClick={() => openModal(params.data)} class="eye"><i class="fa fa-eye"></i></button>
      ),
      minWidth: 50,
      maxWidth: 50
    },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true, minWidth: 50, maxWidth: 50 },
    { field: 'mtm', headerName: 'MTM', sortable: true, filter: true, floatingFilter: true },
    { field: 'uut_serial', headerName: 'Serial NO', sortable: true, filter: true, floatingFilter: true },
    { field: 'model', headerName: 'Product Name', sortable: true, filter: true, floatingFilter: true },
    { field: 'test_bed', headerName: 'Test Bed', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_engineer', headerName: 'CSA Engineer', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_status', headerName: 'CSA Status', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_verifier', headerName: 'CSA Verifier', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_verifier_remarks', headerName: 'CSA Verifier Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'lab_test_remarks', headerName: 'Lab Test Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_remarks', headerName: 'CSA Remarks', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_verifier_status', headerName: 'CSA Verifier Status', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_filename', headerName: 'CSA Filename', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_start_time', headerName: 'CSA Start Time', sortable: true, filter: true, floatingFilter: true },
    { field: 'csa_end_time', headerName: 'CSA End Time', sortable: true, filter: true, floatingFilter: true },
  ];

  const exportToCsv = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const openModal = async (row) => {
    setModalIsOpen(true);

    try {
      const response = await ApiService.PostCSAJsonChecklist({ serial: row.uut_serial });
      const tableRes = response.Table.filter(c => {
        return ['CSA_Machine_Details', 'Document Check Item', 'BIOS_Level_Checking', 'Hardware_OS_Level_Checking', 'Device_port_Test', 'Functional_Test', 'Extended_Test', 'MDA Time', 'Document Check Item'].includes(c.Category) &&
          ['MTM', 'MTM Type', 'Serial Number', 'Time In', 'Time Out', 'DateTime', 'Brand Name', 'Configuration', 'BIOS Version', 'CPU Speed and cache', 'Memory Size and Bus', 'WIN 10 License(OA2OA3 Status)', 'System DateTime before explore OS', 'MTM Serial No', 'HDD', 'Onboard MAC address', 'WIFI MAC Address', 'Win10 DPK PN', 'UUID', 'Start up sequence', 'Video Card', 'On Screen Branding', 'Special Setting if Any', 'EEPROM Update', 'Special Setting for Windows 10 OS', 'ODD', 'IAMT Feature', 'Add on Cards', 'All USB Port Display in BIOS', 'OS(preload)', 'Version', 'Service Pack details', 'Disk Management Check', 'Partition Details', 'CDDVDDVDRW combo Testing', 'E-SATA port Testing', 'AudioMIC port testing', 'Battery Test', 'USB 2.03.0 Testing', 'VGADP port Testing', 'LAN', 'Smartcard Check', 'Software User Guide', 'PCI Express', 'Web Cam testing', 'Wirelss Connection(NB)', 'Card Reader', '1394 port Testing (EEE)', 'BluetoothIR Testing(NB)', 'Finger Print reader', 'WWAN Test', 'Add on cards if any', 'Device Manager', 'OS Activation', 'Resolution', 'Antivirus Update', 'Multiple Dispaly Test(2 or more)', 'FN Key Test', 'Wake on LAN Testing', 'Video/Audio Test', 'Special application test for ant new software if any', 'Multiple Dispaly Test(2 or more)', 'Lenovo 1 link testing', 'LED Test', 'Antivirus Scanning', 'Smart USB protection Function check', 'Individual USB port Disable testing', 'Diagnostic Test', 'Rupee Symbol testing', 'RCD Testing', 'WIN10 Desktop application', 'Recovery Testing After F11(PBR for Win10)', 'MDA test Result', 'Win8 Start screen Apps', 'For Win10 Downgrades to Win7', 'MDA Timing Test Results-Before Recovery', 'Windows Start (Power ON to win Desktop)-Before Recovery', 'System Shutdown -Before Recovery', 'Resume from Sleep (S3) -Before Recovery', 'Resume from Hibernate (S4) -Before Recovery', 'MDA Timing Test Results-After Recovery', 'Windows Start (Power ON to win Desktop)-After Recovery', 'System Shutdown -After Recovery', 'Resume from Sleep (S3) -After Recovery', 'Resume from Hibernate (S4) -After Recovery', 'Ensure Installed Applications and patches detail with version was taken print using Belarc Advisor Utility', 'Ensure Hardware configuration,shipgroup as per  PRS | SAP BOM | Windchill BOM', 'Ensure attached golden report,  work instructions if it is Special Bid MTM', 'Ensure attached the License linkage (Free good) incase of any software is preloaded in Custom OS as per customer requirement', 'Quality Audit Status', 'if any Error', 'Error Description', 'Corrective Action', 'New Updates'].includes(c.CheckPoint);
      });

      setTableres(tableRes);

      // Fetch Signature List
      const responses = await ApiService.Postsignaturelist({ serial: row.uut_serial });
      const dataWithIndexs = responses.Table.map((rows, index) => {
        const { csa_start_time,csa_Verified_Time, csa_engineer, csa_verifier, csa_tester_remarks, csa_verifier_remarks} = rows;

        return {
          index: index + 1,
          csa_start_time,
          csa_Verified_Time,
          csa_engineer,
          csa_verifier,
          csa_tester_remarks,
          csa_verifier_remarks,
          ...rows,
        };
      });

      const tableDatas = dataWithIndexs.map(rows => {
        const entries = [];

        if (rows.csa_engineer) {
          entries.push({
            description: "CSA Audited By",
            name: rows.csa_engineer,
            date: rows.csa_start_time,
            remarks:rows.csa_tester_remarks
          });
        }

        if (rows.csa_verifier) {
          entries.push({
            description: "CSA Approved By",
            name: rows.csa_verifier,
            date: rows.csa_Verified_Time,
            remarks:rows.csa_verifier_remarks
          });
        }

        return entries;
      }).flat();  // Flatten the array of arrays into a single array

      setRowDatas(tableDatas);
    } catch (error) {
      console.error('Error fetching modal data:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTableres([]); // Clear the table response data
  };

  return (
    <div>
      <button onClick={exportToCsv}><i class="fa fa-download"></i></button>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
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
    <table className="table-customers table table-bordered" cellSpacing="0" cellPadding="0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th colSpan="8" className="csa">Clearance Detail</th>
              </tr>
              <tr className="csa">
                <th>Description</th>
                <th>Name</th>
                <th>Signature</th>
                <th>Date</th>
                <th className="remark">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rowDatas.map((detail, index) => (
                <tr key={index}>
                  <td><span className="boldview">{detail.description}</span></td>
                  <td>{detail.name}</td>
                  <td>
  {(() => {
    const nameToImageMap = {
      ps15: "/priya.png",
      "vkamalakanna": "/Vishnu.png",
      "Vishnu Priya": "/Vishnu.png",
      "ag9": "/Alex.png",
      "Alex ": "/Alex.png",
      "Bala": "/Bala.png",
      "bc2": "/Bala.png",
      "gv3": "/Gobi.png",
      "Gobi": "/Gobi.png",
      "km10": "/Karthi.png",
      "Karthi": "/Karthi.png",
      "kvenkadasal1": "/kumaresh.png",
      "kumaresh": "/kumaresh.png",
      "nb6": "/Nova.png",
      "Nova": "/Nova.png",
      "sv18": "/sk.png",
      "Sakthi": "/sk.png",
      "yr1": "/Yuva.png",
      "Yuvaraja Ramadass": "/Yuva.png",
      "jsujatha": "/suja.png",
      "Sujatha": "/suja.png",
      "sn15": "/swathi.png",
      "Swathi": "/swathi.png",
      "mrajasri": "/rajasri.png",
      "Rajasri": "/rajasri.png",
      "pc2": "/pc2.png",
      "Parthiban": "/pc2.png",
    };
    const imageUrl = nameToImageMap[detail.name] || "/logo1.png";
    const altText = detail.name in nameToImageMap ? "Signature" : "Logo";
    return <img src={imageUrl} alt={altText} className="logn" />;
  })()}
</td>
                  <td>{detail.date}</td>
                  <td>{detail.remarks || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
  </div>

</Modal>


    </div>
  );
};

export default Overall;
