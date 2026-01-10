import {FormControl, Autocomplete, TextField} from "@mui/material";
import React from "react";

const Sections = (props) => {


console.log("Section")

    const handleClick = (e, value) => {
        props.handleChange(value, props.index);
    }

    if(props.allCategoriesData !== undefined && props.value !== undefined){
        
        const filteredCategory = props.allCategoriesData.map((item) => ({ sequenceNo: props.index+1, image: item.icon, category_slug: item.slug, name: item.name, id: item.id, type: "box", parent: item.parentId_id}))
        const filteredData = filteredCategory.filter(({ id: id1 }) => !props.IndividualBoxOrder.some(({ id: id2 }) => id1 === id2) || id1===props.value.id)
        
        return (
            <>
                <FormControl sx={{ m: 2 }}>
                    <Autocomplete
                        id={props.id}
                        disableClearable={true}
                        value={props.value || null}
                        options={filteredData}
                        getOptionLabel={(option) => `${option.name} (${option.category_slug})`}
                        onChange = {handleClick}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={props.label}
                            />
                        )}
                        sx={{
                            // '& .MuiAutocomplete-input': {
                            //   backgroundColor: '#f2f2f2',
                            //   borderRadius: '4px',
                            //   padding: '8px',
                            // },
                            '& .MuiAutocomplete-input:focus': {
                              backgroundColor: '#ffffff',
                              borderColor: '#2b7cff',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#2b7cff',
                            },
                        }}
                      
                    />
                </FormControl> 
            </>
        );
    }
    else{
        <p>Loading...</p>
    }
}

export default Sections;