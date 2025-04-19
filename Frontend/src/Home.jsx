import React from 'react'
import HomeHeader from './components/HomeHeader'
import HomeFooter from './components/HomeFooter'
import HomeBody from './components/HomeBody'
import HomeImage from './components/HomeImage'

function Home() {
  return (
    <div>
        <HomeHeader/>
        <HomeImage/>
        {/* <HomeBody/> */}
        {/* <HomeFooter/> */}
    </div>
  )
}

export default Home