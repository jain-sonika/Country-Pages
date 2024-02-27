import heroImg from '../images/hero-image-wr.jpg'
import logoImg from '../images/Logo.svg'

export default function Header () {


    return (
        <header className='relative max-h-[300px] overflow-hidden'>
            <img className='w-full' src={heroImg}></img>
            <img className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={logoImg} alt="Logo Image"></img>
        </header>
    )
}