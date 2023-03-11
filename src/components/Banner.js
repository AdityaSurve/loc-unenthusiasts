
export const Banner=()=>{
    return(
        <div className="flex flex-row  p-48 bg-bannerBg h-screen bg-cover bg-no-repeat w-screen">
            <div className="flex flex-col items-start h-[100%] w-[60%] bg-transparent justify-center">
                <h1 className="text-5xl text-white">Welcome <span>User</span> !</h1>
                <p className="font-semibold text-white mt-10 text-3xl">Capturing life's moments one shot at a time!</p>
            </div>
            <div className=" h-[100%] w-[60%] bg-black"></div>
        </div>
    )
}