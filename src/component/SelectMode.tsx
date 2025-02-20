
export const SelectMode = (props :{title : string , img : string}) =>{   

    return <div className='select-mode'>
                <img className="select-img" src={props.img} alt="" />
                <div className='mode'>
                    <h2 className="manjari">{props.title}</h2>
                </div>
            </div>


}