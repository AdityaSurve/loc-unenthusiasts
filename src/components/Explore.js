
import { app, database, storage } from './firebaseConfig'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,onAuthStateChanged, signOut } from "firebase/auth";

import { collection, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc ,onSnapshot,query,where} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Post } from "./cards/Post"
import {React, useEffect, useState } from "react";
export const Explore=()=>{
    const [cardarr,setcardarr]=useState([]);
    const getImages= async()=>{
        const collectionRef = collection(database, 'images');
        

        var arr=[];
          await getDocs(collectionRef)
              .then((res) => {
                console.log(res);
               res.docs.map((item)=>{
                arr.push({array:item.data(),id:item.id});
                console.log(item.id)
               }) 
            })
            setcardarr([...arr]);

    }
    console.log(cardarr);
    useEffect(()=>{
       getImages();

    },[])
    return(
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
    )
}