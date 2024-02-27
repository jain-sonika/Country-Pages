import { useEffect } from "react"
import Header from "../components/Header"
import { useState } from "react"
import ButtonLeftImg from '../images/Button_left.svg'
import ButtonRightImg from '../images/Button_right.svg'

export default function Home() {
    const [valueInput, setValueInput] = useState('')
    const [totalCountries, setTotalCountries] = useState(0)
    const [countries, setCountries]  =  useState([])
    const [countriesFiltered, setCountriesFiltered]  =  useState([])

    const [country, setCountry]  =  useState()
    const [languages,setLanguages] = useState()
    const [currency,setCurrency] = useState()
    const [neighbouringCountries, setnNeighbouringCountries] = useState([])
    const [showCountries, setShowCountries] = useState(false)
    const [sortFilter, setSortFilter] = useState("population")
    //Filters
    const [unMemberChecked, setUnMemberChecked] = useState(false)
    const [independentChecked, setIndependentChecked] = useState(false)
    const [isAmericas, setIsAmericas] = useState(true)
    const [isAntarctic, setIsAntarctic] = useState(true)
    const [isAfrica, setIsAfrica] = useState(true)
    const [isAsia, setIsAsia] = useState(true)
    const [isEurope, setIsEurope] = useState(true)
    const [isOceania, setIsOceania] = useState(true)

    const [positionNumbers, setPositionNumbers] = useState("")

    const handleKeyDown = (event) => {
		setIsAmericas(!isAmericas)
		setIsAntarctic(!isAntarctic)
		setIsAfrica(!isAfrica)
		setIsAsia(!isAsia)
		setIsEurope(!isEurope)
		setIsOceania(!isOceania)

        if (event.key === 'Enter') {
            valueInput.trim() === "" ? setCountriesFiltered(countries) : (
                setCountriesFiltered(countries.filter( country => {

                    const searchValue = valueInput.trim().toLowerCase()
                    const found =   (country.name.common?.toLowerCase().includes(searchValue)) ||
                                    (country.region?.toLowerCase().includes(searchValue)) ||
                                    (country.subregion?.toLowerCase().includes(searchValue)) 
                    return found 
                })) 
            )
        }
    }


    useEffect(() =>{
        applyFiltersCheckbox()
    },[unMemberChecked,independentChecked, isAmericas, isAntarctic, isAfrica, isAsia, isEurope, isOceania])
    
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,area,region,unMember,independent')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setCountries(data)
            setCountriesFiltered(data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])

    const showCountry = (countryName, event) => {
        setShowCountries(true)
        event.stopPropagation()
        fillCountryPage(countryName)
    }

    const closeCountry = () => {
		setCountry("")
        setShowCountries(false)
    }
    
    const handleSortChange = (event) => {
        setSortFilter(event.target.value)
    }

    const fillCountryPage = (countryName) => {
        console.log(countryName)
        fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
            .then(response => response.json())
                .then(data => {
                    console.log(data[0])
                    setCountry(data[0])
                    setLanguages(Object.values(data[0].languages).join(', '))
                    for(const currencyCode in data[0].currencies) {
                        setCurrency(data[0].currencies[currencyCode].name)
                    }
                    return fetch(`https://restcountries.com/v3.1/subregion/${data[0].subregion}?fields=name,flags`)
                })
                .then(response => response.json())
                 .then( data => {
                    console.log(data)
                    setnNeighbouringCountries(data)
                 })
                .catch(error => {
                console.log(error)
        })
    }

    const changeCountryPage = (countryName, event) =>{

        fillCountryPage(countryName)
    }
    const doNothing = (event) => {
        event.stopPropagation()
    }

    useEffect(() => {
        setTotalCountries(countriesFiltered.length)
    }, [countriesFiltered])


    const handleUnMemberCheckboxChange = () => {
        setUnMemberChecked(!unMemberChecked)
    }

    const handleIndependentCheckboxChange = () => {
        setIndependentChecked(!independentChecked)
    }

    const handleFilterAmericas = () => {
        setIsAmericas(!isAmericas)
    }
    const handleFilterAntarctic = () => {
        setIsAntarctic(!isAntarctic)
    }
    const handleFilterAfrica = () => {
        setIsAfrica(!isAfrica)
    }
    const handleFilterAsia = () => {
        setIsAsia(!isAsia)
    }
    const handleFilterEurope = () => {
        setIsEurope(!isEurope)
    }
    const handleFilterOceania = () => {
        setIsOceania(!isOceania)
    }

    const applyFiltersCheckbox = () => {

            setResetPosition(!resetPosition)
            setCountriesFiltered(countries.filter(country => {
            const isUnMemberMatch = !unMemberChecked || country.unMember
            const isIndependentMatch = !independentChecked || country.independent
            const isRegion =    (isAmericas && country.region === "Americas") ||
                                (isAntarctic && country.region === "Antarctic") ||
                                (isAfrica && country.region === "Africa") ||
                                (isAsia && country.region === "Asia") ||
                                (isEurope && country.region === "Europe") ||
                                (isOceania && country.region === "Oceania")  
            return isUnMemberMatch && isIndependentMatch && isRegion
          }))
    }
    const totalPosition = Math.ceil(countriesFiltered.length/10)

    const [position, setPosition] = useState(0)
    const [resetPosition, setResetPosition] = useState(false)

    useEffect(() => {
        if(totalPosition > 4) {
            let numbers = []
            for(let i = 1; i < totalPosition + 1; i++) {
                numbers.push(i)
            }
            setPositionNumbers(numbers)
        } else {
            setPositionNumbers(0)
        }
    },[totalPosition])
    const showNextCategories = () => {
        const newPos = position + 1

        if (newPos < totalPosition ) {
            setPosition(newPos)
        }
    }
    const showPrevCategories = () => {
        const newPos = position - 1

        if (newPos > -1 ) {
            setPosition(newPos)
        }
    }
    const handlePosition = (event) => {
        const value = parseInt(event.target.innerHTML)
        setPosition(value - 1)
    }
    useEffect(() => {
        setPosition(0)
    },[resetPosition])
    return (
        <section 
            className="h-screen flex flex-col"
            onClick={closeCountry}
        >
            <Header/>
            <main className="flex-1 relative bg-[#181819] h-fit ">
                <section 
                    className={`w-fit absolute  flex flex-col gap-[36px] left-1/2 -translate-x-1/2 top-[-70px] bg-[#1B1D1F] py-[24px] px-[32px] rounded-xl border border-[#282B30] ${showCountries ? 'hidden' : '' }`}>
                    <header className="flex justify-between items-center text-center	">
                        <span className="text-[#6C727F] text-[16px] font-semibold ">{`Found ${totalCountries} countries`}</span>
                        <input 
                            type="text"
                            className='bg-search-image bg-no-repeat bg-[18px] pl-[50px] placeholder-[#6C727F] w-[380px] rounded-2xl py-[12px] px-[24px] bg-[#282B30] text-white text-[14px] font-semibold'
                            placeholder='Search by Name, Region, Subregion'
                            onChange={(e) => setValueInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </header>
                    <div className="flex lg:flex-row flex-col gap-[32px]">
                        <section className="flex flex-col lg:w-[200px] xl:w-[250px] ">
                            <div className="flex flex-col gap-[8px] lg:w-[200px] xl:w-[240px] ">
                                <label className="text-[#6C727F] font-semibold text-[12px] lg:w-[200px] xl:w-[240px]">Sort by</label>
                                <select 
                                    className="lg:w-[200px] xl:w-[240px] bg-[#1B1D1F] border border-[#282B30] text-[#D2D5DA] font-semibold text-[14px] px-[20px] py-[10px] rounded-lg"
                                     onChange={handleSortChange}
                                >
                                    <option value="population">Population</option>
                                    <option valeu="alphabetical">Alphabetical</option>
                                    <option value="area">Area</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-[8px] mt-[32px] lg:w-[200px] xl:w-[240px]">
                                <label className="text-[#6C727F] font-semibold text-[12px] lg:w-[200px] xl:w-[240px]">Region</label>
                                <div className="flex flex-wrap gap-[10px] lg:w-[200px] xl:w-[240px]">
                                     <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isAmericas ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterAmericas}
                                    >
                                        <span className="text-[14px] font-semibold">Americas</span>
                                    </div>
                                    <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isAntarctic ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterAntarctic}
                                    >
										<span className="text-[14px] font-semibold">Antarctic</span>
                                    </div>
                                    <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isAfrica ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterAfrica}
                                    >
                                        <span className="text-[14px] font-semibold">Africa</span>
                                    </div>
                                    <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isAsia ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterAsia}
                                    >
                                        <span className="text-[14px] font-semibold">Asia</span>
                                    </div>
                                    <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isEurope ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterEurope}
                                    >
                                        <span className="text-[14px] font-semibold">Europe</span>
                                    </div>
                                    <div 
                                        className={`px-[10px] py-[5px] rounded-lg ${isOceania ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-[#1B1D1F] text-[#6C727F]'}`}
                                        onClick={handleFilterOceania}
                                    >
                                        <span className="text-[14px] font-semibold">Oceania</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[8px] mt-[32px]">
                                <label className="text-[#6C727F] font-semibold text-[12px]">Status</label>
                                    <div className="flex items-center gap-[10px]">
                                        <input 
                                            type="checkbox" 
                                            id="cbox1" 
                                            value="first_checkbox" 
                                            className={`checkbox-input appearance-none size-[23px] bg-[#1B1D1F] rounded border-[2px] border-[#6C727F] checked:bg-[#4E80EE] checked:border-[#4E80EE] ${unMemberChecked ? "bg-[url('Done_round.svg')]": ""}`}
                                            checked={unMemberChecked}
                                            onChange={handleUnMemberCheckboxChange}
                                        /> 
                                        <label 
                                            className="lg:w-[200px]  xl:w-[210px] text-[#D2D5DA]  text-[14px] font-semibold"
                                        > Member of the United Nations
                                        </label> 
                                    </div>
                                    <div className="flex items-center gap-[10px]">
                                        <input 
                                            type="checkbox" 
                                            id="cbox2" 
                                            value="second_checkbox" 
                                            className={`checkbox-input appearance-none size-[23px] bg-[#1B1D1F] rounded border-[2px] border-[#6C727F] checked:bg-[#4E80EE] checked:border-[#4E80EE] ${independentChecked ? "bg-[url('Done_round.svg')]": ""}`}
                                            checked={independentChecked}
                                            onChange={handleIndependentCheckboxChange}
                                        /> 
                                        <label 
                                            className="text-[#D2D5DA]  text-[14px] whitespace-nowrap font-semibold"
                                        > Independent
                                        </label> 
                                    </div>
                            </div>
                        </section>
                        <section className="flex-1 bg-[#1B1D1F]">
                            <div className="text-[12px] fixed-width-grid  pb-[16px] text-[#6C727F] border-b border-[#6C727F]">
                                <div className="col-span-1">Flag</div>
                                <div className="col-span-1">Name</div>
                                <div className="col-span-1">Population</div>
                                <div className="col-span-1">Area(km<sup>2</sup>)</div>
                                <div className="hidden xl:flex xl:col-span-1">Region</div>

                            </div>
                            {
                                countriesFiltered &&
                                sortFilter &&
                                countriesFiltered
                                  .sort((a, b) => {
                                    if (sortFilter === 'population' || sortFilter === 'Population') {
                                      return b.population - a.population
                                    } else if (sortFilter === 'area' || sortFilter === 'Area') {
                                      return b.area - a.area
                                    } else if (sortFilter === 'alphabetical' ||sortFilter === 'Alphabetical' ) {
                                      return a.name.common.localeCompare(b.name.common)
                                    } else {
                                      return 0
                                    }
                                  })
                                  .slice(position * 10, position * 10 + 10)
                                  .map((country, index) => (
                                    <div
                                    onClick={(event) => showCountry(country.name.common, event)}
                                    key={index}
                                    className="fixed-width-grid pt-[16px] text-[#D2D5DA] text-[14px] font-semibold"
                                  >
                                    <img className="col-auto w-[50px] h-[38px] rounded-md" src={country.flags.png} alt={country.name.common} />
                                    <h3 className="col-auto">{country.name.common}</h3>
                                    <span className="col-auto text-[#D2D5DA] ">{country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                    <span className="col-auto text-[#D2D5DA]">{country.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                    <span className="hidden xl:flex xl:col-auto xl:text-[#D2D5DA]">{country.region}</span>
                                  </div>
                                ))
                            }
                            <div className="flex justify-between mt-[20px] mb-[40px] w-full items-center">
                                <span className="text-[#6C727F] text-[12px]">{`${totalCountries > 1 ? position * 10 + 1 : 0} to ${position * 10 + 10 > totalCountries ? totalCountries : position * 10 + 10} of ${totalCountries} countries`}</span>
                                <div className="flex items-center text-center gap-[5px]">
                                <button>
                                    <img 
                                        onClick={showPrevCategories} 
                                        src={ButtonLeftImg}
                                        className={`size-[15px] ${position === 0 ? "opacity-0" : "opacity-100"}`}
                                    ></img>
                                </button>
                                <div className="flex gap-[5px] items-center">
                                {
                                    positionNumbers && (
                                        positionNumbers.map( position => (
										
										<button
											 onClick={handlePosition}
										>
                                            <span 
                                                className="text-[#6C727F] text-[12px] flex items-center"
                                                value={position}
                                            >{position}
                                            </span>
										</button>
                                        ))
                                    )
                                }
                                </div>
                                <button>
                                    <img 
                                        onClick={showNextCategories} 
                                        src={ButtonRightImg}
                                        className={`size-[15px] ${position === totalPosition - 1? "opacity-0" : "opacity-100"}`}
                                    ></img>
                                </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
                <section 
                    className={`w-fit absolute  flex flex-col gap-[36px] left-1/2 -translate-x-1/2 top-[-70px] bg-[#1B1D1F] mb-[50px] rounded-xl border border-[#282B30] ${showCountries ? '' : 'hidden'}`}
                    onClick={doNothing}        
                >
                {
                    country ? (
                        <div className=" flex flex-col items-center">
                            <img className="absolute top-[-48px] w-[260px] h-[196px] rounded-xl" src={country.flags.png}></img>
                            <h1 className="text-[32px] text-[#D2D5DA] mt-[164px] mb-[8px]">{country.name.common}</h1>   
                            <h2 className="text-[16px] text-[#D2D5DA] mb-[40px]">{country.name.official}</h2>     
                            <div className="flex gap-[40px] mb-[40px] text-[14px] px-[80px]">
                                <div className="flex text-[#D2D5DA] bg-[#282B30] py-[15px] rounded-xl">
                                    <label className="px-[20px] border-r border-[#1B1D1F]">Population</label>
                                    <span className="px-[20px]">{country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>    
                                <div className="flex text-[#D2D5DA] bg-[#282B30] py-[15px] rounded-xl">
                                    <label className="px-[20px] border-r border-[#1B1D1F]">Area(km<sup>2</sup>) </label>
                                    <span className="px-[20px]">{country.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>    
                            </div>    
                            <div className="flex flex-col text-[14px] w-full">
                                <div className="flex p-[20px] justify-between text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Capital</label>
                                    <span className="text-[#D2D5DA]">{country.capital}</span>
                                </div>
                                <div className="flex p-[20px] justify-between text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Subregion</label>
                                    <span className="text-[#D2D5DA]">{country.subregion}</span>
                                </div>
                                <div className="flex p-[20px] justify-between text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Language</label>                             
                                    {   
                                        <span className="text-[#D2D5DA]">{languages}</span>
                                    }                                    
                                </div>
                                <div className="flex p-[20px] justify-between text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Currencies</label>
                                    <span className="text-[#D2D5DA]">{currency}</span>
                                </div>
                                <div className="flex p-[20px] justify-between text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Continents</label>
                                    <span className="text-[#D2D5DA]">{country.continents}</span>
                                </div>
                                <div className="flex p-[20px] flex-col text-[#6C727F] border-y border-y-[#282B30]">
                                    <label>Neighbouring Countries</label> 
                                    <div className="flex  gap-[16px] w-full flex-wrap">
                                    {
                                        neighbouringCountries && (
                                            neighbouringCountries.map((country,index) => (
                                                <div 
                                                    key={index} className="flex flex-col gap-[8px] items-center mt-[16px]"
                                                    onClick={(event) => changeCountryPage(country.name.common,event)}
                                                >
                                                    <img 
                                                        src={country.flags.png}
                                                        alt={country.flags.alt}
                                                        className="h-[65px] w-[86px] rounded-md"
                                                    ></img>
                                                    <span className="text-[#D2D5DA] max-w-[86px] text-center">{country.name.common}</span>
                                                </div>

                                            ))
                                        )
                                    }  
                                    </div>
                                </div>
                            </div>     
                        </div>
                    ) :	(   <div className=" flex flex-col items-center w-[200px] h-[200px]">
							    <h1 className='text-[#D2D5DA]'> Loading</h1>
						    </div>
					)
				}
                </section>
            </main>
        </section>
    )
}