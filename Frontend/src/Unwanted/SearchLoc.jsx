import React from 'react'
import '../inside.css'
import InsideHeader from '../components/InsideHeader'
import InsideFooter from '../components/InsideFooter'

function SearchHosp() {
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
       <div>
        <InsideHeader/>
          <div className="searchdiv">
            <div className="nav-search">
              <input className="search-input" placeholder="Search Location" />
              <div className="Sicon">
                  <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          </div>
          <div className="searchHospdiv">
          <div id="hospdiv"  style={{height:"150px",backgroundColor:"white"}}> </div>
          
          </div>
          <div className="searchHospdiv">
          <div id="hospdiv"  style={{height:"150px",backgroundColor:"white"}}> </div>
          
          </div>
          <div className="searchHospdiv">
          <div id="hospdiv"  style={{height:"150px",backgroundColor:"white"}}> </div>
          
          </div>
          <div className="searchHospdiv">
          <div id="hospdiv"  style={{height:"150px",backgroundColor:"white"}}> </div>
          
          </div>
        </div>
        <InsideFooter/> 
    </div>
  )
}

export default SearchHosp
