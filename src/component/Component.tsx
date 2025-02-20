import lightning from '../assets/Lightning.svg'

export const LogoTitle = () =>{
    return <div className='logo-container'>
            <div className="logo-up">
              <h1>WIKI</h1>
              <img src={lightning} alt="" />
              <h1>PEED</h1>
            </div>
            <h3>QUI SERA LE PLUS RAPIDE</h3>
          </div>
}

export const CreditButton = () =>{
    return <div className='credit-button'>
      <p className='manjari'>Credits</p>
      </div>
}
