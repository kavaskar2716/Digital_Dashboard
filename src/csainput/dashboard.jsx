import React, { useState, useEffect } from 'react';
import './csadash.css';
import Modal from 'react-modal';
import ApiService from '../services/apiservice.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

Modal.setAppElement('#root');

function DashboardComponent() {
  const [projects, setProjects] = useState([]);
  const [slider, setSlider] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const currentFiscalYear = '2024-2025';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await ApiService.Getdigitalinput();
      const dataWithIndex = response.Table.map((row, index) => ({ index: index + 1, ...row }));
      setProjects(dataWithIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchimg = async (did) => {
    debugger;
    setModalIsOpen(true);
    try {
      const response = await ApiService.Getslidermodalimg({ p_Did: did });

      if (response && response.responseModel && response.responseModel.PosDetails) {
        const { PosDetails, ImageUrls } = response.responseModel;

        const sliderimg = PosDetails.map((row, index) => ({
          index: index + 1,
          src: ImageUrls[index],
          ...row,
        }));

        setSlider(sliderimg);
        console.log(sliderimg);
      } else {
        console.error('Response does not contain PosDetails or ImageUrls');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const groupProjectsByYear = (projects) => {
    const groupedProjects = {};
    projects.forEach((project) => {
      const { fy_year } = project;
      if (!groupedProjects[fy_year]) {
        groupedProjects[fy_year] = [];
      }
      groupedProjects[fy_year].push(project);
    });
    return groupedProjects;
  };

  const groupedProjects = groupProjectsByYear(projects);
  const years = Object.keys(groupedProjects).sort((a, b) => b - a);

  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <div className="">
        <div className="">
          <main className="">
            <div className="container-fluid">
              <div className="row">
                {/* Current Fiscal Year */}


                {/* Other Fiscal Years */}
                <div className="col-6 gy-5 blink-me">
                  <div id="otherYearsCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {years.length > 0 ? (
                        years
                          .filter(year => year !== currentFiscalYear)
                          .map((year, yearIndex) => (
                            <div key={yearIndex} className={`carousel-item ${yearIndex === 0 ? 'active' : ''}`}>
                              <div className="one sec" id="subfel">
                                <h1>{`FY ${year}`}</h1>
                              </div>
                              <div className="row">
                                {groupedProjects[year].map((project, projectIndex) => (
                                  <div key={projectIndex} className="col-4 subnn">
                                    <div className="card main__card alerts-border green">
                                      <div aria-hidden="true">
                                        <div className="content">
                                          <div className="front">
                                            <h2>{project.project}</h2>
                                          </div>
                                          <div className="back from-left">
                                            <ul className="social-icon">
                                              <li>
                                                <button
                                                  type="button"
                                                  onClick={() => fetchimg(project.Did)}
                                                  className="btn-link"
                                                >
                                                  <i className="fa fa-eye"></i>
                                                </button>
                                              </li>
                                              <li>
                                                <a
                                                  href={project.website_link}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  <i className="fa fa-link"></i>
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="carousel-item active">
                          <div>No projects available</div>
                        </div>
                      )}
                    </div>
                    {/* <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#otherYearsCarousel"
                      data-bs-slide="prev"
                    >
                      <span className="carousel-control-prev-icon"></span>
                    </button> */}
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#otherYearsCarousel"
                      data-bs-slide="next"
                    >
                      <span className="carousel-control-next-icon"></span>
                    </button>
                  </div>
                </div>
                <div className="col-6 gy-5 blink-me">
                  <div id="currentYearCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div className="one sec" id="subfel">
                          <h1>{`FY ${currentFiscalYear}`}</h1>
                        </div>
                        <div className="row">
                          {groupedProjects[currentFiscalYear]?.map((project, projectIndex) => (
                            <div key={projectIndex} className="col-4 subnn">
                              <div className="card main__card alerts-border green">
                                <div aria-hidden="true">
                                  <div className="content">
                                    <div className="front">
                                      <h2>{project.project}</h2>
                                    </div>
                                    <div className="back from-left">
                                      <ul className="social-icon">
                                        <li>
                                          <button
                                            type="button"
                                            onClick={() => fetchimg(project.Did)}
                                            className="btn-link"
                                          >
                                            <i className="fa fa-eye"></i>
                                          </button>
                                        </li>
                                        <li>
                                          <a
                                            href={project.website_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="fa fa-link"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row rowspand">
                <div className="col-2" style={{ width: '11%' }}>
                  <div className="d-flex flex-row align-items-center">
                    <i className="fa fa-square" style={{ color: '#8BC34A' }}></i>
                    <p className="mb-0 mss-1 legend">COMPLETED</p>
                  </div>
                </div>
                <div className="col-1" style={{ width: '6%' }}>
                  <div className="d-flex flex-row align-items-center">
                    <i className="fa fa-square" style={{ color: '#FFD54F' }}></i>
                    <p className="mb-0 mss-1 legend">WIP</p>
                  </div>
                </div>
                <div className="col-1">
                  <div className="d-flex flex-row align-items-center">
                    <i className="fa fa-square" style={{ color: '#03A9F4' }}></i>
                    <p className="mb-0 mss-1 legend">PLAN</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal for displaying slider images */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Slider Images"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="modal-close-button">
          X
        </button>
        <div className="modal-content">
          {slider.length > 0 ? (
            <div id="sliderCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {slider.map((img, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img
                      className="d-block w-100"
                      src={img.src}
                      alt={`Slide ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#sliderCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#sliderCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          ) : (
            <p>No images available</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DashboardComponent;
