'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '../firebaseConfig/clientApp';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { logOut, useUser } from '../auth/auth';
import NotLoggedIn from './notLoggedIn';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

type InventoryItem = {
  name: string;
  quantity: number;
};

const Pantry = () => {
    const user = useUser();
    const [userID, setUserID] = useState(null);  
    
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, `users/${userID}/inventory`));
        const docs = await getDocs(snapshot);
        const inventoryList: InventoryItem[] = []; 
        docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...(doc.data() as Omit<InventoryItem, 'name'>) });
        });
        setInventory(inventoryList);
    };

    const addItem = async (item: string) => { 
        const docRef = doc(collection(firestore, `users/${userID}/inventory`), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        const { quantity } = docSnap.data() as InventoryItem;
        await setDoc(docRef, { quantity: quantity + 1 });
        } else {
        await setDoc(docRef, { quantity: 1 });
        }
        await updateInventory();
    };

    const removeItem = async (item: string) => { 
        const docRef = doc(collection(firestore, `users/${userID}/inventory`), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        const { quantity } = docSnap.data() as InventoryItem;
        if (quantity === 1) {
            await deleteDoc(docRef);
        } else {
            await setDoc(docRef, { quantity: quantity - 1 });
        }
        }
        await updateInventory();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (user != null) {setUserID(user.uid);}
        updateInventory();
    }, [user, userID]);

    return (
        <div>
            {user ? (
                <div>
                    <button onClick={logOut} className="p-10 text-white bg-black"> Sign Out </button>

                    <Box
                width="100vw"
                height="100vh"
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
                alignItems={'center'}
                gap={2}
                >
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Item
                    </Typography>
                    <Stack width="100%" direction={'row'} spacing={2}>
                        <TextField
                        id="outlined-basic"
                        label="Item"
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button
                        variant="outlined"
                        onClick={() => {
                            addItem(itemName);
                            setItemName('');
                            handleClose();
                        }}
                        >
                        Add
                        </Button>
                    </Stack>
                    </Box>
                </Modal>
                <Button variant="contained" onClick={handleOpen}>
                    Add New Item
                </Button>
                <Box border={'1px solid #333'}>
                    <Box
                    width="800px"
                    height="100px"
                    bgcolor={'#ADD8E6'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    >
                    <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
                        Inventory Items
                    </Typography>
                    </Box>
                    <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
                    {inventory.map(({ name, quantity }) => (
                        <Box
                        key={name}
                        width="100%"
                        minHeight="150px"
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        bgcolor={'#f0f0f0'}
                        paddingX={5}
                        >
                        <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                        <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                            Quantity: {quantity}
                        </Typography>
                        <Button variant="contained" onClick={() => removeItem(name)}>
                            Remove
                        </Button>
                        </Box>
                    ))}
                    </Stack>
                </Box>
                    </Box>
                </div>
            ) : (
                <div>
                    <NotLoggedIn/>
                </div>
            )}
        </div>
        
    );
};

export default Pantry;
