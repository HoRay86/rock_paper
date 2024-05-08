import React from 'react'


interface Props{
    name: string,
    icon: JSX.Element ,
    iconSize: number ,
}
const IconWithName = ({ icon, iconSize, name }: Props) => {
    const iconStyle = { fontSize: iconSize };
  
    return (
      <>
        {React.cloneElement(icon, { size: iconSize, style: iconStyle })}
        {name.charAt(0).toUpperCase() + name.slice(1)} {/* 將首字母轉為大寫 */}
      </>
    );
  };

export default IconWithName