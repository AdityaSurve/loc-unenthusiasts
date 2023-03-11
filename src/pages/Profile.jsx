import React, { useState, useEffect } from 'react'
import ProfilePic from '../assets/profile.png'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ProfileBG } from '../assets/profileBg.jpeg'
import { Post } from '../components/cards/Post'
import { app, database, storage } from '../components/firebaseConfig'
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, setDoc } from "firebase/firestore";
import { async } from '@firebase/util';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';

export const Profile = ({newid,setnewid}) => {
    const [data, setdata] = useState({});
    const auth = getAuth();
    const user = auth.currentUser;
    if(newid===''){
        console.log(user.uid);
        setnewid(user.uid);
    }
    const [fireuser, setfireuser] = useState({})
    const [cardarr,setcardarr]=useState([]);
    console.log(newid);
    useEffect(() => {
        getfireuser();
        getImages();
    }, [newid])
    useEffect(() => {
        getfireuser();
        getImages();
    }, [])

    const getImages= async()=>{
        const collectionRef = collection(database, 'images');
        const nameQuery=query(collectionRef,where("createdby","==",newid))
        var arr=[];
          await getDocs(nameQuery)
              .then((res) => {
                console.log(res);
               res.docs.map((item)=>{
                arr.push({array:item.data(),id:item.id});
                console.log(item.id)
               }) 
            })
            setcardarr([...arr]);
    }

    const onChangefile = (e) => {
        let newInput = { [e.target.name]: e.target.files[0] };
        setdata({ ...data, ...newInput })
      }

    const getfireuser = async () => {
        const docRef = doc(database, "users", newid);
        const docSnap = await getDoc(docRef);
        setfireuser(docSnap.data())
    }

    const handleInput = (event) => {
        let newInput = { [event.target.name]: event.target.value };

        setdata({ ...data, ...newInput });
    }

    const handleUpdate = () => {
        const doctoupdate = doc(database, 'users', newid)
        updateDoc(doctoupdate, {
            bio: data.bio,
            type: data.type
        })
    }

    const handleUpdateImage = () => {
        const storageRef = ref(storage, newid);

        const uploadTask = uploadBytesResumable(storageRef, data.image)
        uploadTask.on('state_changed',
          (snapshot) => {
          },
          (error) => {
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log('File available at', downloadURL);
              await updateDoc(doc(database, "users", newid), {
                imageURL: downloadURL
              })
            });
          });
    }

    return (
        <div>
            <Navbar newid={newid} setnewid={setnewid} />
            <div className="flex flex-row bg-profileBg p-48 h-screen w-screen bg-cover bg-no-repeat">
                <div className="flex flex-col h-[100%] w-[60%] p-6 justify-center">
                    <div className='flex flex-col'>
                        {fireuser?.imageURL?<div className='w-6/12 sm:w-4/12 px-'><img src={fireuser?.imageURL} className="h-[200px] w-[200px]" /></div>:<label htmlFor="image">
                        <img src={ProfilePic} className="h-[200px] w-[200px]" />
                        </label>}
                        <input
                        className='none'
                            id='image'
                            type="file"
                            placeholder="Upload Photo"
                            onChange={(event) => onChangefile(event)}
                            name="image"
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleUpdateImage}
                    >
                        Update Profile
                    </Button>
                        <button className="bg-[#61876E] hover:bg-[#AA5656] border-2  rounded-2xl text-white w-[250px] font-jost py-2 px-4 mt-12 shadow-black shadow-lg hover:scale-110 transition duration-300 ease-in-out"><Link to="#gallery">View Gallery</Link></button>
                    </div>
                </div>
                <div className="flex flex-col h-[100%] bg-[#00000050] w-[60%] p-8">
                    <div className='flex flex-row h-[20px] w-100%'>
                        <div className='mr-16 text-2xl font-bold text-white'>Name</div>
                        <div className='text-2xl font-bold text-white'>{fireuser.name}</div>
                    </div>
                    <div className='flex flex-row h-[20px] w-100% mt-12'>
                        <div className='mr-16 text-2xl font-bold text-white'>E-mail</div>
                        <div className='text-2xl font-bold text-white'>{fireuser.email}</div>
                    </div>
                    <div className='flex flex-row h-[20px] w-100% mt-12'>
                        <div className='mr-16 text-2xl font-bold text-white'>Bio</div>
                        {fireuser?.bio ? <div className='text-2xl font-bold text-white'>{fireuser.bio}</div> : <input type='text' className='h-8' onChange={(event) => handleInput(event)} name="bio"></input>}
                    </div>
                    <div className='flex flex-row h-[20px] w-100% mt-12'>
                        <div className='mr-16 text-2xl font-bold text-white'>type</div>
                        {fireuser?.type ? <div className='text-2xl font-bold text-white'>{fireuser.type}</div> : <input type='text' className='h-8' onChange={(event) => handleInput(event)} name="type"></input>}
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleUpdate}
                    >
                        Update Profile Picture
                    </Button>
                </div>
            </div>
            <div className="h-screen flex flex-col justify-start items-start p-10" id="gallery">
                <p className="font-jost text-black font-bold text-[100px] mt-10 p-10">My Gallery</p>
                <div className="md:grid md:grid-cols-2 p-12 h-screen w-full justify-center">
           {
            cardarr?.map((item,index)=>{
                console.log(item.array);
                return (

                    <Post id={item.id} caption={item.array.caption} imageurl={item.array.url} name={item.array.name} likes={item.array.likes} />


                 )
            },[])
           } 
        </div>
            </div>
        </div>

    )
}