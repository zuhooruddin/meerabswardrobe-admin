import { Box, FormControl, Autocomplete, TextField, Modal, Button} from "@mui/material";
import React from "react";
import { useRef, useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {Subcategories} from "pages-sections/admin";

const SectionSequence = (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    
    // Destructure props to avoid exhaustive-deps warning
    const { setGetSubcategoryData, index } = props;
    
    const [Sub_Category, setSub_Category]=useState([]);
    useEffect(()=> {        
        setGetSubcategoryData(prevState => ({
        ...prevState,
        ["Subcategories"+index]: [Sub_Category],
        }));
    }, [Sub_Category, setGetSubcategoryData, index]);
    let loopFlag = useRef(false);
    // if (props.allCategoriesData && props.value) {    

        // handleChange2 => for SectionSequence
        const handleClick = (e, value) => {
            props.handleChange(value, props.index);
        }

        // for dialog => for SubCategories
        const handleClose = () => {
            setOpen(false);
        }

        // for SubCategories page
        const handleChange3 = (value, index) => {
            const updatedSubCategory = [...Sub_Category];
            updatedSubCategory[index] = value;
            setSub_Category(updatedSubCategory);
        }

        // all parent categories
        
        let filteredParent = props.allCategoriesData.filter(item => item.parentId_id === null && item.isBrand === false)
        let filteredCategory = [];
        let newfilteredCategory = [];
        for(let i=0; i < filteredParent.length; i++){
            filteredCategory = props.allCategoriesData.filter(item=>item.parentId_id === filteredParent[i].id)
            loopFlag.current = true;
            if (filteredCategory.length > 0 && loopFlag.current === true) {
                newfilteredCategory.push({ sequenceNo:props.index+1, image: filteredParent[i].icon, category_slug: filteredParent[i].slug, name: filteredParent[i].name, id: filteredParent[i].id, type: "section", parent: filteredParent[i].parentId_id})
                loopFlag.current = false;
            }
        }
console.log("Filtered",filteredCategory)
        const filteredParentData = newfilteredCategory.filter(({ id: id1 }) => !props.Section_Sequence.some(({ id: id2 }) => id1 === id2) || id1===props.value.id)
        console.log("Filtered Parebnt ",filteredParentData )

        // ============================================subcategories loop============================================

        // Destructure props used in useEffect to avoid exhaustive-deps warning
        const { boxOrderData, allCategoriesData, value, SubCategoryValue } = props;

        useEffect(() => {
            if(Sub_Category !== undefined && boxOrderData !== undefined && allCategoriesData !== undefined){
                // Move variable declarations inside useEffect to avoid assignment warnings
                let newSub_CategoryList = []
                let Sub_CategoryFilter = []
                let CategorySub_CategoryData = []
                let length = 0;
                
                // if(Sub_Category.length !== 0){
                //     newSub_CategoryList = []
                //     Sub_CategoryFilter = allCategoriesData.filter(item =>item.parentId_id === value.id)
                //     length = (Sub_CategoryFilter.length > SubCategoryValue) ? SubCategoryValue : Sub_CategoryFilter.length;
                //     for (let i = 0; i < length; i++) {
                //         newSub_CategoryList.push({ sequenceNo:i+1, image: Sub_CategoryFilter[i].icon, category_slug: Sub_CategoryFilter[i].slug, name: Sub_CategoryFilter[i].name, id: Sub_CategoryFilter[i].id, parent: Sub_CategoryFilter[i].parentId_id, type: "section_subcategory"});
                //     }
                //     setSub_Category(newSub_CategoryList);
                // }
                // else{
                    Sub_CategoryFilter = boxOrderData.filter(item => item.type === "section_subcategory" && item.parent === value.id);
                    Sub_CategoryFilter.sort((a, b) => a.sequenceNo - b.sequenceNo);
                    CategorySub_CategoryData = allCategoriesData.filter(item =>item.parentId_id === value.id)
                    if (Sub_CategoryFilter.length === 0) {
                        length = (CategorySub_CategoryData.length > SubCategoryValue) ? SubCategoryValue : CategorySub_CategoryData.length;
                        for (let i = 0; i < length; i++) {
                            newSub_CategoryList.push({ sequenceNo:i+1, image: CategorySub_CategoryData[i].icon, category_slug: CategorySub_CategoryData[i].slug, name: CategorySub_CategoryData[i].name, id: CategorySub_CategoryData[i].id, parent: CategorySub_CategoryData[i].parentId_id, type: "section_subcategory"});
                        }
                    }
                    else if (Sub_CategoryFilter.length === SubCategoryValue){
                        length = (Sub_CategoryFilter.length > SubCategoryValue) ? SubCategoryValue : Sub_CategoryFilter.length;
                        for (let i = 0; i < length; i++) {
                            newSub_CategoryList.push({ sequenceNo: Sub_CategoryFilter[i].sequenceNo, image: Sub_CategoryFilter[i].image, category_slug: Sub_CategoryFilter[i].category_slug, name: Sub_CategoryFilter[i].category_name, id: Sub_CategoryFilter[i].category_id_id, parent: Sub_CategoryFilter[i].parent, type: Sub_CategoryFilter[i].type});
                        }
                    }
                    else{
                        if (Sub_CategoryFilter.length < SubCategoryValue){
                            for (let i = 0; i < Sub_CategoryFilter.length; i++) {
                                let List = Sub_CategoryFilter.filter(item => item.sequenceNo === i+1 && item.parent === Sub_CategoryFilter[i].parent)
                                newSub_CategoryList.push({ sequenceNo: Sub_CategoryFilter[i].sequenceNo, image: Sub_CategoryFilter[i].image, category_slug: Sub_CategoryFilter[i].category_slug, name: Sub_CategoryFilter[i].category_name, id: Sub_CategoryFilter[i].category_id_id, type: Sub_CategoryFilter[i].type, parent: Sub_CategoryFilter[i].parent});
                            }
                            let length = (CategorySub_CategoryData.length > SubCategoryValue) ? SubCategoryValue : CategorySub_CategoryData.length; 
                            for (let i = Sub_CategoryFilter.length; i < length; i++) {
                                newSub_CategoryList.push({ sequenceNo: i+1, image: CategorySub_CategoryData[i].icon, category_slug: CategorySub_CategoryData[i].slug, name: CategorySub_CategoryData[i].name, id: CategorySub_CategoryData[i].id, type: 'section_subcategory', parent: CategorySub_CategoryData[i].parentId_id});
                            }
                          }
                        else{
                            for (let i = 0; i < SubCategoryValue; i++) {
                                newSub_CategoryList.push({ sequenceNo: Sub_CategoryFilter[i].sequenceNo, image: Sub_CategoryFilter[i].image, category_slug: Sub_CategoryFilter[i].category_slug, name: Sub_CategoryFilter[i].category_name, id: Sub_CategoryFilter[i].category_id_id, type: Sub_CategoryFilter[i].type, parent: Sub_CategoryFilter[i].parent});
                            }
                        }
                    }
                    setSub_Category(newSub_CategoryList);
                
            } else {<p>Loading...</p>}
        }, [value, boxOrderData, allCategoriesData, SubCategoryValue])

        // ==========================================subcategories loop ends==========================================

        let parentId=props.value.id; //parent id => for comparison in child component
        let size = (Sub_Category.length > props.SubCategoryValue) ? props.SubCategoryValue : Sub_Category.length;
        return (
            <>
                <FormControl sx={{ m: 2}}>
                    <Autocomplete
                        id={props.id}
                        disableClearable={true}
                        value={props.value || null}
                        options={filteredParentData}
                        getOptionLabel={(option) => `${option.name}`}
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

                {/* =====================================subcategories===================================== */}

                <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ m: 2}}  style={{backgroundColor: "#2B3445"}}>
                    Subcategories
                </Button>

                <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title">
                    <DialogTitle  id="responsive-dialog-title">
                        {"Select Subcategories"}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                        }}>
                            {(Array(size).fill('').map((val, index) => index)).map((ind) => (
                                <Subcategories key={"Subcategory"+ind} id={"Subcategory"+ind} value={Sub_Category[ind]} Sub_Category={Sub_Category} allCategoriesData={props.allCategoriesData} index={ind} handleChange={handleChange3} label={"Subcategory "+(ind+1)} parentId={parentId}/>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    // } else {<p> Loading... </p>}
}

export default SectionSequence;