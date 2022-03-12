import {useState} from 'react';
import {LinkStatus} from 'src/dto/LinksResponse';

export const useLinkEditForm = () => {
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState(LinkStatus.ACTIVE);

  return {
    label,
    setLabel,
    status,
    setStatus,
    submitInProgress: false,
    labelError: null,
  };
};
