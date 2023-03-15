import axios from "axios";
import { LoremIpsum } from "lorem-ipsum";
import React from "react";
import { app, database, storage } from "../components/firebaseConfig";

import { Link } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  setDoc,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const options = {
  method: "GET",
  url: "https://picsum.photos/652/360",
  // headers: {
  //   'content-type': 'application/json',
  //   'X-RapidAPI-Key': 'fc9ac53e3amsh7f0c55372e6f0bep1224a8jsn1e1b9847a5de',
  //   'X-RapidAPI-Host': 'hydra-ai.p.rapidapi.com'
  // },
  // data: '{"image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsewZDwDJGKDR-ZO4Rmf9vUUKWjyArPPIqqzu4WDGDOA&s"}'
};

async function handlesearch() {
  const collectionRef = collection(database, "images");
  const text = "alp";
  var tags = [];
  var arr = [[]];
  await getDocs(collectionRef).then((res) => {
    res.docs.map((item) => {
      item.data().tags.map((tagitem) => {
        if (tags.includes(tagitem)) {
          arr[tagitem].push(item.id);
        } else {
          tags.push(tagitem);
          arr[tagitem] = [item.id];
        }
      });
    });
  });
  console.log(arr);
}

async function adddata() {
  const collectionRef = collection(database, "images");
  const collectionRefusers = collection(database, "users");
  var arr = [];
  await getDocs(collectionRefusers).then((res) => {
    res.docs.map((item) => {
      arr.push(item.data());
    });
  });
  console.log(arr);

  // console.log(arr[Math.floor(Math.random()*arr.length)]);
  for (var i = 0; i < 10; ) {
    var val = Math.floor(Math.random() * arr.length);

    var id = arr[val].uid;
    var postarr = arr[val].posts ? arr[val].posts : [];
    // var tags=arr[val].tags
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 10,
        min: 4,
      },
    });
    var para = lorem.generateParagraphs(1);
    console.log(para);

    const options2 = {
      method: "POST",
      url: "https://hydra-ai.p.rapidapi.com/dev/image-analysis/multilabel",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "48334e4faemsh146b66580f9c961p13d654jsnfb3484c3b23a",
        "X-RapidAPI-Host": "hydra-ai.p.rapidapi.com",
      },
      data: `{"image":"https://picsum.photos/id/${i + 10}/652/360"}`,
    };

    await axios
      .request(options2)
      .then(async function (response) {
        console.log(response.data.body);
        var tags = [];

        const sortable = Object.entries(
          response.data.body.image_classification
        ).sort(([, a], [, b]) => b - a);
        console.log(sortable[0][0], "sortable");
        const myArray = sortable[0][0].split(",");
        console.log(myArray);
        tags.push(myArray[0]);
        const myArray2 = sortable[1][0].split(",");
        console.log(myArray);
        tags.push(myArray2[0]);
        console.log(tags);

        i++;
        const docq = await addDoc(collectionRef, {
          createdby: id,
          name: arr[val].name,
          url: `https://picsum.photos/id/${i + 10}/652/360`,
          caption: para,
          likes: Math.floor(Math.random() * 100),
          tags: tags,
        });
        postarr.push(docq.id);
        const doctoupdate = doc(database, "users", id);
        updateDoc(doctoupdate, {
          posts: postarr,
        });
      })
      .catch(function (error) {
        i = -1;
        console.error(error);
      });
    if (i === -1) {
      console.log("what");
      break;
    }
  }
}
async function fuc() {
  const options = {
    method: "GET",
    url: "https://image-kit.p.rapidapi.com/imagekit",
    params: {
      url: "https://picsum.photos/652/360",
      quality: "80",
      resize: "auto,512",
      rotate: "45",
      blur: "8",
    },
    headers: {
      "X-RapidAPI-Key": "05a69e41edmsha67e45c49afa614p11bbe3jsn12819044cc55",
      "X-RapidAPI-Host": "image-kit.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export default function Home() {
  return (
    <div className="bg-bghome h-screen bg-no-repeat w-screen">
      <div className="flex flex-col justify-center items-center gap-32 h-screen ">
        <span className="text-white text-[70px] text-center font-medium mt-24 font-jost">
          Bringing your vision to life,
          <br /> one shot at a time
        </span>
        <Link to="/signup">
        <button className="bg-[#61876E] hover:bg-[#AA5656] border-2  rounded-2xl text-white font-jost py-2 px-4 mt-6 w-[300px] shadow-black shadow-lg hover:scale-110 transition duration-300 ease-in-out">
          GET STARTED
        </button>
        </Link>
      </div>
    </div>
  );
}
