import { Button, Divider, FormControl, FormLabel, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import PopupDialog from './components/Dialog';
import TextInput from './components/Inputs/TextInput'
import { schemaOptions } from './constants'
import axios from 'axios';
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [segmentName, setSegmentName] = useState("")
  const [selectedSchema, setSelectedSchema] = useState([])
  const [currentSelected, setCurrentSelected] = useState("")
  const [validation, setValidation] = useState({
    isSegmentNameVerified: true,
    isSchemasVerified: true
  })
  const handleSave = async () => {
    console.log(segmentName)
    if (segmentName === "") {
      setValidation({
        isSegmentNameVerified: false,
        isSchemasVerified: true
      })
    } else if (selectedSchema.length === 0) {
      setValidation({
        isSegmentNameVerified: true,
        isSchemasVerified: false
      })
    } else {
      var arr = []
      schemaOptions.map((item) => {
        if (selectedSchema.includes(item.value)) {
          return arr.push({
            [item.value]: item.label
          })
        } else return null;
      })
      const output = {
        segment_name: segmentName,
        schema: arr
      }
      await axios.post('https://webhook.site/0db361dd-0d2a-4f91-a1af-c1bb39c14935', output, {
        headers: { "Access-Control-Allow-Origin": "*" }
      })
      setIsModalOpen()
    }
  }
  const handleClose = () => {
    setIsModalOpen(false)
    setCurrentSelected("")
    setSegmentName("")
    setSelectedSchema([])
  }
  useEffect(() => {
  }, [selectedSchema])
  return (
    <div>
      <PopupDialog open={isModalOpen} onSave={() => handleSave()} onClose={() => handleClose()} >
        <InputSegment onChange={(value) => {
          setSegmentName(value)
          setValidation({
            isSegmentNameVerified: true,
            isSchemasVerified: true
          })
        }} />
        {!validation.isSegmentNameVerified && <p style={{ color: "red", fontSize: "14px" }}>Name is Required</p>}
        <QueryTitle />
        <SelectedSchemaComponent
          selectedSchema={selectedSchema}
          setSelectedSchema={setSelectedSchema}
        />
        {!validation.isSchemasVerified && <p style={{ color: "red", fontSize: "14px" }}>At least one schema is Required</p>}
        <br />
        <br />
        <br />
        <Divider />

        <InputSchema
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
          setValidation={setValidation}
          selectedSchema={selectedSchema}
          setSelectedSchema={setSelectedSchema}
        />
      </PopupDialog>
      <Button variant='outlined' style={{ margin: "100px" }} onClick={() => setIsModalOpen(true)} >Save Segment</Button>
    </div>
  );
}

function InputSegment({ onChange }) {
  return (
    <div>
      <FormLabel>Enter the Name of the segment</FormLabel>
      <br />
      <br />
      <TextInput
        fullWidth
        onChange={(e) => onChange(e.target.value)}
        placeholder={'Name of the segment '}
      />
    </div>
  )
}
function QueryTitle() {
  return (
    <Typography mt={'25px'}>
      To Save your segment, you need to add the schemas to build the query.
    </Typography>
  )
}
function SelectedSchemaComponent({ selectedSchema, setSelectedSchema }) {
  return (
    <>
      {selectedSchema.map((item1) => {
        return (
          <div style={{ display: "flex" }}>
            <FormControl style={{ margin: "10px" }} fullWidth>
              <InputLabel id="demo-simple-select-label"></InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={item1}
                fullWidth
                onChange={(e) => {
                  setSelectedSchema([...selectedSchema.filter(data => data !== item1), e.target.value])
                }}
              >
                {schemaOptions.map((item) => {
                  if (item?.value === item1 || !selectedSchema.includes(item.value)) {
                    return (
                      <MenuItem key={item.value} value={item?.value}>{item.label}</MenuItem>
                    )
                  } else { return null }
                })}
              </Select>
            </FormControl>
            <Button onClick={() => { setSelectedSchema(selectedSchema.filter(data => data !== item1)) }}>Delete</Button>
          </div>
        )
      })}
    </>
  )
}
function InputSchema({ setValidation, setCurrentSelected, currentSelected, selectedSchema, setSelectedSchema }) {
  return (
    <>
      <FormControl style={{ margin: "10px" }} fullWidth>
        <InputLabel id="demo-simple-select-label">Select a Schema</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSelected}
          fullWidth
          onChange={(e) => {
            setCurrentSelected(e.target.value)
          }}
        >
          {schemaOptions.map((item) => {
            if (!selectedSchema.includes(item.value)) {
              return (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              )
            } else { return null }
          })}
        </Select>
      </FormControl>
      <Button onClick={() => {
        if (currentSelected !== "") {
          setSelectedSchema([...selectedSchema, currentSelected])
          setCurrentSelected("")
          setValidation({
            isSegmentNameVerified: true,
            isSchemasVerified: true
          })
        } else {
          alert("Select a scheme to add")
        }
      }}>Add to Schema</Button>
    </>
  )
}

export default App;
