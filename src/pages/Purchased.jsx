import React, { useState, useEffect } from "react";
import ProfilePic from "../assets/profile.png";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProfileBG } from "../assets/profileBg.jpeg";
import { Post } from "../components/cards/Post";
import { app, database, storage } from "../components/firebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  setDoc,
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";
import { async } from "@firebase/util";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Purchased() {
  const [cardarr, setcardarr] = useState([]);
  const [fireuser, setfireuser] = useState({})
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
   getfireuser();
    getImages()
  }, [])

  console.log(user);

  const getfireuser = async () => {
    const docRef = doc(database, "users", user.uid);
    const docSnap = await getDoc(docRef);
    setfireuser(docSnap.data())
  }

  const getImages = async () => {
    
    const q = query(collection(database, "images"), where("purchasedby", "==", user.uid));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = [];
  var arr = [];
  querySnapshot.forEach((item) => {
    arr.push({ array: item.data(), id: item.id });
  });
  console.log(arr,'jvmjcmchcmhcmv,jv');
  setcardarr([...arr]);
//   console.log("Current cities in CA: ", cities.join(", "));
});

// console.log(cardarr);

    // const collectionRef = collection(database, 'images');
    // const nameQuery = query(collectionRef, where("createdby", "==", user.uid))
    // var arr = [];
    // await getDocs(nameQuery)
    //   .then((res) => {
    //     console.log(res);
    //     res.docs.map((item) => {
    //       arr.push({ array: item.data(), id: item.id });
    //       console.log(item.id)
    //     })
    //   })
    // setcardarr([...arr]);
  }

  return (
    <div>
    <Navbar />
    <div className='bg-[#61876E] h-screen '>
    <div className="  bg-[#61876E]  p-4" id="gallery">
                <p className="mt-16  text-white font-ibm font-bold text-[50px]">Purchased by {fireuser.name}</p>
                <div className="md:grid md:grid-cols-2 items-center gap-16 w-full justify-center">
           {
            cardarr?.map((item,index)=>{
                console.log(item.array);
                return (

                    <Post id={item.id} caption={item.array.caption} imageurl={item.array.url} name={item.array.name} likes={item.array.likes} createdby={item.array.createdby} watermark={0}/>


                 )
            },[])
           } 
        </div>
            </div>
            </div>
            </div>
  )
}
