import React from 'react';

interface DieProps {
  value: number;
}

export const Die: React.FC<DieProps> = ({ value }) => {
  const renderDots = () => {
    const dots = [];
    const dotClass = "absolute w-2 h-2 bg-white rounded-full";

    switch (value) {
      case 1:
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        break;
      case 2:
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        break;
      case 3:
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        break;
      case 4:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      case 5:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      case 6:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="mid-left" className={`${dotClass} top-1/2 left-1/4 transform -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="mid-right" className={`${dotClass} top-1/2 right-1/4 transform -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      default:
        break;
    }

    return dots;
  };

  return (
    <div className="w-16 h-16 bg-red-600 rounded-md shadow-md relative flex items-center justify-center">
      {renderDots()}
    </div>
  );
};

interface DiceSetProps {
  values: number[];
}

export const DiceSet: React.FC<DiceSetProps> = ({ values }) => {
  return (
    <div className="flex gap-2">
      <Die value={values[0]} />
      <Die value={values[1]} />
    </div>
  );
}; 