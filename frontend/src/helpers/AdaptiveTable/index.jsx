import { useState } from 'react';

const useAdaptiveCell = () => {
  const [activeCell, setActiveCell] = useState({
    id: '',
    isClicked: false,
  });

  const onClickCellHandler = (cellContent) => {
    if (!activeCell.id || activeCell.id !== cellContent) {
      setActiveCell({
        id: cellContent,
        isClicked: true,
      });
    } else {
      setActiveCell({
        id: cellContent,
        isClicked: !activeCell.isClicked,
      });
    }
  };

  const adaptiveCell = (cellContent) => {
    if (activeCell.id === cellContent) {
      return activeCell.isClicked ? 'cell-expanded' : 'text-truncate cell-truncated';
    }
    return 'text-truncate cell-truncated';
  };

  return { onClickCellHandler, adaptiveCell };
};

export default useAdaptiveCell;
