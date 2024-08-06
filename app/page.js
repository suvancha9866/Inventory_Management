'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, getDoc, getDocs, query, setDoc, deleteDoc } from "firebase/firestore";
import { Rokkitt } from '@next/font/google';

const josefinSlab = Rokkitt({
  weight: ['400', '700'], 
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function Home() {
  const [inventory, setInventory] = useState([]); // This is to set the default value.
  const [open, setOpen] = useState(false); // Default Value
  const [itemName, setItemName] = useState(""); // Default Value
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Alpha");

  // Async won't block code when fetching, that means entire website freezes when fetching
  const updateInventory = async () => {
    // this snapshot is the inventory variable in the firestore database
    // We are querying the collection in our firestore with the name inventory
    const snapshot = query(collection(firestore, 'inventory'));
    // This will get all of the docs in the firestore database from the collection inventory as said above
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    // This gets the direct item reference
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    // This gets the direct item reference
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // Runs the code in the updateInventory function whenever something in the dependency array changes. 
  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  }

  // Filter inventory based on search query
  const filteredItems = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === "Alpha") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "QLTH") {
      return a.quantity - b.quantity;
    } else if (sortOption === "QHTL") {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      className={josefinSlab.className}
      sx={{
        background: "radial-gradient(circle, #4d4d4d, #1a1a1a)"
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}>
          <Typography variant="h6" className={josefinSlab.className}>
            Add Item
          </Typography>
          <Stack
            width="100%"
            direction="row"
            spacing={2}>
            <TextField
              className={josefinSlab.className}
              variant='outlined'
              fullWidth
              sx={{
                width:"260px",
                margin: "10px",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black', // Border color when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'black', // Label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black', // Label color when focused
                }
              }}
              InputProps={{
                className: josefinSlab.className,
              }}
              InputLabelProps={{
                className: josefinSlab.className,
              }} 
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value.toLowerCase());
              }} />
            <Button
              className={josefinSlab.className}
              color="inherit"
              variant="outlined"
              onClick={() => {
                addItem(itemName.toLowerCase());
                setItemName("");
                handleClose();
              }}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Typography variant="h1" className={josefinSlab.className} color="white">Inventory Management</Typography>
      <Box
        name="All"
        width="70vw"
        display="flex"
        alignItems="center"
        justifyContent="space-around">
        <Box
          name="Actions"
          width="300px"
          bgcolor="black"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: 2
          }}>
          <Typography variant="h4" className={josefinSlab.className} color="white">Actions</Typography>
          <Box
            bgcolor="#c4c4c4"
            width="300px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              borderRadius: 2
            }}>
            <TextField
              className={josefinSlab.className} 
              onChange={handleChange} 
              value={search} 
              placeholder="Search Items"
              sx={{
                width:"260px",
                margin: "10px",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black', // Border color when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'black', // Label color
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black', // Label color when focused
                }
              }}
              InputProps={{
                className: josefinSlab.className,
              }}
              InputLabelProps={{
                className: josefinSlab.className,
              }}></TextField>
              <Box 
                className={josefinSlab.className}
                sx={{ width: "260px",
                      margin: "10px"
                }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"
                  className={josefinSlab.className}>Sort</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sortOption}
                    onChange={handleSortChange}
                    label="Sort"
                    className={josefinSlab.className}
                    sx={{
                      '& .MuiSelect-select': {
                        color: 'black', // Change the text color inside the select box
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black', // Change the label color when not focused
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'black', // Change the label color when focused
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Change the border color on hover
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Keeps the same border color as the base state
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black', // Change the border color when focused
                      },
                      '& .MuiSelect-icon': {
                        color: 'black', // Change the color of the dropdown arrow on hover and focus
                      },
                      '&.Mui-focused .MuiSelect-icon': {
                        color: 'black', // Keep the icon color consistent when focused
                      },
                      '&.Mui-focused .MuiSelect-select': {
                        color: 'black',
                      }
                    }}
                  >
                    <MenuItem value={"Alpha"} className={josefinSlab.className}>Alphabetically</MenuItem>
                    <MenuItem value={"QLTH"} className={josefinSlab.className}>Quantity: Low to High</MenuItem>
                    <MenuItem value={"QHTL"} className={josefinSlab.className}>Quantity: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button
                variant="contained" 
                color="inherit"
                onClick={handleOpen}
                className={josefinSlab.className}
                fullWidth
                sx={{
                  width: "260px",
                  margin: "10px"
                }}
              >
              Add New Item
            </Button>
            
              <Button
                variant="contained" 
                color="inherit"
                className={josefinSlab.className}
                sx={{
                  width: "260px",
                  margin: "10px"
                }}>
              Create Recipe (In Progress)
            </Button>
          </Box>
        </Box>
        <Box
          name="Inventory"
          width="550px"
          bgcolor="black"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: 2
          }}>
          <Typography variant="h4" className={josefinSlab.className} color="white">Inventory Items</Typography>
          <Box
            width="550px"
            height="265px"
            bgcolor="#c4c4c4"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              borderRadius: 2
            }}>
            <Stack
              width="550px"
              height="260px"
              overflow="auto"
              sx={{
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  display: 'none', 
                },
                '-ms-overflow-style': 'none', 
                'scrollbar-width': 'none', 
                alignItems: 'stretch',
              }}>
              {filteredItems.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  height="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#c4c4c4"
                  padding={4}>
                  <Typography 
                    fontSize={20}
                    className={josefinSlab.className}
                    color="#333"
                    textAlign="center"
                    sx={{ flexGrow: 1 }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    fontSize={20}
                    className={josefinSlab.className}
                    color="#333"
                    textAlign="center"
                    sx={{ flexGrow: 1 }}>
                    {quantity}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flexShrink: 0 }}>
                      <Button variant="contained" fontSize={50} color="inherit" className={josefinSlab.className} onClick={() => {
                      removeItem(name);
                    }}>
                      Remove
                    </Button>
                    <Button variant="contained" fontSize={20} color="inherit" className={josefinSlab.className} onClick={() => {
                      addItem(name);
                    }}>
                      Add
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
