import {useState} from 'react';
import {LinkStatus} from 'src/dto/LinksResponse';

export const useCreateLinkForm = () => {
  const [label, setLabel] = useState('');
  const [labelError, setLabelError] = useState<string | null>(null);
  const [linkTarget, setLinkTarget] = useState('');
  const [linkTargetError, setLinkTargetError] = useState<string | null>(null);
  const [status, setStatus] = useState(LinkStatus.ACTIVE);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  return {
    label,
    setLabel,
    labelError,
    linkTarget,
    setLinkTarget,
    linkTargetError,
    status,
    setStatus,
    submitInProgress,
  };
};
