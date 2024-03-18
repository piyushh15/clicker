


const Upper = () => {
  return (
    <section id="home" className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container min-h-full" >
      <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:padding-x pt-15"  >
          <h2 className="text-xl font-montserrat text-coral-red"> Security used to be an inconvenience sometimes,</h2>
          <h2 className="mt-10 font-palanquin text-4xl max-sm:text-[36px] max-sm:leading-[42px]"> but now it`s a necessity all the time.</h2>
          <h3 className="font-montserrat text-slate-grey text-lg leading-9 mt-6 mb-14 sm:max-w-sm"> Let`s start to secure our Area with a small step Now!!!</h3>
      </div>
        <div className="relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-primary bg-hero bg-cover bg-center">
          <div className="object-contain relative z-10">
            <img
              alt=""
              src="https://img.freepik.com/free-photo/3d-data-technology-background-with-low-poly-plexus-design_1048-18066.jpg?size=626&ext=jpg&ga=GA1.1.315140480.1698958348&semt=ais"
            ></img>
          </div>
        
      
    </div>

    </section>
  );
};

export default Upper;
