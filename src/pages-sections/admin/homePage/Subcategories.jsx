import { Box, FormControl, Autocomplete, TextField} from "@mui/material";
import React from "react";

const Subcategories = (props) => {

    const handleClick = (e, value) => {
        props.handleChange(value, props.index);
    }
    
    if (!props.parentId || !props.allCategoriesData) {
        return (
            <FormControl sx={{ m: 2, minWidth: 290 }}>
                <TextField
                    label={props.label}
                    disabled
                    value="Select a section first"
                />
            </FormControl>
        );
    }
    
    const filteredCategory = props.allCategoriesData.filter(item=>item.parentId_id === props.parentId)
    const filteredChildCategory = filteredCategory.map((item) => ({ sequenceNo:props.index+1, image: item?.icon || '', category_slug: item?.slug || '', name: item?.name || '', id: item?.id || '', parent: item?.parentId_id || null, type: "section_subcategory"}))
    const filteredChildData = filteredChildCategory.filter(({ id: id1 }) => !props.Sub_Category.some(({ id: id2 }) => id1 === id2) || id1===(props.value?.id))
    
    console.log(`Subcategory ${props.index + 1}:`, {
        parentId: props.parentId,
        filteredCategory: filteredCategory.length,
        filteredChildData: filteredChildData.length,
        currentValue: props.value
    });
    
    return (
        <>
            <FormControl sx={{ m: 2, minWidth: 290 }}>
                <Autocomplete
                    id={props.id}
                    disableClearable={true}
                    value={props.value || null}
                    options={filteredChildData}
                    getOptionLabel={(option) => `${option.name}`}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
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

export default Subcategories;