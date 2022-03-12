import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LinkStatus} from 'src/dto/LinksResponse';
import {useCreateLink} from 'src/services/linkManagement';

export const useCreateLinkForm = () => {
  const navigate = useNavigate();
  const createLink = useCreateLink();

  const [label, setLabel] = useState('');
  const [labelError, setLabelError] = useState<string | null>(null);
  const [linkTarget, setLinkTarget] = useState('');
  const [linkTargetError, setLinkTargetError] = useState<string | null>(null);
  const [status, setStatus] = useState(LinkStatus.ACTIVE);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const submit = async (): Promise<void> => {
    let hasError = false;
    if (!label) {
      setLabelError('A label must be provided');
      hasError = true;
    }
    if (!linkTarget) {
      setLinkTargetError('A target location must be provided');
      hasError = true;
    }
    if (hasError) {
      return;
    }

    setSubmitInProgress(true);
    try {
      const id = await createLink({
        label,
        status,
        linkTarget,
      });
      navigate(`/links/${id}/edit`);
    } catch (e) {
      console.error('Error occurred while trying to create link', e);
      setSubmitInProgress(false);
    }
  };

  return {
    label,
    setLabel: (value: string) => {
      setLabel(value);
      setLabelError(null);
    },
    labelError,
    linkTarget,
    setLinkTarget: (value: string) => {
      setLinkTarget(value);
      setLinkTargetError(null);
    },
    linkTargetError,
    status,
    setStatus,
    submitInProgress,
    submit,
  };
};
