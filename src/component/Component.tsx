import lightning from '../assets/Lightning.svg'
import mine from '../assets/artifact/mine.svg'
import map from '../assets/artifact/map.svg'

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
const Artifacts = (props:{img:string}) =>{
    return <div className='artifact-border'>
        <figure> <img src={props.img} alt="" /></figure>
      </div>
}

export const ArtifactsList = () => {
  const artifactImages = [mine,map
    
  ]; 

  return (
    <div className="artifacts-list">
      {artifactImages.map((img, index) => (
        <Artifacts key={index} img={img} />
      ))}
    </div>
  );
};



export const RuleBlox = (props :{content : string}) =>{
    return <div className='rule-bloc'>
      <p className='rules'> {props.content}</p>
      </div>
} 

export const PlayButton = () =>{
  return<button className='PlayButton'> Play ! →</button>
} 

export const Footer = (props :{content1 : string, content2 : string, content3 : string}) => {
  return (
    <div className='footer'>
      <p> {props.content1}</p>
      <p> {props.content2}</p>
      <p> {props.content3}</p>
    </div>
  );

}