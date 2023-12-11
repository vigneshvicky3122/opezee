import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
const URL = process.env.VITE_BACKEND_URL
const { ipcRenderer } = window.require('electron')

function App() {
  const [isData, setData] = useState([
    {
      id: 1,
      name: 'google',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'google.com',
      icon: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/2015/10/nexus2cee_Search-Thumb.png'
    },
    {
      id: 2,
      name: 'youtube',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'youtube.com',
      icon: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/7911144/app-icon-sm.png'
    },

    {
      id: 3,
      name: 'whatsapp',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'whatsapp.com',
      icon: 'https://seeklogo.com/images/W/whatsapp-icon-logo-8CA4FB831E-seeklogo.com.png'
    },

    {
      id: 4,
      name: 'instagram',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'instagram.com',
      icon: 'https://cdn.prod.weshareapps.com/app/featuredIcon/4f60591e-84bc-4d5d-9ecf-a5df6d6bcd62-medium.png?w=3840&q=75'
    },
    {
      id: 5,
      name: 'spotify',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'spotify.com',
      icon: 'https://cdn.prod.weshareapps.com/app/icons/94a7fef1-92c1-4cba-9831-3817831deafe-medium.png?w=3840&q=75'
    },
    {
      id: 6,
      name: 'skype',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'skype.com',
      icon: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/7911269/app-icon-sm.png'
    },
    {
      id: 7,
      name: 'telegram',
      application: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      parameter: 'telegram.com',
      icon: 'https://www.afgri.co.za/wp-content/uploads/2013/04/Fontello_icons_Mail-_300.png'
    }
  ])
  const [isHome, setHome] = useState(true)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    // getData()
  }, [])
  async function getData() {
    await axios
      .get(`${URL}/applications/all`)
      .then((response) => {
        setData(response.data)
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
  const removeApplication = (filePath) => {
    ipcRenderer.send('remove-application', filePath)
  }

  const openFileDialog = async () => {
    const result = await ipcRenderer.invoke('open-file-dialog')
    if (!result.canceled) {
      const filePath = result.filePaths[0] // Assuming a single file is selected
      // Send the file path to add to the application list
      ipcRenderer.send('add-application', filePath)
    }
  }
  return (
    <>
      <div class="container bg-transparent w-100 d-flex flex-row align-items-start">
        <div class="container-fluid my-5 w-25 d-flex flex-column justify-content-center">
          <div>
            <h1 className="tittle text-white">
              op<sub>ezee</sub>
            </h1>
            <h6 className="slogan text-white">www.opezee.com</h6>
          </div>
          <div class="position-absolute bottom-0 mb-5">
            {!isHome ? (
              <i
                class="bi bi-house-door-fill text-white fs-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setHome((prev) => !prev)}
              ></i>
            ) : (
              <i
                class="bi bi-gear-fill text-white fs-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setHome((prev) => !prev)}
              ></i>
            )}
          </div>
        </div>
        <div class="container-fluid my-5 w-75 text-center">
          {!isHome ? (
            <>
              <div class="d-flex flex-column gap-5">
                <div class="d-flex flex-column gap-1">
                  <div class="mb-3 fw-semibold text-start">
                    <label for="exampleFormControlTextarea1" class="form-label text-white">
                      Applications
                    </label>
                    <textarea
                      class="form-control bg-secondary border-0 shadow-none"
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="d-flex justify-content-end gap-4">
                    <button type="button" class="btn btn-primary">
                      &nbsp; Add &nbsp;
                    </button>
                    <button type="button" class="btn btn-primary">
                      Remove
                    </button>
                  </div>
                </div>
                <div class="d-flex flex-column gap-1">
                  <div class="mb-3 fw-semibold text-start">
                    <label for="floatingTextarea" class="form-label text-white">
                      Config file
                    </label>
                    <input
                      type="text"
                      class="form-control bg-secondary border-0 shadow-none"
                      id="floatingTextarea"
                      placeholder="choose application config..."
                    />
                  </div>
                  <div class="d-flex justify-content-end gap-4">
                    <button type="button" class="btn btn-primary">
                      Choose
                    </button>
                    <button type="button" class="btn btn-primary">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {isLoading ? (
                <div class="d-flex align-items-center flex-column justify-content-center gap-5">
                  <p class="fw-semibold text-light">&nbsp;Loading...</p>
                  <button class="btn btn-primary" onClick={() => setLoading(false)}>
                    Home
                  </button>
                </div>
              ) : (
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                  {isData &&
                    isData.map((items, index) => (
                      <div class="d-flex flex-column align-items-center g-5 gap-2" key={index}>
                        <div class="col">
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
                        <p class="text-white fw-normal">{items.name}</p>
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
