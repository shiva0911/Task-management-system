import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { createTask } from '../../ReduxToolKit/TaskSlice';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline:"none",
  boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', 
  p:4,
};
const tags=["Angular","React","VueJs","Spring boot","Node js","Python","MYSql"]

export default function CreateTask({ handleClose, open }) 
{
  const dispatch=useDispatch();
    const [formData,setFormData]=useState({
        title:"",
        image:"",
        description:"",
        tage:[],
        deadline:new Date(),
    })
    const [SelectedTags,setSelectedTags]=useState([])
    const handleChange=(e)=>
    {
        const{name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value,
        });

    };
    const handleTagsChange=(event,value)=>
    {
      setSelectedTags(value)

    }
    const handleDeadLineChange=(date)=>
    {
      setFormData(
        {
          ...formData,
          deadline:date
        }
      )

    }
    const formateDate=(input)=>
    {
      let{
        $y:year,
        $M:month,
        $D:day,
        $H:hours,
        $m:minutes,
        $s:seconds,
        $ms:milliseconds,

      }=input;
      const date=new Date(year,month,day,hours,minutes,seconds,milliseconds);
      const formatedDate=date.toISOString();
      return formatedDate;
    }
    const handleSubmit=(e)=>
    {
      e.preventDefault();
      const {deadline}=formData;
      formData.deadline=formateDate(deadline);
      formData.tags=SelectedTags;
      dispatch(createTask(formData))
      console.log("formDate",formData,"deadline:",formData.deadline)
      handleClose();

    }
    return (
    
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
            <TextField
            label="Title"
            fullWidth 
            name='title'
            value={formData.title}
            onChange={handleChange}
            />
        </Grid>    
        <Grid item xs={12}>
            <TextField
            label="Image"
            fullWidth 
            name="image"
            value={formData.image}
            onChange={handleChange}
            />
        </Grid> 
        <Grid item xs={12}>
            <TextField
            label="Description"
            fullWidth 
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            />
        </Grid> 
        <Grid item xs={12}>
          <Autocomplete multiple id="multiple-limit-tags" options={tags}
           onChange={handleTagsChange} getOptionLabel={(option)=>option}
           renderInput={(parms)=><TextField
            label="Tags"
            fullWidthname
            {...parms}
            
            />}
            />
            
        </Grid> 
        <Grid item xs={12}>
        <LocalizationProvider  dateAdapter={AdapterDayjs}>
      
        <DateTimePicker 
        onChange={handleDeadLineChange}
        className="w-full" 
        label="Deadline" 
        renderInput={(params)=><TextField{...params}/>}
        />
      </LocalizationProvider>
      <Grid item xs={12} >
        <Button className="customeButton" type="submit" fullWidth sx={{padding:".9rem",marginTop: "20px"}}>
          Create
        </Button>

      </Grid>

        </Grid>
        </Grid> 
        </form>  
           </Box>
      </Modal>
    </div>
  );
}
