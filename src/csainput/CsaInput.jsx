import React, { useState, useEffect, useRef } from 'react';
import './csainput.css';
import Modal from 'react-modal';
import ApiService from '../services/apiservice.service';
import { useDispatch } from 'react-redux';
import { userActions } from '_store';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

Modal.setAppElement('#root');

const initialCsabState = {
  p_did: 0,
  p_fy_year: 0,
  p_project: "",
  p_position: "",
  p_description: "",
  p_status: "",
  p_wlink:"",
  p_str: "ADD",
};

const initialFileState = {
  p_sid: 0,
  p_positions: 0,
  p_projects: '',
  p_images: null,
  p_str: "ADD"
};

const CsaInput = () => {
  const [localStorageValue, setLocalStorageValue] = useState(null);
  const [csab, setCsab] = useState(initialCsabState);
  const [img, setImg] = useState(initialFileState);
  const [rowData, setRowData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tableRes, setTableRes] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [financialYears, setFinancialYears] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [slider, setSlider] = useState([]);
  const [lastPosition, setLastPosition] = useState(0);
  const dispatch = useDispatch();
  const gridRef = useRef();

  useEffect(() => {
    dispatch(userActions.getAll());
    const storedName = localStorage.getItem('UserName')?.replace(/"/g, '');
    setLocalStorageValue(storedName);
    initializeFinancialYears();
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [localStorageValue]);

  const initializeFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => `${currentYear - 2 + i}-${currentYear - 1 + i}`);
    setFinancialYears(years);
    setSelectedYear(years[2]);
  };

  const fetchData = async () => {
    try {
      const response = await ApiService.Getdigitalinput();
      const dataWithIndex = response.Table.map((row, index) => ({ index: index + 1, ...row }));
      const dataWithIndex1 = response.Table1.map((row, index) => ({ index: index + 1, ...row }));
      const projectOptions = response.Table.map((row) => ({ value: row.Did, label: row.project }));
      setProjects(projectOptions);
      setRowData(dataWithIndex);
      setRowData1(dataWithIndex1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchimg = async (did) => {

    try {
      const response = await ApiService.Getslidermodalimg({ p_Did: did });

      if (response && response.responseModel) {
        const { PosDetails, ImageUrls } = response.responseModel;

        const sliderimg = PosDetails.map((row, index) => ({
          index: index + 1,
          src: ImageUrls[index],
          ...row,
        }));

        setSlider(sliderimg);
        const lastPosition = PosDetails.length > 0 ? PosDetails[PosDetails.length - 1].position : 0;
        setLastPosition(lastPosition);
      } else {
        console.error('Response does not contain PosDetails or ImageUrls');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateDatabaseWithNewOrder = async (updatedRowData) => {
    try {
      await ApiService.UpdateRowOrder(updatedRowData);
      console.log('Database updated with new row order');
    } catch (error) {
      console.error('Error updating database with new row order:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'p_projects') {
      fetchimg(value);
    }
    if (name in csab) {
      setCsab((prev) => ({ ...prev, [name]: value }));
    }
    if (name in img) {
      setImg((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (event) => {
    const filesArray = Array.from(event.target.files);
    const renamedFiles = filesArray.map((file, index) => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/:/g, '-').split('.')[0];
      const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
      const newFileName = `${formattedDate}-${milliseconds}_${index + 1}.${file.name.split('.').pop()}`;
      return new File([file], newFileName, { type: file.type });
    });
    const sortedRenamedFiles = renamedFiles.sort((a, b) => a.name.localeCompare(b.name));
    setFiles(sortedRenamedFiles);
    setFileNames(sortedRenamedFiles.map(file => file.name));
  };

  const saveTutorial = async (event) => {
    event.preventDefault();
    try {
      const updatedCsab = { ...csab, p_fy_year: selectedYear};
      await ApiService.PostDigitalDashboardinput(updatedCsab);
      fetchData();
      setCsab(initialCsabState);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const saveTutorialWithFile = async (event) => {
    event.preventDefault();
    try {
      let currentPosition = lastPosition + 1;
      const fileUploadPromises = files.map((file, index) => {
        const formData = new FormData();
        formData.append('p_sid', img.p_sid);
        formData.append('p_images', file);
        formData.append('p_digitid', img.p_projects);
        formData.append('p_position', currentPosition + index);
        formData.append('p_str', img.p_str);
        return ApiService.UploadFile(formData);
      });
      await Promise.all(fileUploadPromises);
      fetchData();
      setImg(initialFileState);
      setFiles([]);
      setFileNames([]);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const editItem = (item) => {
    setCsab({
      p_did: item.Did,
      p_fy_year: item.fy_year,
      p_project: item.project,
      p_position: item.position,
      p_description: item.description,
      p_status: item.status,
      p_wlink: item.website_link,
      p_str: 'UPD',
    });
  };

  const editimg = (item) => {
    setImg({
      p_sid: item.Sid,
      p_positions: item.position,
      p_projects: item.Digital_id,
      p_images: item.images,
      p_str: 'UPD',
    });
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const onRowDragEnd = (event) => {
    const updatedRowData = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
      updatedRowData.push(node.data);
    });
    setRowData(updatedRowData);
    updateDatabaseWithNewOrder(updatedRowData);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTableRes([]);
  };

  const ActionButtonsRenderer = (props) => (
    <div>
      <button onClick={() => editItem(props.data)}><i class="fa fa-edit"></i></button>

    </div>
  );
  const ActionButtonsRenderer1 = (props) => (
    <div>

      <button onClick={() => editimg(props.data)}><i class="fa fa-edit"></i></button>
    </div>
  );

  const columnDefs = [
    { headerName: '#', field: 'actions', cellRenderer: ActionButtonsRenderer, filter: false, sortable: false, minWidth: 50, maxWidth: 50 },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true, minWidth: 50, maxWidth: 50, rowDrag: true },
    { field: 'fy_year', headerName: 'FY YEAR', sortable: true, filter: true, floatingFilter: true, minWidth: 150, width: 150, maxWidth: 150 },
    { field: 'project', headerName: 'PROJECT NAME', sortable: true, filter: true, floatingFilter: true, minWidth: 250, width: 250, maxWidth: 250 },
    { field: 'position', headerName: 'POSITION', sortable: true, filter: true, floatingFilter: true, minWidth: 250, width: 250, maxWidth: 250 },
    { field: 'description', headerName: 'DESCRIPTION', sortable: true, filter: true, floatingFilter: true, minWidth: 250, width: 250, maxWidth: 250 },
    { field: 'status', headerName: 'STATUS', sortable: true, filter: true, floatingFilter: true, minWidth: 150, width: 150, maxWidth: 150 },
    { field: 'website_link', headerName: 'WEBSITE LINK', sortable: true, filter: true, floatingFilter: true, minWidth: 150, width: 150, maxWidth: 150 },
  ];

  const columnDefs1 = [
    { headerName: '#', field: 'actions', cellRenderer: ActionButtonsRenderer1, filter: false, sortable: false, minWidth: 50, maxWidth: 50 },
    { field: 'index', headerName: 'SNO', sortable: true, filter: false, floatingFilter: true, minWidth: 50, maxWidth: 50, rowDrag: true },
    { field: 'project', headerName: 'PROJECT NAME', sortable: true, filter: true, floatingFilter: true,minWidth: 500, maxWidth: 500, },
    { field: 'images', headerName: 'IMAGES', sortable: true, filter: true, floatingFilter: true,minWidth: 450, maxWidth: 450,width:450 },
    { field: 'position', headerName: 'POSITION', sortable: true, filter: true, floatingFilter: true },
  ];

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Digital Input Data</Tab>
          <Tab>Digital Upload Image</Tab>
        </TabList>

        <TabPanel>
          <div>
            <form className="formg" noValidate autoComplete="off" onSubmit={saveTutorial}>
              <div className="row">
                <div className="col-3">
                  <div className="input-wrapper">
                    <select value={selectedYear} onChange={handleYearChange}>
                      {financialYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <label htmlFor="selectedYear">Select Fy</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="input-wrapper">
                    <input type="text" name="p_did" id="p_did" required value={csab.p_did} onChange={handleInputChange} className="diano" />
                    <input type="text" name="p_project" id="p_project" required value={csab.p_project} onChange={handleInputChange} />
                    <label htmlFor="p_project">Project</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="input-wrapper">
                    <select name="p_position" id="p_position" required value={csab.p_position} onChange={handleInputChange}>
                      <option value="">Select Position</option>
                      {[...Array(12).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{`POS-${i + 1}`}</option>
                      ))}
                    </select>
                    <label htmlFor="p_position">Position</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="input-wrapper">
                    <select name="p_status" id="p_status" required value={csab.p_status} onChange={handleInputChange}>
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="Inprogress">Inprogress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <label htmlFor="p_status">Status</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="input-wrapper">
                    <input type="text" name="p_wlink" id="p_wlink" value={csab.p_wlink} onChange={handleInputChange} />
                    <label htmlFor="p_wlink">Website Link</label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="input-wrapper">
                    <input type="text" name="p_description" id="p_description" required value={csab.p_description} onChange={handleInputChange} />
                    <label htmlFor="p_description">Description</label>
                  </div>
                </div>
                <div className="col-2">
                  <button type="submit" name="save" value="Save" className="submitgo" id="btSubmit">Submit</button>
                </div>
              </div>
            </form>
          </div>
          <div className="tabim ag-theme-alpine" style={{ height: 300, width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              pagination
              paginationPageSize={20}
              rowDragManaged
              onRowDragEnd={onRowDragEnd}
            />
          </div>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Row Details">
            {/* Modal content */}
          </Modal>
        </TabPanel>

        <TabPanel>
          <div>
            <form className="formg" noValidate autoComplete="off" onSubmit={saveTutorialWithFile}>
              <div className="row">
                <div className="col-3">
                  <input type="text" name="p_sid" value={img.p_sid} onChange={handleInputChange} className="diano"/>
                  <div className="input-wrapper">
                    <select name="p_projects" id="p_projects" required value={img.p_projects} onChange={handleInputChange}>
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project.value} value={project.value}>{project.label}</option>
                      ))}
                    </select>
                    <label htmlFor="p_projects">Project</label>
                  </div>
                </div>
                <div className="col-3">
                  <input type="file" multiple onChange={handleFileChange} />
                  <ul>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-3">
                {img.p_sid > 0 && (
                  <div className="input-wrapper">

                      <select name="p_positions" id="p_positions" required value={img.p_positions} onChange={handleInputChange}>
                        <option value="">Select Position</option>
                        {[...Array(12).keys()].map(i => (
                          <option key={i + 1} value={i + 1}>{`POS-${i + 1}`}</option>
                        ))}
                      </select>

                    <label htmlFor="p_positions">Position</label>
                  </div>
                      )}
                </div>
                <div className="col-2">
                  <button type="submit" name="save" value="Save" className="submitgo" id="btSubmit">Submit</button>
                </div>
              </div>
            </form>
          </div>
          <div className="tabim ag-theme-alpine" style={{ height: 300, width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData1}
              columnDefs={columnDefs1}
              pagination
              paginationPageSize={20}
              rowDragManaged
              onRowDragEnd={onRowDragEnd}
            />
          </div>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Row Details">
            {/* Modal content */}
          </Modal>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default CsaInput;
