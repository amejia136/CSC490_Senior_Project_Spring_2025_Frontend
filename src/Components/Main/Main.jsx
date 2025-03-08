import React, {useEffect} from "react";
import './main.css'

import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuClipboardCheck } from "react-icons/lu";


import img from '../../Assets/img.jpg'
import img2 from '../../Assets/img2.jpg'
import img3 from '../../Assets/img3.jpg'
import img4 from '../../Assets/img4.jpg'
import img5 from '../../Assets/img5.jpg'
import img6 from '../../Assets/img6.jpg'
import img7 from '../../Assets/img7.jpg'
import img8 from '../../Assets/img8.jpg'
import img9 from '../../Assets/img9.jpg'

import Aos from 'aos'
import 'aos/dist/aos.css'


const Data = [
    {
        id: 1,
        imgSrc: img,
        destTitle: 'Yellowstone National Park',
        location: 'Wyoming, USA',
        grade: 'CULTURAL RELAX',
        fees: '$300',
        description: 'Home to geysers, hot springs, and diverse wildlife, Yellowstone is the first national park in the world and a paradise for nature lovers.'
    },

    {
        id: 2,
        imgSrc: img2,
        destTitle: 'Niagara Falls',
        location: 'New York, USA',
        grade: 'CULTURAL RELAX',
        fees: '$500',
        description: 'A breathtaking natural wonder, Niagara Falls attracts millions of visitors each year with its powerful waterfalls and stunning views.'
    },

    {
        id: 3,
        imgSrc: img3,
        destTitle: 'Everglades National Park',
        location: 'Florida, USA',
        grade: 'CULTURAL RELAX',
        fees: '$400',
        description: 'The Everglades is a unique subtropical ecosystem, home to alligators, manatees, and thrilling airboat rides through the wetlands.'
    },

    {
        id: 4,
        imgSrc: img4,
        destTitle: 'American Museum of Natural History',
        location: 'New York, USA',
        grade: 'CULTURAL RELAX',
        fees: '$500',
        description: 'One of the largest museums in the world, featuring exhibits on dinosaurs, space, human history, and much more.'
    },

    {
        id: 5,
        imgSrc: img5,
        destTitle: 'Mount Rushmore National Memorial',
        location: 'South Dakota, USA',
        grade: 'CULTURAL RELAX',
        fees: '$600',
        description: 'An iconic monument featuring the carved faces of four U.S. presidents, symbolizing the nation’s history and democracy.'
    },

    {
        id: 6,
        imgSrc: img6,
        destTitle: 'Disney World',
        location: 'Florida, USA',
        grade: 'CULTURAL RELAX',
        fees: '$900',
        description: 'A world-famous theme park offering magical experiences, thrilling rides, and entertainment for visitors of all ages.'
    },

    {
        id: 7,
        imgSrc: img7,
        destTitle: 'Universal Studios Hollywood',
        location: 'California, USA',
        grade: 'CULTURAL RELAX',
        fees: '$500',
        description: 'A must-visit destination for movie lovers, featuring thrilling rides, studio tours, and immersive entertainment experiences.'
    },

    {
        id: 8,
        imgSrc: img8,
        destTitle: 'Times Square',
        location: 'New York, USA',
        grade: 'CULTURAL RELAX',
        fees: '$600',
        description: 'A bustling hub of lights, theaters, shopping, and entertainment, Times Square is the vibrant heart of New York City.'
    },

    {
        id: 9,
        imgSrc: img9,
        destTitle: 'Las Vegas Strip',
        location: 'Nevada, USA',
        grade: 'CULTURAL RELAX',
        fees: '$500',
        description: 'Famous for its luxury hotels, casinos, and world-class entertainment, the Las Vegas Strip offers an unforgettable nightlife experience.'
    }


]




const Main = () => {
    useEffect(() => {
        Aos.init({duration: 2000})
    },[])

    return (
        <section className='main container section'>

            <div className="secTitle">
                <h3 data-aos ="fade-right"
                    className="title">
                    Most visited destinations
                </h3>
            </div>

            <div className="secContent grid">

                {
                    Data.map(({id,imgSrc,destTitle,location,grade,fees,description})=>{
                        return(
                            <div key={id}
                                 data-aos ="fade-up"
                                 className="singleDestination">

                                <div className="imageDiv">
                                    <img src={imgSrc} alt=
                                        {destTitle}/>
                                </div>

                                <div className="cardInfo">
                                    <h4 className="destTitle">
                                        {destTitle}</h4>

                                    <span className="continent flex">
                                        <HiOutlineLocationMarker className ='icon'/>
                                        <span className="name">{location}</span>
                                    </span>

                                    <div className="fees flex">
                                        <div className="grade">
                                            <span>{grade}<small>+1</small></span>
                                        </div>
                                        <div className="price">
                                            <h5>{fees}</h5>
                                        </div>
                                    </div>

                                    <div className="desc">
                                        <p>{description}</p>
                                    </div>

                                    <button className="btn flex">
                                        DETAILS <LuClipboardCheck className="icon"/>
                                    </button>
                                </div>
                            </div>

                        )
                    })
                }


            </div>


        </section>
    )
}

export default Main;