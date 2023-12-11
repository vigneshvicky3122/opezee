import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
const URL = process.env.VITE_BACKEND_URL

function App() {
  const [isData, setData] = useState([])
  const [isHome, setHome] = useState(true)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    getData()
  }, [])
  async function getData() {
    await axios
      .get(`${URL}/applications/all`)
      .then((response) => {
        setData(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  async function handleLaunch(params) {
    await axios
      .post(`${URL}/application/launch`, params)
      .then((response) => {
        if (response.status === 200) {
          setLoading(true)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <>
      <div className="container bg-transparent w-100 d-flex flex-row align-items-start">
        <div className="container-fluid my-5 w-25 d-flex flex-column justify-content-center">
          <div>
            <h1 className="tittle text-white">
              op<sub>ezee</sub>
            </h1>
            <h6 className="slogan text-white">www.opezee.com</h6>
          </div>
          <div className="position-absolute bottom-0 mb-5">
            {!isHome ? (
              <i
                className="bi bi-house-door-fill text-white fs-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setHome((prev) => !prev)}
              ></i>
            ) : (
              <i
                className="bi bi-gear-fill text-white fs-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setHome((prev) => !prev)}
              ></i>
            )}
          </div>
        </div>
        <div className="container-fluid my-5 w-75 text-center">
          {!isHome ? (
            <>
              <div className="d-flex flex-column gap-5">
                <div className="d-flex flex-column gap-1">
                  <div className="mb-3 fw-semibold text-start">
                    <label for="exampleFormControlTextarea1" className="form-label text-white">
                      Applications
                    </label>
                    <textarea
                      className="form-control bg-secondary border-0 shadow-none"
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end gap-4">
                    <button type="button" className="btn btn-primary">
                      &nbsp; Add &nbsp;
                    </button>
                    <button type="button" className="btn btn-primary">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column gap-1">
                  <div className="mb-3 fw-semibold text-start">
                    <label for="floatingTextarea" className="form-label text-white">
                      Config file
                    </label>
                    <input
                      type="text"
                      className="form-control bg-secondary border-0 shadow-none"
                      id="floatingTextarea"
                      placeholder="choose application config..."
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-4">
                    <button type="button" className="btn btn-primary">
                      Choose
                    </button>
                    <button type="button" className="btn btn-primary">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {isLoading ? (
                <div className="d-flex align-items-center flex-column justify-content-center gap-5">
                  <p className="fw-semibold text-light">&nbsp;Loading...</p>
                  <button className="btn btn-primary" onClick={() => setLoading(false)}>
                    Home
                  </button>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                  {isData &&
                    isData.map((items, index) => (
                      <div className="d-flex flex-column align-items-center g-5 gap-2" key={index}>
                        <div className="col">
                          <img
                            src={items.icon}
                            alt="External-image"
                            onClick={() =>
                              handleLaunch({
                                application: items.application,
                                parameter: items.parameter
                              })
                            }
                            width={60}
                            height={60}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <p className="text-white fw-normal">{items.name}</p>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
