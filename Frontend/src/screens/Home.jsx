import Navbar from '../components/Navbar'
import Body from '../components/Body'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <main className='relative' >
        <Navbar/>
        <section className="padding " >
            <Body/>
        </section>
        <section  className=" padding-x padding-t pb-8max-container bg-gradient-to-l from-custom-blue to-custom-black">
            <Footer/>
        </section>
    </main>
  )
}

export default Home