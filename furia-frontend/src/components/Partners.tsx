import React from "react";

const logoIconsList = [
  {
    imgPath: "/logos/hellmanns.png",
  },
  {
    imgPath: "/logos/cruzeirodosul.png",
  },
  {
    imgPath: "/logos/adidas.png",
  },
  {
    imgPath: "/logos/lenovo.png",
  },
  {
    imgPath: "/logos/pokerstars.png",
  },
  {
    imgPath: "/logos/redbull.png",
  },
];

const LogoIcon = ({ icon }: any) => {
  return (
    <div className="flex-none flex-center marquee-item">
      <img width={70} src={icon.imgPath} alt={icon.name} />
    </div>
  );
};
const LogoSection = () => {
  return (
    <div className="md:my-20 my-10 relative overflow-hidden">
      <div className="hidden sm:block gradient-edge dark:gradient-edge-dark"></div>
      <div className="hidden sm:block gradient-edge dark:gradient-edge-dark"></div>
      <div className="marquee h-52">
        <div className="marquee-box md:gap-12 gap-5">
          {logoIconsList.map((icon) => (
            <LogoIcon key={icon.imgPath} icon={icon} />
          ))}
          {logoIconsList.map((icon) => (
            <LogoIcon key={icon.imgPath} icon={icon} />
          ))}
          {logoIconsList.map((icon) => (
            <LogoIcon key={icon.imgPath} icon={icon} />
          ))}
          {logoIconsList.map((icon) => (
            <LogoIcon key={icon.imgPath} icon={icon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
